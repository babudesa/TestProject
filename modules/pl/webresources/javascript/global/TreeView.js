/**
 * (c) 2007 Guidewire Software
 *
 * Defines the functionality for dynamic tree view widgets
 */

//--------------------------------------------------------------------- Interface:
var TreeView = {
  createTree : TreeViewImpl_createTree,
  treeElemsByFullId : []
}

//--------------------------------------------------------------------- Implementation:
/**
 * Creates a tree based on tree info
 * @param info  tree info object
 */
function TreeViewImpl_createTree(info) {
//  Debug.log('==START createTree')
  info.foldersToggled = [] // all folders that get toggled at client side, starting empty
  var container = document.getElementById(info.id);
  var buf = new StringBuffer();
  TreeViewImpl_createChildNodes(buf, info);
  container.innerHTML = buf.toString();
//  Debug.log('--END createTree')
}

/**
 * Creates child nodes recursively
 * @param buf  the string buffer that the child nodes will be rendered into
 * @param node  tree node
 */
function TreeViewImpl_createChildNodes(buf, node) {
  if (!node.items) {
    return;
  }

  // add indent for each level of child node:
  var prefix = node.prefix
  if (node.parent != node.tree) {
    prefix = (prefix ? prefix + ',' : '') + (node.bLast ? 'empty' : 'line');
  }

  if (node.items.length == 0) {
    // child info at server, render a place holder only:
    TreeViewImpl_renderNode(buf, null, prefix)
  } else {
    for (var i = 0; i < node.items.length; i++) {
      var child = node.items[i];
      child.parent = node;
      child.tree = node.tree ? node.tree : node;
      if (prefix) {
        child.prefix = prefix;
      }
      if (i==(node.items.length-1)) {
        child.bLast = true;
      }

      TreeViewImpl_renderNode(buf, child);

      // render build children of child node recursively:
      buf.append('<div')
              .append(' id = "tv_div_').append(child.tree.id).append('_').append(child.id).append('"')
              .append(' style="display:').append(child.open ? 'block' : 'none').append('">');
      TreeViewImpl_createChildNodes(buf, child);
      buf.append('</div>');
    }
  }

}

/**
 * Creates an icon, with an optional link to toggle a folder node
 * @param buf the string buffer that the icon will be rendered into
 * @param icon icon to render
 * @param node folder to toggle, if specified, a link will be created
 * @param id for the link
 * @param altText for the icon
 */
function TreeViewImpl_createIcon(buf, icon, node, id, altText) {

  // link to toggle a folder
  if (node) {
    var fullId = node.tree.id+'_'+node.id;
    TreeView.treeElemsByFullId[fullId] = node;
    buf.append('<a href="javascript:void(TreeViewImpl_toggleFolder(\'').append(id).append('\'))"')
            .append(' onclick="return Events.isNavigationAllowed()" id=').append(id)
            .append(' node="').append(fullId).append('"')
            .append('>');
  }

  buf.append('<img src="').append(Events.getResourceURL(icon)).append('"')
          .append(' alt=\"').append(altText).append("\"")
          .append(' label=\"').append(altText).append("\"")
          .append(' title=\"').append(altText).append("\"")
      .append(' border=0 width=18 height=18, align=top />');

  if (node) {
    buf.append('</a>')
  }
}

/**
 * Opens or closes a folder
 * @param elemId html element id
 */
function TreeViewImpl_toggleFolder(elemId) {
  var elem = document.getElementById(elemId);
  var node = TreeView.treeElemsByFullId[elem.getAttribute('node')]
  node.open = !node.open;

  // update folder icon
  elem.childNodes[0].src = 'images/tree/folder-' + (node.open ? 'open' : 'closed') + '.png';
  elem.childNodes[0].altText = node.open ? node.tree.closeAltText : node.tree.openAltText;
  elem.childNodes[0].label = node.open ? node.tree.closeAltText : node.tree.openAltText;
  elem.childNodes[0].title = node.open ? node.tree.closeAltText : node.tree.openAltText;

  // show/hide folder contents
  var contentsDiv = DHTML.getElementById('tv_div_' + node.tree.id+'_'+node.id);
  contentsDiv.style.display = node.open ? 'block' : 'none';

  if (node.items.length == 0 && node.open) {
    // load child info from server:
    AJAX.initRequest(node.tree.id, {folderId:node.id}, function() {
      node.items = AJAX.returnValue;
      var buf = new StringBuffer()
      TreeViewImpl_createChildNodes(buf, node)
      contentsDiv.innerHTML = buf.toString()
    }, true)
  } else {
    // mark folder toggled locally
    var index = ArrayUtil.indexOf(node.id, node.tree.foldersToggled);
    if (index >= 0) {
      ArrayUtil.removeElement(node.tree.foldersToggled, index);
    } else {
      ArrayUtil.appendElement(node.tree.foldersToggled, node.id);
    }
    // add folders state to form, so that it will post to server with the form
    document.getElementById(node.tree.id + '_toggle').value = node.tree.foldersToggled.toString();
  }
}

/**
 * Handles click on a node
 * @param elemId element id
 */
function TreeViewImpl_clickNode(elemId) {
  var node = TreeView.treeElemsByFullId[document.getElementById(elemId).getAttribute('node')]
  Events.invokeEvent(node.tree.id, true, node.id);
}

/**
 * Renders prefix icons to properly indent each node
 */
function TreeViewImpl_renderPrefixIcons(buf, iconList) {
  if (iconList) {
    var iconArray = iconList.split(',');
    for (var i = 0; i < iconArray.length; i++){
      TreeViewImpl_createIcon(buf, 'images/tree/'+ iconArray[i] +'.png')
    }
  }
}

/**
 * Renders a tree node into the container element
 */
function TreeViewImpl_renderNode(buf, node, prefix) {
  TreeViewImpl_renderPrefixIcons(buf, prefix  || (node && node.prefix));
  
  if (node == null) { // node info not yet available:
    
    TreeViewImpl_createIcon(buf, 'images/tree/loading_icon.png')

    buf.append('<span class="treeViewLoading">').append(AJAX.getLoadingHTML()).append('</span>')

  } else {
    
    // renders node icon:
    if (node.parent != node.tree) {
      TreeViewImpl_createIcon(buf, 'images/tree/' + (node.bLast ? 'corner' : 'cross') + '.png');
    }

    var styleClass = node.current ? 'treeViewCurrentItem ' : '';
    var fullId = node.tree.id+'_'+node.id
    if (node.items) { // folder
      TreeViewImpl_createIcon(buf, 'images/tree/folder-' + (node.open ? 'open' : 'closed') + '.png',
              node, 'tv_folder_' + fullId, node.open ? node.tree.closeAltText : node.tree.openAltText);
      styleClass += node.tree.folderStyle;
    } else { // leaf
      TreeViewImpl_createIcon(buf, 'images/tree/dash.png');
      styleClass += node.tree.leafStyle;
    }

    if (node.canClick) {
      // node with action:
      TreeView.treeElemsByFullId[fullId] = node;
      buf.append('<span class="').append(styleClass).append('">')
          .append('<a href="javascript:void(TreeViewImpl_clickNode(\'').append(fullId).append('\'))"')
          .append(' id="').append(fullId).append('"')
          .append(' node="').append(fullId).append('"')
          .append(' class="').append(styleClass).append('">')
          .append(node.lbl)
          .append('</a>')
          .append('</span>');
    } else {
      // node without action:
      buf.append('<span class="').append(styleClass).append('" id="').append(fullId).append('">')
              .append(node.lbl)
              .append('</span>');
    }
  }

  buf.append('<br>');

}

