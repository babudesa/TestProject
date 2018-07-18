/**
 *
 */

//-------------------------------------------------------------------------- interface
window.Menu = new MenuImpl();

function MenuImpl() {
  this.TAB_MENU_ON = 0;
  this.TAB_MENU_OFF = 1;
  this.ACTION_NAV_MENU = 2;
  this.DV_POPUP_MENU = 3;
  this.MENU_BUTTON = 4;
  this.TABBAR_LINK = 5;
  this.MORE_TAB = 6;

  this.MENU_STYLES = [
    {"className": "tab_on", "isTopMenu": true,  "align": "v", "xOffset": 0, "yOffset": 4, "outerArrow" : true},
    {"className": "tab_off", "isTopMenu": true,  "align": "v", "xOffset": 0, "yOffset": 4, "outerArrow" : true},
    {"className": "menubutton", "isTopMenu": false,  "align": "h", "xOffset": 0, "yOffset": 0, "outerArrow" : true},
    {"className": "dv", "isTopMenu": false,  "align": "v", "xOffset": 4, "yOffset": 0, "outerArrow" : false},
    {"className": "menubutton", "isTopMenu": false,  "align": "v", "xOffset": 0, "yOffset": 0, "outerArrow" : true},
    {"className": "tabbarlink", "isTopMenu": false,  "align": "v", "xOffset": 0, "yOffset": 0, "outerArrow" : true},
    {"className": "tab_off", "isTopMenu": true,  "align": "v", "xOffset": 0, "yOffset": 4, "outerArrow" : true},
  ];

  /**
   * Array of openMenu objects. Each openMenu object contains a menu, representing a menu which is currently
   * displayed in the ui, the index of the currently active item, and a reference to the active item itself.
   */
  this.openMenus = new Array();

  this.menus = new Object();
  this.topLevelMenus = new Array();
  this.tabMenus = new Array();
  this.moreTabMenus = [];
}

MenuImpl.prototype.createMenu = MenuImpl_createMenu;
MenuImpl.prototype.keyboardEnterMenu = MenuImpl_keyboardEnterMenu;
MenuImpl.prototype.menuArrowKey = MenuImpl_menuArrowKey;
MenuImpl.prototype.menuEscapeKey = MenuImpl_menuEscapeKey;
MenuImpl.prototype.menuEnterKey = MenuImpl_menuEnterKey;
MenuImpl.prototype.menuClickAway = MenuImpl_menuClickAway;
MenuImpl.prototype.menuShortcutKey = MenuImpl_menuShortcutKey;
MenuImpl.prototype.createMoreTab = MenuImpl_createMoreTab;

//-------------------------------------------------------------------------- implementation
function MenuImpl_removeMenus(menuId) {
  for (var i=0; i<Menu.topLevelMenus.length; i++) {
    var menu = Menu.topLevelMenus[i];
    if (menu.id == menuId) {
      ArrayUtil.removeElement(Menu.topLevelMenus, i)
      MenuImpl_removeMenu(menu);
      break;
    }
  }
}

function MenuImpl_removeMenu(menu) {
  Menu.menus[menu.id] = undefined;
  menu.node.parentNode.removeChild(menu.node);
  if (menu.items) {
    for (var i=0; i<menu.items.length; i++) {
      MenuImpl_removeMenu(menu.items[i]);
    }
  }
}

/**
 *@param subMenus if null, creation of subMenus is deferred.
 */
function MenuImpl_createMenu(styleId, menuId, menuText, menuURL, subMenus, numEntriesPerColumn, flatten, disabled) {
  // remove stale menu, if any:
  MenuImpl_removeMenus(menuId);

  var menu = new Object();
  menu.id = menuId;
  menu.style = this.MENU_STYLES[styleId];
  menu.disabled = disabled;
  menu.shortcuts = new Array();
  menu.shortcutItems = new Array();

  this.menus[menuId] = menu;
  this.topLevelMenus.push(menu);

  var container = document.getElementById(menuId + "_container");
  menu.container = container;
  var leftSpan = DHTML.createElement('span', 'class', 'menu_' + menu.style.className + '_left');
  container.appendChild(leftSpan);

  menu.node = DHTML.createElement('span', 'id', 'menu_' + menu.id, 'class', 'menu_' + menu.style.className,
          'onclick', 'event.cancelBubble = true;', 'onMouseOver', 'MenuImpl_mouseOverMenu(\'' + menu.id + '\')');

  var showJS = 'MenuImpl_showMenu(\'' + menu.id + '\')';
  if (menuURL == 'void(\'OPENPANEL\')') {
    menu.bPanelMenu = true;
    menuURL = showJS;
  } else if (menuURL == '') {
    if (!disabled || subMenus != null) {
      menuURL = showJS;
    }
  }

  var onrecord = null;
  if (!MenuImpl_subMenuOnServer(subMenus)) {
    if (menuURL == showJS) {
      onrecord = 'void(null)'; // do not record if no action and menu not on server
    }
  } else {
    showJS = showJS+';Recorder.click(this)'; // record open-menu, if menu on server
  }

  menu.onfocus = null;
  MenuImpl_writeMenuLink(menuText, menuURL, onrecord, menu.onfocus, '', menu.style, 'menu_link_' + menu.style.className, false, menu.id, menu.node);

  if (menu.style.outerArrow && subMenus != null) { // draw arrow, if there's sub menu
    var aElem = DHTML.createElement('a', 'id', menu.id + '_arrow', 'onClick', showJS);
    menu.node.appendChild(aElem);
    MenuImpl_writeOuterArrow(menu.style, aElem);
  }

  container.appendChild(menu.node);

  var rightSpan = DHTML.createElement('span', 'class', 'menu_' + menu.style.className + '_right');
  container.appendChild(rightSpan);

  menu.body = DHTML.createElement('div', 'id', 'menu_body_' + menu.id,
          'class', 'menu_body', 'style', 'display:none; position:absolute; top: 0px; left: 0px; z-index: 100');
  var bodyContainer = DHTML.createElement('div', 'class', 'menu_' + menu.style.className);
  bodyContainer.appendChild(menu.body);
  document.mainForm.insertBefore(bodyContainer, document.mainForm.childNodes[0]);

  MenuImpl_createSubMenus(menu, menu.body, subMenus, numEntriesPerColumn, flatten ? 1 : 0);

  if(menu.style.isTopMenu) {
    menu.text = menuText;
    menu.url = menuURL;
    this.tabMenus.push(menu);
  }
}

function MenuImpl_isTabElemFlowDropped(e1,e2) {
  return DHTML.getElementTop(e2.parentNode) > DHTML.getElementTop(e1.parentNode);
}

function MenuImpl_createMoreTab() {
  if (this.tabMenus.length > 1) {
    var droppedActiveTab = null;
    var firstTab = this.tabMenus[0];
    var lastShown = 0;
    for (var i = 1; i < this.tabMenus.length; i++) {
      var tab = this.tabMenus[i];
      if (this.moreTabMenus.length > 0 ||
          MenuImpl_isTabElemFlowDropped(firstTab.container, tab.container)) { // fix tabs which do not fit into the screen:
        if (tab.style == this.MENU_STYLES[this.TAB_MENU_ON]) { // remember active tab
          droppedActiveTab = tab;
        } else { // move inactive tab under "more" tab
          tab.container.parentNode.style.display = "none";
          this.moreTabMenus.push(tab);
        }
      } else {
        lastShown = i;
      }
    }

    if (droppedActiveTab || this.moreTabMenus.length > 0) { // too many tabs to fit into the screen
      // add "more" tab to the screen:
      var moreTab = DHTML.createElement('div', 'id', 'tab_more', 'class', 'tab_more', 'title', this.moreTabTitle,
              'onmouseenter', 'DHTML.buttonEnter(this)', 'onmouseleave', 'DHTML.buttonLeave(this)');
      firstTab.container.parentNode.parentNode.appendChild(moreTab);
      var moreTabContainer = DHTML.createElement('span', 'id', 'more_tab_container');
      moreTab.appendChild(moreTabContainer);

      while (MenuImpl_isTabElemFlowDropped(firstTab.container, moreTabContainer) ||
              droppedActiveTab && MenuImpl_isTabElemFlowDropped(firstTab.container, droppedActiveTab.container)) { // make room for active tab and the "more" tab:
        if (this.tabMenus[lastShown].style == this.MENU_STYLES[this.TAB_MENU_ON]) {
          lastShown --;
          if (lastShown < 0) {
            break;
          }
        }
        var lastTab = this.tabMenus[lastShown];
        lastTab.container.parentNode.style.display = "none";
        this.moreTabMenus.push(lastTab);
        lastShown--;
        if (lastShown < 0) {
          break;
        }
      }

      // create sub menu for "more" tab:
      var moreTabItems = [];
      for(var i = 0; i < this.moreTabMenus.length; i++) {
        moreTabItems[i] = new Object();
        moreTabItems[i].id = this.moreTabMenus[i].id;
        this.moreTabMenus[i].id = '';  // TODO kcp - clear out child IDs too?
        moreTabItems[i].url = this.moreTabMenus[i].url;
        moreTabItems[i].text = this.moreTabMenus[i].text;
        moreTabItems[i].items = this.moreTabMenus[i].items;
      }
      this.createMenu(this.MORE_TAB, 'more_tab', '', '', moreTabItems, 0, false, false);
    }

    var tabsContainer = DHTML.getElementById('topModetabs_middle');
    if (!tabsContainer.style.width) {
      tabsContainer.style.width = tabsContainer.offsetWidth + 3 + 'px'; // set tabs container to fixed width, to prevent flow drop
    }
  }
}

function MenuImpl_createSubMenus(menu, body, subMenus, numEntriesPerColumn, flattenDepth) {
  if(!flattenDepth) {
    flattenDepth = 0
  }
  if (menu.items) {
    // clear stale menu items, if any
    for (var i=0; i<menu.items.length; i++) {
      var item = menu.items[i];
      if (!ArrayUtil.inArray(item, subMenus)) {
        item.node.parentNode.removeChild(item.node);
        Menu.menus[item.id] = undefined;
      }
    }
  }

  menu.items = subMenus;
  if (subMenus == null || subMenus.length == 0) {
    return;
  }

  var parentNodes = new Array();
  if(numEntriesPerColumn > 0 && menu.items.length > numEntriesPerColumn) {
    for(var i = 0; i < Math.ceil(menu.items.length / numEntriesPerColumn); i++) {
      var columnNode = DHTML.createElement('span', 'class', 'menu_column');
      body.appendChild(columnNode);
      parentNodes[i] = columnNode;
    }
  } else {
    parentNodes[0] = body;
  }
  var col = 0;
  for (var i = 0; i < menu.items.length; i++) {
    MenuImpl_createItem(menu, parentNodes[col], menu.items[i], numEntriesPerColumn, flattenDepth);
    if((i + 1) % numEntriesPerColumn == 0) {
      col++;
    }
  }
}

/**
 * Writes up a single menu item
 */
function MenuImpl_createItem(menu, parentNode, item, numEntriesPerColumn, flattenDepth) {

  if (item.isFlat) {
    flattenDepth = 1; // restore value when this method is called again from creating "More" tab
  }

  var oldItem = Menu.menus[item.id];
  if (oldItem) {
    item.disabled = oldItem.disabled; // restore container when this method is called again from creating "More" tab
  }

  Menu.menus[item.id] = item;

  item.parent = item.menu = menu;
  item.style = menu.style;

  if (item.htmlSrc != null) {

    if (oldItem && oldItem.node) {
      item.node = oldItem.node.parentNode.removeChild(oldItem.node);
    } else {
      var temp = DHTML.createElement("span");
      DHTML.setInnerHTML(temp, item.htmlSrc);
      item.node = temp.removeChild(temp.firstChild);
    }
    parentNode.appendChild(item.node);
    DHTML.setFieldToClosure(item.node, "onmouseover", function() {MenuImpl_mouseOverMenuItem(menu,item);});

    if (item.focusableId) {
      item.focusable = document.getElementById(item.focusableId);
    }

    item.isVirtual = true;

  } else {

    var onClick = '';
    var hasSubItems = MenuImpl_hasSubItems(item);

    if(hasSubItems && flattenDepth > 0) {
      var groupNode = DHTML.createElement('div', 'class', 'menu_group');
      parentNode.appendChild(groupNode);
      parentNode = groupNode;
    } else {
      onClick = 'MenuImpl_hideAllMenus();';
    }

    if(!item.disabled) {
      onClick += item.url.replace(/\"/g, "'"); // Replace " with '
    }

    item.node = DHTML.createElement('div', 'id', 'menu_item_' + menu.id + '_' + item.id,
            'class', (flattenDepth > 0) && hasSubItems ? 'menu_header' :
                     item.divider ? 'menu_item_divider' :
                        'menu_item' + (item.disabled ? "_disabled" : ""),
            'nowrap', 'true',
            'onClick', onClick + ';event.cancelBubble = true',
            'title', item.tooltip ? item.tooltip : '');
    if((flattenDepth <= 0 || !hasSubItems || (item.url && item.url != 'void(0)' && item.url != '')) && !item.disabled) {
      DHTML.setFieldToClosure(item.node, "onmouseover", function() {MenuImpl_mouseOverMenuItem(menu,item);});
      item.text = MenuImpl_makeMenuShortcut(item.text, menu, item);
    }
    if(hasSubItems && flattenDepth <= 0 && !(item.url && item.url != 'void(0)' && item.url != '')) {
      DHTML.setFieldToClosure(item.node, "onclick", function() {MenuImpl_mouseOverMenuItem(menu,item);});
    }
    parentNode.appendChild(item.node);

    MenuImpl_writeMenuLink(item.text, item.url, null, '', null, menu.style, 'menu_item_link', hasSubItems && (flattenDepth <= 0), item.id, item.node, item.checked);

    if (hasSubItems) {
      if(flattenDepth > 0) {
        item.isFlat = true;
        MenuImpl_createSubMenus(item, parentNode, item.items, 0, flattenDepth - 1);
      } else {
        item.body = DHTML.createElement('div',
                'id', 'menu_body_' + item.id,
                'class', 'menu_body',
                'style', 'display:none; position:absolute; top: 0px; left: 0px; z-index:100');
        parentNode.appendChild(item.body);
        MenuImpl_createSubMenus(item, item.body, item.items, 0, 0);
      }
    }
  }

}

function MenuImpl_showMenu(menuId) {
  if(!Events.isNavigationAllowed()) return;

  var menu = Menu.menus[menuId];
  if (menu.container.disabled) return;

  clearCalendar();
  MenuImpl_hideAllMenus();

  var askServer = false;
  if (MenuImpl_subMenuOnServer(menu.items)) {
    askServer = true;
    if (menu.bPanelMenu) {
      menu.items = AJAX.getLoadingHTML();
    } else {
      MenuImpl_createSubMenus(menu, menu.body, [{text:AJAX.getLoadingHTML(), disabled:'true'}]);
    }
  }

  if (menu.bPanelMenu) {
    Menu.openMenus[Menu.openMenus.length] = MenuImpl_createOpenMenu(menu, 0);
    ScrollingPanel.showText(document.getElementById(menuId), menu.items, 'popupPanel', true, 500, 800, true);
  } else {
    if (!menu.items) {
      return;
    }

    MenuImpl_positionMenuBody(menu.node, menu.body, menu.style);
    for(var i = 0; i < menu.items.length; i++) {
      if(menu.items[i].divider) {
        if (i == 0 || i == menu.items.length - 1) {
          menu.items[i].node.style.display = 'none'; // do not show divider if not between items
        } else {
          menu.items[i].node.style.width = DHTML.getElementWidth(menu.body);
        }
      }
    }
    Menu.openMenus[Menu.openMenus.length] = MenuImpl_createOpenMenu(menu, 0);

    var toSelect = MenuImpl_firstEnabledItem(menu);
    if (toSelect) {
      while(toSelect.isFlat && toSelect.items && toSelect.items.length > 0 && (toSelect.url == "void(0)" || toSelect.url == "")) {
        toSelect = MenuImpl_firstEnabledItem(toSelect);
      }
      MenuImpl_setSelectedMenuItem(menu, toSelect);
    }
  }

  if (askServer) {
    window.AJAX.initRequest(DHTML.findOriginalElementId(menu), null,
            function(){
              if (menu.bPanelMenu) {
                menu.items = AJAX.returnValue;
              } else {
                eval("MenuImpl_createSubMenus(menu, menu.body, " + AJAX.returnValue + ")");
              }
              MenuImpl_showMenu(menuId);
            }, true);
  }
}

function MenuImpl_firstEnabledItem(menu) {
  var i = 0;
  while(menu.items && i < menu.items.length && menu.items[i].disabled) {
    i++;
  }
  return menu.items[i];
}

function MenuImpl_writeMenuLink(text, url, onrecord, onfocus, onclick, style, className, hasSubItems, id, parentElem, checked) {
  if (hasSubItems) {
    var imgElem = DHTML.createElement('span', 'class', className + '_arrow');
    parentElem.appendChild(imgElem);
  }

  if (checked) {
    var imgElem = DHTML.createElement('span', 'class', className + '_checked', 'id', id+'_checked');
    parentElem.appendChild(imgElem);
  }

  var spanElem;
  if (url) {
    url = url.replace(/\"/g, "'"); // Replace " with '
    if ((onclick == null) && !hasSubItems) {
      onclick = "MenuImpl_hideAllMenus();";
    }

    if ((url != null) && (url != "javascript:void(null)") && hasSubItems) {
      url = url + ";MenuImpl_hideAllMenus();";
    }

    onclick += ";" + url;

    // render an anchor so that it can be accessed by TAB key
    spanElem = DHTML.createElement('a', 'id', id, 'class', className,
            'href', 'javascript:void(0)',
            'onclick', 'Recorder.click(this);' + onclick
            + ';event.cancelBubble=true',
            (onrecord != null ? 'onrecordclick' : ""), onrecord,
            (onfocus == '' ? 'hidefocus' : 'onfocus'), (onfocus == '' ? 'true' : onfocus));
  } else {
    spanElem = DHTML.createElement('span', 'id', id);
  }
  parentElem.appendChild(spanElem);
  DHTML.setInnerHTML(spanElem, text);
}

/**
 * Writes the outer arrow image.
 */
function MenuImpl_writeOuterArrow(menuStyle, parentElem) {
  var imgElem = DHTML.createElement('span', 'class', 'menu_arrow_' + menuStyle.className, 'border', '0');
  parentElem.appendChild(imgElem);
}

/**
 * Switch to the menu only if another menu is open
 */
function MenuImpl_mouseOverMenu(menuIndex) {
  with (Menu) {
    if (openMenus.length > 0 && openMenus[openMenus.length-1].menu.id != menuIndex) {
      MenuImpl_showMenu(menuIndex);
    }
  }
}

/**
 * Shows a given sub menu, optionally making the first item on that menu active
 */
function MenuImpl_showSubMenus(menuItem, selectFirstItem) {
  with (Menu) {
    if (menuItem.items == null || menuItem.isFlat ||
            menuItem.body.style.display == 'block')  {
      return;
    }

    var askServer = false;
    if (MenuImpl_subMenuOnServer(menuItem.items)) { // items info at server side
      askServer = true;
      MenuImpl_createSubMenus(menuItem, menuItem.body, [{text:AJAX.getLoadingHTML(), disabled:'true'}]);
    }

    openMenus[openMenus.length] = MenuImpl_createOpenMenu(menuItem, selectFirstItem?0:-1);
    if (selectFirstItem) {
      var subItemToSelect = MenuImpl_firstEnabledItem(menuItem);
      if (subItemToSelect) {
        MenuImpl_setSelectedMenuItem(menuItem, subItemToSelect);
      }
    }
    MenuImpl_positionSubMenuBody(menuItem.node, menuItem.body);
    for(var i = 0; i < menuItem.items.length; i++) {
      if(menuItem.items[i].divider) {
        if (i == 0 || i == menuItem.items.length - 1) {
          menuItem.items[i].node.style.display = 'none'; // do not show divider if not between items
        } else {
          menuItem.items[i].node.style.width = DHTML.getElementWidth(menuItem.body) - 2;
        }
      }
    }

    if (askServer) {
      window.AJAX.initRequest(DHTML.findOriginalElementId(menuItem), null,
        function(){
          eval("MenuImpl_createSubMenus(menuItem, menuItem.body, " + AJAX.returnValue + ")");
          menuItem.body.style.display = 'none';
          MenuImpl_showSubMenus(menuItem, selectFirstItem);
        }, true)
    }
  }
}

/**
 * Hides any menus that might be showing
 */
function MenuImpl_hideAllMenus() {
  with (Menu) {
    if (openMenus.length > 0) {
      for (var i=0;i<openMenus.length;i++) {
        MenuImpl_hideSubMenu(openMenus[i]);
      }
      openMenus = new Array();
    }
  }
}


/**
 * Hide a specific submenu, and clean up the highlighting on its active item
 */
function MenuImpl_hideSubMenu(openMenu) {
  if (openMenu.menu.bPanelMenu) {
    ScrollingPanel.hideText();
  } else {
    if (openMenu.menu.body.style.display == 'none') {
      return;
    }
    DHTML.unshimElement(openMenu.menu.body);
    openMenu.menu.body.style.display = 'none';
    if (openMenu.activeItem != null) {
      MenuImpl_unhighlightMenuItem(openMenu.activeItem);
    }
  }
}

// ------------------------------------- Keyboard navigation

/**
 * Called by the keyboard shortcuts to enter a menu
 */
function MenuImpl_keyboardEnterMenu(menuId, calledFromFocus) {
  with (Menu) {
    if (!calledFromFocus && menus[menuId].node.firstChild.onfocus) { // Focus if menu off screen
      menus[menuId].node.firstChild.focus();
      if (menus[menuId].onfocus == null) { // Focus didn't show menu automatically, so do it manually
        MenuImpl_showMenu(menuId);
      }
    } else {
      MenuImpl_showMenu(menuId);
    }
    EventHandlers.clearLastFocus();
  }
}

/**
 * Called by the keyboard shortcuts to use the arrows to move between menus
 */
function MenuImpl_menuArrowKey(dir, event) {
  with (Menu) {
    if (openMenus.length == 0) {
      EventHandlers.clearLastFocus();
      return;
    }
    var currItem = MenuImpl_getActiveMenuItem();
    if (currItem != null && currItem.isVirtual && (dir == "Left" || dir == "Right")) {
      EventHandlers.clearLastFocus();
      return;
    }
    if(!event) {
      event = window.event;
    }
    event.returnValue = false;
    event.cancelBubble = true;
    if (dir == "Up") {
      MenuImpl_moveMenuItemSelectionDelta(-1);
    } else if (dir == "Down") {
      MenuImpl_moveMenuItemSelectionDelta(1);
    } else if (dir == "Left") {
      if (openMenus.length > 1) {
        MenuImpl_closeSubMenuKey();
      } else {
        MenuImpl_moveMenuKey(-1);
      }
    } else if (dir == "Right") {
      if (currItem == null) {
        //there's a menu open which hasn't been navigated into yet, probably because of an odd
        //keyboard navigation/mouse position interaction (ie the user keyboarded open a menu, and the menu
        //landed on the mouse position, which then opened a sub menu)
        //set the first menu item to be open
        var currOpenMenu = openMenus[openMenus.length-1];
        var topMenu = MenuImpl_hasSubItems(currOpenMenu.menu) ? currOpenMenu.menu.menu : currOpenMenu.menu;
        MenuImpl_setSelectedMenuItem(topMenu, MenuImpl_firstEnabledItem(currOpenMenu.menu));
        currItem = MenuImpl_getActiveMenuItem();
      }
      if (MenuImpl_hasSubItems(currItem)) {
        MenuImpl_openSubMenuKey();
      } else {
        MenuImpl_moveMenuKey(1);
      }
    }
    EventHandlers.clearLastFocus();
  }
}

function MenuImpl_getActiveMenuItem() {
  with (Menu) {
    if (openMenus.length == 0) return null;
    return openMenus[openMenus.length-1].activeItem;
  }
}

/**
 * Called to invoke a menu item, if one is keyboard-selected
 */
function MenuImpl_menuEnterKey(event) {
  if(!event) {
    event = window.event;
  }
  var item = MenuImpl_getActiveMenuItem();
  if (item == null) {
    EventHandlers.clearLastFocus();
    return false;
  }
  if (MenuImpl_hasSubItems(item) && !item.isFlat) {
    MenuImpl_openSubMenuKey();
    event.returnValue = false;
    event.cancelBubble = true;
  } else if (item.isVirtual) {
    EventHandlers.clearLastFocus();
    return true;
  } else {
    event.returnValue = false;
    event.cancelBubble = true;
    var itemInput = MenuImpl_findFocusableItemNode(item);
    if (itemInput != null && (itemInput.tagName == 'A' || itemInput.onclick)) {
      itemInput.onclick();
    }
    MenuImpl_menuEscapeKey(true, event);
  }
  EventHandlers.clearLastFocus();
  return true;
}

/**
 * Called to note the ESC, Delete or Backspace key was pressed
 */
function MenuImpl_menuEscapeKey(doClearCalendar, event) {
  if(!event) {
    event = window.event;
  }
  with (Menu) {
    var currItem = MenuImpl_getActiveMenuItem();
    var isBackspace = event.keyCode == 8;
    var swallowed = false;
    if (currItem != null && currItem.isVirtual && isBackspace) {
      // Do nothing
    } else if (openMenus.length > 0) {
      var isTop = (openMenus[openMenus.length-1].menu.style && openMenus[openMenus.length-1].menu.style.isTopMenu);
      MenuImpl_hideAllMenus();
      if (isTop) {
        DHTML.setInitialFocus();
      }
      event.returnValue = false;
      event.cancelBubble = true;
      swallowed = true;
    }
    EventHandlers.clearLastFocus();
    if (doClearCalendar) {
      clearCalendar(true);
    }
    // CC-10736: Swallow backspace providing we haven't done it already, and the
    // target isn't a text field. This stops backspace from doing a browser Back
    if (isBackspace && !swallowed && !MenuImpl_targetOfEventIsTextField(event)) {
      event.returnValue = false;
      event.cancelBubble = true;
    }
  }
}

/**
 * Is the target of the current event a text field or some other input where
 * we want the default backspace to apply?
 */
function MenuImpl_targetOfEventIsTextField(event) {
  var target = event.srcElement;
  return target != null &&
      (target.type == "text" ||
       target.type == "textarea" ||
       target.type == "password") &&
      !target.readOnly;
}

/**
 * Called to note the user clicked away
 */
function MenuImpl_menuClickAway() {
  var currItem = MenuImpl_getActiveMenuItem();
  if (currItem != null && currItem.isVirtual) {
    // Do nothing
  } else if (MenuImpl_mouseInOpenMenu(0)) {
    // Do nothing; if menu item is clicked, it will handle the closing itself
  } else {
    MenuImpl_hideAllMenus();
  }
}

/**
 * Called to note that a menu shortcut may have been invoked
 */
function MenuImpl_menuShortcutKey(keyChar, event) {
  if(!event) {
    event = window.event;
  }
  with (Menu) {
    if (openMenus.length == 0) {
      EventHandlers.clearLastFocus();
      return;
    }
    var menu = openMenus[openMenus.length-1].menu;
    if (menu.shortcuts) {
      for (var i = 0; i < menu.shortcuts.length; i++) {
        if (menu.shortcuts[i] == keyChar) {
          var item = menu.shortcutItems[i];
          if (MenuImpl_hasSubItems(item) && !item.isFlat) {
            MenuImpl_setSelectedMenuItem(menu, item);
            MenuImpl_showSubMenus(item, true);
          } else {
            var itemInput = MenuImpl_findFocusableItemNode(item);
            if (itemInput != null && (itemInput.tagName == 'A' || itemInput.onclick)) {
              itemInput.onclick();
            }
            MenuImpl_menuEscapeKey(true, event);
          }
          event.returnValue = false;
          event.cancelBubble = true;
        }
      }
    }
    EventHandlers.clearLastFocus();
  }
}

/**
 * Moves the currently selected menu item up or down by the indicated amount
 * (will be -1 for up, +1 for down)
 */
function MenuImpl_moveMenuItemSelectionDelta(delta) {
  with (Menu) {
    var currItem = MenuImpl_getActiveMenuItem();
    var currOpenMenu = openMenus[openMenus.length-1];
    var newIndex = currOpenMenu.activeIndex;
    var visibleItems = MenuImpl_getVisibleItems(currOpenMenu.menu);
    do {
      newIndex += delta;
      if ((newIndex < 0) || (newIndex >= visibleItems.length)) return;
      currItem = visibleItems[newIndex];
    } while((currItem.items && currItem.items.length > 0 && currItem.isFlat && (currItem.url == "void(0)" || currItem.url == "")) || currItem.disabled);
    MenuImpl_setSelectedMenuItem(currOpenMenu.menu, visibleItems[newIndex]);
  }
}

function MenuImpl_getVisibleItems(menu) {
  var items = new Array();
  for(var i = 0; i < menu.items.length; i++) {
    items.push(menu.items[i]);
    if(menu.items[i].isFlat) {
      items = items.concat(MenuImpl_getVisibleItems(menu.items[i]));
    }
  }
  return items;
}

/**
 * Sets the selected menu item
 */
function MenuImpl_setSelectedMenuItem(menu, item, autoOpenSubMenu) {
  with (Menu) {
    var index = 0;
    var items = MenuImpl_getVisibleItems(menu);
    for (var i=0;i<items.length;i++) {
      if (items[i] == item) {
        index = i;
        break;
      }
    }

    //Go through and hide any sub menus which might be open from other menu items
    for (var i=openMenus.length-1;i>0;i--) {
      if (openMenus[i].menu == (menu.isFlat ? menu.menu : menu)) {
        break;
      }
      MenuImpl_hideSubMenu(openMenus.pop());
    }
    if(openMenus.length == 0) {
      return;
    }

    var currItem = MenuImpl_getActiveMenuItem();
    if (currItem != null) MenuImpl_unhighlightMenuItem(currItem);
    openMenus[openMenus.length-1].activeIndex = index;
    openMenus[openMenus.length-1].activeItem = item;
    MenuImpl_highlightMenuItem(item);
    if (autoOpenSubMenu) MenuImpl_showSubMenus(MenuImpl_getActiveMenuItem(), true);
  }
}

/**
 * Highlight the indicated menu item
 */
function MenuImpl_highlightMenuItem(item) {
  item.node.oldClassName = item.node.className;
  item.node.className = item.node.className + "_highlighted";
  var itemInput = MenuImpl_findFocusableItemNode(item);
  if (itemInput == null) {
    return;
  } else if (itemInput.tagName == 'INPUT' || itemInput.tagName == 'A') {
    try {
      itemInput.focus();
    } catch (e) {}
  } else if (itemInput.style) {
    itemInput.style.textDecoration = 'underline';
  }
}

/**
 * Remove the highlighting on a menu item
 */
function MenuImpl_unhighlightMenuItem(item) {
  if (item.isVirtual) {
    MenuImpl_findFocusableItemNode(item).blur();
  }
  if (item.node.oldClassName) item.node.className = item.node.oldClassName;
  var itemInput = MenuImpl_findFocusableItemNode(item);
  if (itemInput != null && itemInput.style) {
    itemInput.style.textDecoration = '';
  }
}


/**
 * Opens a submenu via the keyboard
 */
function MenuImpl_openSubMenuKey() {
  MenuImpl_showSubMenus(MenuImpl_getActiveMenuItem(), true);
}

/**
 * Closes a submenu via the keyboard
 */
function MenuImpl_closeSubMenuKey() {
  MenuImpl_hideSubMenu(Menu.openMenus.pop());
}

/**
 * Move to a new menu via the keyboard
 */
function MenuImpl_moveMenuKey(delta) {
  with (Menu) {
    var newOpenMenu = ArrayUtil.indexOf(openMenus[0].menu, topLevelMenus) + delta;
    while(!(newOpenMenu < 0 || newOpenMenu >= topLevelMenus.length) &&
          (!topLevelMenus[newOpenMenu].items || topLevelMenus[newOpenMenu].items.length == 0
                  || ArrayUtil.inArray(topLevelMenus[newOpenMenu], moreTabMenus))) { // skip top-level menus that hide under More-tab
      newOpenMenu += delta;
    }
    if (newOpenMenu < 0 || newOpenMenu >= topLevelMenus.length ||
        !openMenus[openMenus.length-1].menu.style || !topLevelMenus[newOpenMenu].style ||
        !openMenus[openMenus.length-1].menu.style.isTopMenu || !topLevelMenus[newOpenMenu].style.isTopMenu) {
      return;
    }
    MenuImpl_keyboardEnterMenu(topLevelMenus[newOpenMenu].id);
  }
}

/**
 * Adds a menu-internal shortcut
 */
function MenuImpl_makeMenuShortcut(itemText, menu, item) {
  if (itemText.indexOf('<') != -1 || itemText.indexOf('+') != -1) {
    return itemText;
  }
  var upperCaseText = itemText.toUpperCase();
  for (var i = 0; i < itemText.length; i++) {
    var c = upperCaseText.substr(i, 1);
    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) != -1) {
      var alreadyUsed = false;
      while(menu.parent && menu.isFlat) {
        menu = menu.parent;
      }
      if (menu.shortcuts) {
        for (var j = 0; j < menu.shortcuts.length; j++) {
          if (menu.shortcuts[j] == c) {
            alreadyUsed = true;
            break;
          }
        }
      } else {
        menu.shortcuts = new Array();
        menu.shortcutItems = new Array();
      }
      if (!alreadyUsed) {
        menu.shortcuts[menu.shortcuts.length] = c;
        menu.shortcutItems[menu.shortcutItems.length] = item;
        return itemText.substr(0, i) + "<u>" + itemText.substr(i, 1) + "</u>" + itemText.substr(i + 1);
      }
    } else if (c == '&') { // Skip entity
      while (i < itemText.length && upperCaseText.substr(i, 1) != ';') {
        i++;
      }
    }
  }
  return itemText;
}

// ------------------------------------- Menu positioning

/**
 * Position a menu body correctly
 */
function MenuImpl_positionMenuBody(menuNode, menuBody, style) {
  if (menuBody.parentElement != document.body && !DHTML.isFirefox) {
    if(menuBody.parentElement) {
      menuBody.parentElement.removeChild(menuBody);
    }
    document.mainForm.insertBefore(menuBody, document.mainForm.childNodes[0]);
  }
  var left = DHTML.getElementLeft(menuNode.parentNode) + style.xOffset;
  var top = DHTML.getElementTop(menuNode.parentNode) + style.yOffset;
  if(style.align == "h") {
    left += DHTML.getElementWidth(menuNode.parentNode);
  } else if(style.align == "v") {
    top += DHTML.getElementHeight(menuNode);
  }
  menuBody.style.display = "block"; // make the menu visible before measuring its width
  var width = DHTML.getElementWidth(menuBody);
  if(left + width > document.body.scrollLeft + document.body.clientWidth) {
    left = (document.body.scrollLeft + document.body.clientWidth) - width;
  }
  if(left < 0) {
    left = 0;
  }
  menuBody.style.left = left;
  menuBody.style.top = top;
  var bottom = DHTML.getElementTop(menuBody) + DHTML.getElementHeight(menuBody);
  var windowBottom = document.body.scrollTop + document.body.clientHeight;
  if (bottom > windowBottom) {
    menuBody.style.top = top + windowBottom - bottom;
  }
  DHTML.shimElement(menuBody);
}

/**
 * Position a submenu body correctly
 */
function MenuImpl_positionSubMenuBody(menuNode, menuBody) {
  var top = menuNode.offsetTop - 2;
  var left = DHTML.getElementWidth(menuNode);
  var parent = menuNode.parentNode;
  while(parent != null) {
    if(parent.className == "menu_column") {
      left += parent.offsetLeft;
    } else if(parent.className == "menu_body") {
      break;
    }
    parent = parent.parentNode;
  }
  menuBody.style.left = left;
  menuBody.style.top = top;
  menuBody.style.display = "block";
  var subMenuBottom = DHTML.getElementTop(menuBody) + DHTML.getElementHeight(menuBody);
  var windowBottom = document.body.scrollTop + document.body.clientHeight;
  if(subMenuBottom > windowBottom) {
    top += windowBottom - (subMenuBottom + 1);
    menuBody.style.top = top;
  }
  var subMenuLeft = DHTML.getElementLeft(menuBody);
  var subMenuWidth = DHTML.getElementWidth(menuBody);
  var subMenuRight = subMenuLeft + subMenuWidth;
  var windowRight = document.body.scrollLeft + document.body.clientWidth;
  if(subMenuRight > windowRight) {
    left += windowRight - (subMenuRight + 1);
    menuBody.style.left = left;
  }
  subMenuLeft = DHTML.getElementLeft(menuBody);
  subMenuRight = subMenuLeft + subMenuWidth;
  var menuLeft = DHTML.getElementLeft(menuNode);
  if(subMenuLeft <= menuLeft) {
    left += menuLeft - (subMenuRight + 1);
    menuBody.style.left = left;
  }
  DHTML.shimElement(menuBody);
}

/**
 * True if the mouse is in the menu
 */
function MenuImpl_mouseInOpenMenu(padding) {
  with (Menu) {
    for (var i=0;i<openMenus.length;i++) {
      var menu = openMenus[i].menu;
      if ((menu.node && DHTML.mouseInElement(menu.node, padding)) ||
          (menu.body && DHTML.mouseInElement(menu.body, padding))) {
        return true;
      }
    }
    return false;
  }
}

/**
 * Find a focusable menu item
 */

function MenuImpl_findFocusableItemNode(item) {
  var res = item.focusable;
  if (res == null) res = findFocusable(item.node);
  return res;
}

/**
 * The mouse has moved over given item -- show any sub-menus as necessary
 */
function MenuImpl_mouseOverMenuItem(menu, item) {
  if(!item.disabled) {
    MenuImpl_setSelectedMenuItem(menu, item, true);
  }
}

/**
 * New instance of an open menu. This could be tied in more closely to javascript's object model,
 * but since the rest of the code isn't OO yet either, simpler to just do it this way.
 */
function MenuImpl_createOpenMenu(menu, activeIndex) {
  var openMenu = new Object();
  openMenu.menu = menu;
  openMenu.activeIndex = activeIndex;
  if (activeIndex == -1) {
    openMenu.activeItem = null;
  } else {
    openMenu.activeItem = menu.items[activeIndex];
  }
  return openMenu;
}

function MenuImpl_hasSubItems(menu) {
  return menu.items != null;
}

function MenuImpl_subMenuOnServer(items) {
  return items != null && items.length == 0;
}
