/**
 * Utils to resize elements with one or more of the following style classes:
 *  resizeT - resize thru Top border
 *  resizeR - resize thru Right border
 *  resizeB - resize thru Bottom border
 *  resizeL - resize thru Left border
 */

var Resize = {
  OFFSET : 8, // distance from the border to allow resize
  MIN : 8, // the minimal width or height to resize to

  _startInfo : null, // start info for this resize operation

  /**
   * set cursor style as specified
   * @param cursorStyle
   */
  setCursorStyle : function(cursorStyle) {
    if (!Resize._resizeCursorSS) {
      Resize._resizeCursorSS = document.createStyleSheet();
      Resize._resizeCursorSS.addRule('*', 'cursor:' + cursorStyle + ' !important');
    } else {
      Resize._resizeCursorSS.disabled = false;
      Resize._resizeCursorSS.rules[0].style.cursor = cursorStyle;
    }
  },

  /**
   * Remove cursor style set thru setCursorStyle()
   */
  restorCursorStyle : function () {
    if (Resize._resizeCursorSS) {
      Resize._resizeCursorSS.disabled = true;
    }
  },

  /**
   * Gets direction to resize
   * @param elem event source element
   * @return null or an object contains "dir" and "elem" to resize
   */
  getDirection : function(elem) {

    var x = 0, y = 0;
    for (var e = elem; e != null && e.tagName != 'BODY'; e = e.offsetParent) {
      if (e != elem) {
        x += e.offsetLeft - e.scrollLeft;
        y += e.offsetTop - e.scrollTop;
      }
      if (Resize.isResizable(e, '.')) {
        var dir = '';
        
        var yPos = window.event.offsetY + y;
        if (Resize.isResizable(e, 'T') && yPos < Resize.OFFSET) {
          dir += "n";
        } else if (Resize.isResizable(e, 'B') && yPos > e.offsetHeight - Resize.OFFSET) {
          dir += "s";
        }

        var xPos = window.event.offsetX + x;
        if (Resize.isResizable(e, 'L') && xPos < Resize.OFFSET) {
          dir += "w";
        } else if (Resize.isResizable(e, 'R') && xPos > e.offsetWidth - Resize.OFFSET) {
          dir += "e";
        }

        return dir ? {dir:dir, elem:e} : null;
      }
    }

    return null;
  },

  /**
   * @param e element
   * @param dir  directions: 'T','R','B', 'L' or '.' (wildcard)
   */
  isResizable : function (e, dir) {
    var cls = e.className
    return cls && cls.match('resize' + dir)
  },

  // MouseDown handler - start move if needed
  onDown : function() {
    if (!window.event) {
      return; // not IE
    }
    // start move on mouse down:
    var dirInfo = Resize.getDirection(event.srcElement);
    if (dirInfo) {
      var e = dirInfo.elem, dir = dirInfo.dir;
      var minOverride = e.min;
      Resize._startInfo = new Resize_StartInfo(e, dir, (Number(minOverride) || this.MIN),
              window.event.clientX, window.event.clientY,
              e.offsetWidth, e.offsetHeight, e.offsetLeft, e.offsetTop);
      window.event.returnValue = false;
      window.event.cancelBubble = true;
    }
  },

  // Double click handler
  onDblClick : function() {
    if (!window.event) {
      return;
    }
    if (Resize._startInfo != null) {
      Resize._startInfo.resizeTo()
    }
  },

  // MouseMove handler
  onMove : function () {
    if (!window.event) {
      return; // not IE
    }
    // Stop current move, after mouse button is release:
    if (window.event.button == 0 && Resize._startInfo != null) {
      Resize.restorCursorStyle();
      Resize._startInfo = null;
      return;
    }

    if (Resize._startInfo == null) {// set cursor style to indicate resizable element:
      var dirInfo = Resize.getDirection(event.srcElement);
      if (dirInfo) {
        Resize.setCursorStyle(dirInfo.dir + '-resize')
      } else {
        Resize.restorCursorStyle();
      }
    } else { // resize element:
      Resize._startInfo.resizeTo(window.event.clientX, window.event.clientY);
      window.event.returnValue = false;
      window.event.cancelBubble = true;
    }
  },

  /**
   * Checks if parent space is divided between this element and another sibling, and returns the sibling if so.
   * @param e element
   * @param attrib width or height
   */
  getSibToResize : function(e, attrib) {
    if (e.parentNode.childNodes.length == 2) {
      var m = e.currentStyle[attrib].match('([0-9]+)%');
      if (m) {
        var sib = e.nextSibling || e.previousSibling;
        if (sib.currentStyle[attrib].match('([0-9]+)%')) {
          return sib;
        }
      }
    }
    return null;
  }
}

/**
 * Infomation when resize begins
 */
function Resize_StartInfo(e, dir, min, x, y, width, height, left, top) {
  this._elem = e;
  this._dir = dir;      //n, s, e, w, ne, nw, se, sw
  this._min = min;      // minimal when resizing

  this._startX = x;
  this._startY = y;

  this._width = width;
  this._height = height;

  if (this._widthSib = Resize.getSibToResize(e, 'width')) {
    this._widthModifier =  '%';
    this._percentageWidth = Number(e.currentStyle.width.replace('%', ''));
    this._sibPercentageWidth = Number(this._widthSib.currentStyle.width.replace('%', ''));
  } else {
    this._widthModifier =  'px';
    this._percentageWidth = null;
  }

  if (this._heightSib = Resize.getSibToResize(e, 'height')) {
    this._heightModifier =  '%';
    this._percentageHeight = Number(e.currentStyle.height.replace('%', ''));
    this._sibPercentageHeight = Number(this._heightSib.currentStyle.height.replace('%', ''));
  } else {
    this._heightModifier =  'px';
    this._percentageHeight = null;
  }

  this._left = left;
	this._top = top;
}

/**
 * Returns true, if the specified dimension is small enough to consider minimized
 */
Resize_StartInfo.prototype.isMinimized = function (d) {
  return d <= this._min + 20;
}

Resize_StartInfo.prototype.resizeTo = function (clientX, clientY) {
  var posToRestore = this._elem._toRestore;

  var bW;
  if (this._dir.indexOf("e") != -1 || (bW = this._dir.indexOf("w") != -1)) {
    var newWidth, xDiff;
    if (!clientX) { // restore or minimize
      xDiff = ((posToRestore && this.isMinimized(this._width)) ? posToRestore.x : this._min) - this._width;
    } else { // resize
      xDiff = (clientX - this._startX) * (bW ? -1 : 1);
      xDiff = Math.max(xDiff, -this._width + this._min)
    }
    if (this._percentageWidth) {
      xDiff = Math.round(this._percentageWidth * xDiff / this._width);
      xDiff = Math.min(xDiff, 100 - this._percentageWidth);
      newWidth = this._percentageWidth + xDiff;

      this._widthSib.style.width = this._sibPercentageWidth - xDiff + this._widthModifier;
    } else {
      newWidth = this._width + xDiff;
      if (bW) {
        this._elem.style.left = this._left - xDiff + "px";
      }
    }

    this._elem.style.width = newWidth + this._widthModifier;
  }

  var bN;
  if (this._dir.indexOf("s") != -1 || (bN = this._dir.indexOf("n") != -1)) {
    var newHeight, yDiff;
    if (!clientY) { // restore or minimize
      yDiff = ((posToRestore && this.isMinimized(this._height)) ? posToRestore.y : this._min) - this._height;
    } else { // resize
      yDiff = (clientY - this._startY) * (bN ? -1 : 1);
      yDiff = Math.max(yDiff, -this._height + this._min)
    }
    if (this._percentageHeight) {
      yDiff = Math.round(this._percentageHeight * yDiff / this._height);
      yDiff = Math.min(yDiff, 100 - this._percentageHeight);
      newHeight = this._percentageHeight + yDiff
      this._heightSib.style.height = this._sibPercentageHeight - yDiff + this._heightModifier;
    } else {
      newHeight = this._height + yDiff;
      if (bN) {
        this._elem.style.top = this._top - yDiff + "px";
      }
    }

    this._elem.style.height = newHeight + this._heightModifier;
  }

  // remember last non-minimized size:
  if (!posToRestore) {
    posToRestore = {x:this._width, y:this._height}
  } else {
    if (!this.isMinimized(this._width)) {
      posToRestore.x = this._width;
    }
    if (!this.isMinimized(this._height)) {
      posToRestore.y = this._height;
    }
  }
  this._elem._toRestore = posToRestore;
};

//----------------------------------------------- util for persisting leftnav and workspace size:
/**
 * Called after workspace is resized, to record the new height of the main content
 * @param elem workspace DIV
 */
function workspaceResized(elem) {
  // remeber % height of the main content:
  var barYInfo = [elem.previousSibling.style.height];
  if (elem._toRestore) {
    barYInfo[1] = elem._toRestore.y;
  }
  document.mainForm.dividerBarY.value = barYInfo.toJSONString();
}

/**
 * Restores workspace size info before it's minimized from a hidden input
 * @param elem
 */
function workspaceOnLoad(elem) {
  if (elem) {
    var barYInfo = document.mainForm.dividerBarY.value;
    if (barYInfo) {
      barYInfo = barYInfo.parseJSON()
      if (barYInfo.length > 1) {
        elem._toRestore = {y:barYInfo[1]};
      }
    }
  }
}

/**
 * Called after leftnav is resized, to move the right hand side of content and record the new width
 */
function leftNavResized() {
  var width = window.event.srcElement.offsetWidth;
  document.getElementById('mainContent').childNodes[0].style.marginLeft=(width+2)+'px';
  var widthInfo = [width];
  if (window.event.srcElement._toRestore) {
    widthInfo[1] = window.event.srcElement._toRestore.x
  }
  document.mainForm.leftnavWidth.value = widthInfo.toJSONString();
}

/**
 * Resizes leftnav based on a hidden input when the page is loadded
 * @param elem leftnav DIV
 */
function resizeLeftNavOnload(elem) {
  if (elem) {
    var width = document.mainForm.leftnavWidth.value;
    if (width) {
      width = width.parseJSON();
      elem.style.width = width[0] + 'px';
      if (width.length > 1) {
        elem._toRestore = {x:width[1]};
      }
    }
    elem.onresize = leftNavResized;
  }
}