/**
 * Provides a scrolling panel for the enclosing HTML document
 */


//------------------------------------------------------------------ Interface:

window.ScrollingPanel = new ScrollingPanelImpl();

function ScrollingPanelImpl() {
  this.zIndex = 50;
  this.maxWidth = 300;
  this.maxHeight = 100;

  this.panel = null; // the main div for the panel
  this.upScroller = null; // the element to scroll text context upwards
  this.downScroller = null; // the element to scroll text context downwards

  this.scrollIntervalID = null;
}

ScrollingPanelImpl.prototype.showText = ScrollingPanelImpl_showText;
ScrollingPanelImpl.prototype.hideText = ScrollingPanelImpl_hideText;
ScrollingPanelImpl.prototype.mouseDownHandler = ScrollingPanelImpl_mouseDownHandler;


//------------------------------------------------------------- Implementation:

/**
* Displays text into the panel:
*/
function ScrollingPanelImpl_showText(elem, content, styleClass, bFormattedHTML, maxWidth, maxHeight, bAutoHide) {

  ScrollingPanelImpl_createPanel(styleClass, bAutoHide);
  ScrollingPanel.panel.elem = elem;

  ScrollingPanel.panel.style.display = 'block';
  if (bFormattedHTML) {
    ScrollingPanel.panel.innerHTML = content;
  } else {
    ScrollingPanel.panel.innerText = content;
  }

  // Resize panel to fit the content
  if (maxWidth == null) {
    maxWidth = ScrollingPanel.maxWidth;
  }
  if (maxHeight == null) {
    maxHeight = ScrollingPanel.maxHeight;
  }
  if(document.all) {
    ScrollingPanel.panel.style.width = '0%';
  }
  ScrollingPanel.panel.style.whiteSpace = 'nowrap';
  // set overflow to child nodes in order to calculate the width properly:
  for (var i = 0; i < ScrollingPanel.panel.childNodes.length; i ++) {
    if (ScrollingPanel.panel.childNodes[i].style != null) {
      ScrollingPanel.panel.childNodes[i].style.overflowX = "visible";
    }
  }
  ScrollingPanel.panel.style.width = Math.min(Math.max(ScrollingPanel.panel.offsetWidth, ScrollingPanel.panel.scrollWidth), maxWidth);
  ScrollingPanel.panel.style.whiteSpace = 'normal';
  ScrollingPanel.panel.style.height = Math.min(
          ScrollingPanel.panel.scrollHeight
                  + ScrollingPanelImpl_safeParseInt(DHTML.getStyle(ScrollingPanel.panel, "border-top-width"))
                  + ScrollingPanelImpl_safeParseInt(DHTML.getStyle(ScrollingPanel.panel, "border-bottom-width")),
          maxHeight);

  // Postion panel close to the target element:
  ScrollingPanel.panel.style.left = DHTML.getElementLeft(elem); // align to the left
  if (ScrollingPanel.panel.offsetLeft + ScrollingPanel.panel.clientWidth > ScrollingPanel.panel.offsetParent.offsetWidth) {
    ScrollingPanel.panel.style.left = ScrollingPanel.panel.offsetParent.offsetWidth - ScrollingPanel.panel.offsetWidth; // move into view
  } else if (ScrollingPanel.panel.offsetLeft < 0) {
    ScrollingPanel.panel.style.left = 0; // move into view
  }
  ScrollingPanel.panel.style.top = DHTML.getElementTop(elem) + elem.offsetHeight + 1; // position below
  if (elem.tagName == 'SELECT' || // always position above a dropdown field
      elem.getAttribute('autocomplete') != null ||
      ScrollingPanel.panel.offsetTop + ScrollingPanel.panel.clientHeight > ScrollingPanel.panel.offsetParent.offsetHeight) { // not enough space in below
    ScrollingPanel.panel.style.top = DHTML.getElementTop(elem) - ScrollingPanel.panel.offsetHeight - 1; // position above
  }

  DHTML.shimElement(ScrollingPanel.panel);

  // Set up scrollers, if text too long:
  if (ScrollingPanel.panel.scrollHeight > ScrollingPanel.panel.style.pixelHeight) {

    var left = ScrollingPanel.panel.offsetLeft + ScrollingPanelImpl_safeParseInt(DHTML.getStyle(ScrollingPanel.panel, "border-left-width"));
    var width = ScrollingPanel.panel.clientWidth;
    var topBorderWidth = ScrollingPanelImpl_safeParseInt(DHTML.getStyle(ScrollingPanel.panel, "border-top-width"));

    // show up-scroller right below the panel top border:
    ScrollingPanel.upScroller.style.width = width;
    ScrollingPanel.upScroller.style.left = left;
    ScrollingPanel.upScroller.style.top = ScrollingPanel.panel.offsetTop + topBorderWidth;

    // show down-scroller right above the panel bottom border:
    ScrollingPanelImpl_showScroller(/*bUp*/false);
    ScrollingPanel.downScroller.style.width = width;
    ScrollingPanel.downScroller.style.left = left;
    ScrollingPanel.downScroller.style.top = ScrollingPanelImpl_safeParseInt(DHTML.getStyle(ScrollingPanel.panel, "top"))
            + topBorderWidth + ScrollingPanel.panel.clientHeight - ScrollingPanel.downScroller.offsetHeight;
  }
}

function ScrollingPanelImpl_safeParseInt (value) {
  var i = parseInt(value,10);
  if (isNaN(i)) {
    i = 0;
  }
  return i;
}

/**
 * Hides the content and the panel
 * @param elem the owner element
 * @return the content of the panel before get hidden. Returns null, if nothing to hide.
 */
function ScrollingPanelImpl_hideText(elem) {
  if (ScrollingPanel.panel == null || ScrollingPanel.panel.style.display == 'none' ||
      elem != null && elem != ScrollingPanel.panel.elem) {
    return null;
  } else {
    ScrollingPanel.panel.style.display = 'none';
    var oldText = DHTML.getInnerText(ScrollingPanel.panel);
    DHTML.innerHTML = '';

    DHTML.unshimElement(ScrollingPanel.panel);
    ScrollingPanelImpl_hideScroller(/*bUp*/true);
    ScrollingPanelImpl_hideScroller(/*bUp*/false);

    ScrollingPanelImpl_stopScrolling();

    return oldText;
  }
}

/**
* Crreates the panel, if it doesn't exist.
*/
function ScrollingPanelImpl_createPanel(styleClass, bAutoHide) {
  if (ScrollingPanel.panel == null) {

    // create the div
    ScrollingPanel.panel = document.createElement('DIV');
    ScrollingPanel.panel.style.cssText = 'position:absolute;overflow-y:hidden;z-index:' + ScrollingPanel.zIndex;
    ScrollingPanel.panel.onmousedown = DHTML.cancelEventFunction;
    ScrollingPanel.panel.onclick = function() { Recorder.click(event.srcElement); DHTML.cancelEventFunction();};
    document.mainForm.appendChild(ScrollingPanel.panel);

    // create up and down scrollers:
    ScrollingPanelImpl_createScroller(/*bUp*/true);
    ScrollingPanelImpl_createScroller(/*bUp*/false);
  }
  ScrollingPanel.panel.className = styleClass;
  ScrollingPanel.panel.bAutoHide = bAutoHide;
}

function ScrollingPanelImpl_mouseDownHandler() {
  with (ScrollingPanel) {
    if (panel != null && panel.bAutoHide) {
      hideText();
    }
  }
}

/**
 * Creates scroller for panel content:
 */
function ScrollingPanelImpl_createScroller(bUp) {

  // create a background div with the same bgColor as the main panel:
  var bgDiv = document.createElement('DIV');
  bgDiv.style.cssText = 'border:0px;padding:'
          + (bUp ? '1px 0px 0px 0px' : '0px 0px 1px 0px')
          + ';position:absolute;display:none;text-align:center;background-color:'
          + DHTML.getStyle(ScrollingPanel.panel, "background-color")
          + ';z-index:' + (ScrollingPanel.zIndex + 1);
  document.body.appendChild(bgDiv);

  // icon for the scroller:
  var img = document.createElement('IMG');
  img.src = 'images\/' + (bUp ? 'up' : 'down') + '.png';
  img.style.cssText = "border:0px;filter:alpha(opacity=80);";
  img.onmouseover = bUp ?
                    function () {ScrollingPanelImpl_stopScrolling();ScrollingPanel.scrollIntervalID = setInterval('ScrollingPanelImpl_scroll(-2)', 20)} :
                    function () {ScrollingPanelImpl_stopScrolling();ScrollingPanel.scrollIntervalID = setInterval('ScrollingPanelImpl_scroll(2)', 20)};
  img.onmouseout = ScrollingPanelImpl_stopScrolling;
  bgDiv.appendChild(img);

  if (bUp) {
    ScrollingPanel.upScroller = bgDiv;
  } else {
    ScrollingPanel.downScroller = bgDiv;
  }
}

/**
 * Displays the scroller
 */
function ScrollingPanelImpl_showScroller(bUp) {
  if (bUp) {
    if (ScrollingPanel.upScroller.style.display == 'none') {
      ScrollingPanel.upScroller.style.display = 'block';
    }
  } else {
    if (ScrollingPanel.downScroller.style.display == 'none') {
      ScrollingPanel.downScroller.style.display = 'block';
    }
  }
}


/**
* Hides the scroller
*/
function ScrollingPanelImpl_hideScroller(bUp) {
  if (bUp) {
    if (ScrollingPanel.upScroller.style.display == 'block') {
      ScrollingPanel.upScroller.style.display = 'none';
    }
  } else {
    if (ScrollingPanel.downScroller.style.display == 'block') {
      ScrollingPanel.downScroller.style.display = 'none';
    }
  }
}


/**
* Scrolls panel content
*/
function ScrollingPanelImpl_scroll(delta) {
  ScrollingPanel.panel.scrollTop += delta;

  // adjust visibility of up-scroller:
  if (ScrollingPanel.panel.scrollTop > 0) {
    ScrollingPanelImpl_showScroller(/*bUp*/true);
  } else {
    ScrollingPanelImpl_hideScroller(/*bUp*/true);
  }

  // adjust visibility of down-scroller:
  if (ScrollingPanel.panel.scrollTop < ScrollingPanel.panel.scrollHeight - ScrollingPanel.panel.clientHeight) {
    ScrollingPanelImpl_showScroller(/*bUp*/false);
  } else {
    ScrollingPanelImpl_hideScroller(/*bUp*/false);
  }
}

/**
  * Clears the interval which keeps scrolling the panel content
  */
function ScrollingPanelImpl_stopScrolling() {
  if (ScrollingPanel.scrollIntervalID != null) {
    clearInterval(ScrollingPanel.scrollIntervalID);
    ScrollingPanel.scrollIntervalID = null;
  }
}
