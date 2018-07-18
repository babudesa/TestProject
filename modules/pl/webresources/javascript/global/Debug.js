var Debug = {
  // get window from parent frameset window
  getDbgWin: function() {
    if (window.parent._dbgWin != null && window.parent._dbgWin.closed) {
      window.parent._dbgWin = undefined;
    }
    return window.parent._dbgWin;
  },

  start: function() {
    if (!this.isOn()) {
      window.parent._dbgWin = window.open('about:blank', '__DBGWIN__', 'width=400,height=600,resizable=yes,scrollbars=yes');
      window.parent._dbgWin.document.writeln('<title>DEBUG</title>\n' +
              '<script>var _newContent = ""</script>\n' +
              '<Input type="Button" value="Clear" onClick="log.innerHTML = \'\'"/>\n' +
              '<Input type="Button" id="flush" value="Flush" onClick="window.opener.Debug.flush()" style="display:none"/>\n' +
              '<Input type="checkbox" id="realTime" name="realTime" value="true" onClick="flush.style.display = this.checked ? \'none\' : \'\'" checked />Real time\n' +
              '<DIV id="log" style="width:95%;height:90%;overflow:auto"></DIV>');
    }
    window.parent._dbgWin.focus();
  },

  isRealtime : function() {
    return this.getDbgWin().realTime.checked;
  },

  log: function(msg, bFlush) {
    if (this.isOn()) {
      var str = ('<li>['+this.getCurrTime()+'] ' +msg+ '<br>');
      if (bFlush || this.isRealtime()) {
        var logtxt = this.getDbgWin().document.getElementById('log');
        logtxt.innerHTML = logtxt.innerHTML + str;
        logtxt.scrollTop = logtxt.scrollHeight;
      } else {
        this.getDbgWin()._newContent += str;
      }
    }
  },

  flush: function() {
    var str = this.getDbgWin()._newContent;
    if (str) {
      this.log(str, true);
      this.getDbgWin()._newContent = '';
    }
  },

  getCurrTime: function() {
    var t = new Date();
    return t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+'.'+t.getMilliseconds();
  },

  isOn: function() {
    var win = this.getDbgWin();
    return win != null && !win.closed;
  },

    dumpObj: function(msg, obj) {
      var temp = msg;
      var column = 0;
      for (x in obj) {
        var val = obj[x];
        if (val != null && val != "") {
          temp += x + ": " + val;
          if (column == 3) {
            temp += "\n";
            column = 0;
          }
          else {
            temp += "\t  ";
            column++;
          }
        }
      }
    return temp;
  }

};

