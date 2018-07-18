/**
 * (c) 2004-2012 Guidewire Software
 *
 * Class: DocumentUtil
 *
 * Contains global helper functions for handling documents via the ActiveX control
 */

window.DocumentUtil = new DocumentUtilImpl();

function getBaseDocUtilPath() {
  var result = window.location.protocol + "//" + window.location.host + window.location.pathname;
  result = result.substr(0, result.lastIndexOf('/') + 1);
  return result;
}

function DocumentUtilImpl() {
  this.documentOperationsSuspended = false;
  this.baseDocUtilPath = getBaseDocUtilPath();

  // PL-21191 Determine if we are in IE8 or earlier
  // File download responses via SSL to IE8 or earlier must avoid cache disabling headers
  this.sslCacheBug = (navigator.appName == 'Microsoft Internet Explorer' && !DHTML.isIE9Up);
}

DocumentUtilImpl.prototype.suspendDocumentOperations = function() {
  this.documentOperationsSuspended = true;
}

DocumentUtilImpl.prototype.initDocumentOperations = function(localizedErrorMessage) {
  var windowTop = this.getWindowTop ()
  var templateRunner = windowTop.document_frame.document.templateRunner;
  var url = this.baseDocUtilPath;
  // window.alert(Debug.dumpObj("initDocumentOperations url=" + url + "\n", templateRunner));
  try {
    var rtn = templateRunner.initialize(url);
  // window.alert("initDocumentOperations finished rtn=" + rtn);   
  } catch (e) {
    // window.DHTML.alert(e);
    windowTop.top_frame.document.body.innerHTML = '<div style="position:absolute">' + localizedErrorMessage + "</div>" + windowTop.top_frame.document.body.innerHTML;
  }

  this.documentOperationsSuspended = false;
}

DocumentUtilImpl.prototype.resumeDocumentOperations = function() {
  this.documentOperationsSuspended = false;
}

DocumentUtilImpl.prototype.areDocumentOperationsSuspended = function() {
  return this.documentOperationsSuspended;
}

DocumentUtilImpl.prototype.displayDocument = function(widgetId, docId) {
  window.DHTML.hourglass();
  var self = this;
  if (docId) {
    window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'displayDocument', 'docId':docId},
     function() { self.handleDisplayDocumentResponse(); } , true);
  } else {
    window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'displayDocument'},
    function() { self.handleDisplayDocumentResponse(); }, true);
  }

}

DocumentUtilImpl.prototype.clearCachedDocumentLocation = function(widgetId, baseSpanName) {
  window.DHTML.hourglass();
  var self = this;
  window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'clearCachedDocumentLocation', 'baseSpanName':baseSpanName},
  function() { self.maybeClearTempDirectory(); });
}

DocumentUtilImpl.prototype.uploadChangedDocument = function(widgetId, baseSpanName) {
  window.DHTML.hourglass();
  var self = this;
  window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'uploadChangedDocument', 'baseSpanName':baseSpanName},
  function() { self.uploadLocalDocument(); });
}

DocumentUtilImpl.prototype.displayDocumentAndCacheLocation = function(widgetId, baseSpanName) {
  window.DHTML.hourglass();
  var self = this;
  window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'displayDocument', 'baseSpanName':baseSpanName},
  function() { self.sendContentsToDocumentControlAndCacheLocation(); });

}

DocumentUtilImpl.prototype.displayDownloadedDocument = function(widgetId) {
  window.DHTML.hourglass();
  var self = this;
  window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'displayDownloadedDocument'},
  function() { self.sendContentsToDocumentControl(); });

}

DocumentUtilImpl.prototype.getWindowTop = function() {
  if (window.top.selenium_myiframe ) {
    return window.top.selenium_myiframe;
  } else {
      return window.top;
  }
}

DocumentUtilImpl.prototype.handleDisplayDocumentResponse = function() {
  var docResponse;
  eval("docResponse = " + window.AJAX.returnValue);
  // window.alert(Debug.dumpObj("handleDisplayDocumentResponse response", docResponse)); // todone ada
  if (docResponse["errorMsg"]) {
    window.DHTML.alert(docResponse["errorMsg"]);
    window.DHTML.unhourglass();
  } else {
    var fileExt = docResponse["fileExt"];
    if (fileExt == null) {
      fileExt = '';
    }
    if (docResponse["script"]) {
      this.sendContentsToDocumentControl(docResponse);
    } else {
      var targetHiddenFrame = docResponse["targetHiddenFrame"];
      if (docResponse["url"]) {
        var urlString = docResponse["url"];
        if (targetHiddenFrame) {
          this.getWindowTop ().utility_frame.location.href = urlString;
        } else {
          window.open(urlString, "DocumentContentWindow");
        }
      } else if (docResponse["html"]) {
        var htmlString = docResponse["html"];
        if (targetHiddenFrame) {
          this.getWindowTop ().utility_frame.document.write(htmlString);
          this.getWindowTop ().utility_frame.document.close();
        } else {
          var newWindow = window.open("", "DocumentContentWindow");
          newWindow.document.write(htmlString);
          newWindow.document.close();
        }
      } else {
        //Default to display of contents itself
        var templateRunner = this.getWindowTop ().document_frame.document.templateRunner;
        var filePath = templateRunner.createTempFileLocation(fileExt);
        var url = this.baseDocUtilPath + "FileContents.do?widgetID=" + docResponse["widgetId"];
        if (docResponse["docId"]) {
          url = url + "&docID=" + docResponse["docId"];
        }

        if (this.sslCacheBug && window.location.protocol == 'https:') {
           url = url + "&sslCacheBug=1";
        }
        var msg = "handleDisplayDocumentResponse templateRunner " + templateRunner + " url=" + url + " filePath=" + filePath;
        // window.alert(msg); // todone ada
        Debug.log(msg);
        templateRunner.loadContentIntoSpecifiedFile(url, filePath);
      }
      window.DHTML.unhourglass();
    }
  }
}


DocumentUtilImpl.prototype.sendContentsToDocumentControl = function() {
  var docResponse;
  eval("docResponse = " + window.AJAX.returnValue);

  var script = docResponse["script"];
  var fileExt = docResponse["fileExt"];
  if (fileExt == null) {
    fileExt = '';
  }

  var templateRunner = this.getWindowTop ().document_frame.document.templateRunner;
  var filePath = templateRunner.createTempFileLocation(fileExt);
  Debug.log("sendContentsToDocumentControl templateRunner " + templateRunner == null + " fileExt=" + fileExt);

  templateRunner.createFileFromScript(script, filePath);
  window.DHTML.unhourglass();
}

DocumentUtilImpl.prototype.displayNewDocument = function(url, filePath) {
  var templateRunner = this.getWindowTop ().document_frame.document.templateRunner;

  filePath = filePath.split("\\").join("\\\\"); //change \ to \\

  if (this.sslCacheBug && window.location.protocol == 'https:') {
     url = url + ((url.indexOf('?') == -1) ? '?' : '&') + 'sslCacheBug=1';
  }
  Debug.log("displayNewDocument from URL:" + url);
  Debug.log("displayNewDocument to file:" + filePath);
  //Insert delay because the file creation is asynchronous
  window.setTimeout( function() {
    templateRunner.loadContentIntoSpecifiedFile(url, filePath);
  }, 500);

}

DocumentUtilImpl.prototype.uploadLocalDocument = function() {
  var docResponse;
  eval("docResponse = " + window.AJAX.returnValue);
  var widgetId = docResponse["widgetId"];
  var fileLocation = docResponse["fileLocation"];
  var baseSpanName = docResponse["baseSpanName"];

  this.suspendDocumentOperations();

  try {
    var newBody = this.getWindowTop ().document_frame.document.all.templateRunner.uploadFileContents(fileLocation, 'fileContent', getBaseDocUtilPath() + "UploadDocumentContents.do", 'widgetId', widgetId);

    var self = this;
    window.AJAX.initRequest(widgetId, {'action':'clearCachedDocumentLocation','widgetId':widgetId},
    function() { self.maybeClearTempDirectory(); });

    this.getWindowTop ().document_frame.document.write(newBody);
    this.getWindowTop ().document_frame.document.close();

    if (baseSpanName) {
      this.showBaseActionLinks(baseSpanName)
    }
    
  } catch (e) {
    window.alert(docResponse["fileAccessError"]);
    this.resumeDocumentOperations();
  }
  
  window.DHTML.unhourglass();
}


DocumentUtilImpl.prototype.sendContentsToDocumentControlAndCacheLocation = function() {
  var docResponse;
  eval("docResponse = " + window.AJAX.returnValue);
  if (docResponse["errorMsg"]) {
    window.DHTML.alert(docResponse["errorMsg"]);
    window.DHTML.unhourglass();
  } else {

    var script = docResponse["script"];
    var fileExt = docResponse["fileExt"];
    var widgetId = docResponse["widgetId"];
    var baseSpanName = docResponse["baseSpanName"];
    if (fileExt == null) {
      fileExt = '';
    }

    var templateRunner = this.getWindowTop ().document_frame.document.templateRunner;
    var filePath = templateRunner.createTempFileLocation(fileExt);

    if (script) {
      templateRunner.createFileFromScript(script, filePath);
    } else {
      var url = ""
      if (docResponse["url"]) {
        var url = (docResponse["url"])
      } else {
        url = this.baseDocUtilPath + "FileContents.do?widgetID=" + docResponse["widgetId"];
        if (this.sslCacheBug && window.location.protocol == 'https:') {
           url = url + "&sslCacheBug=1";
        }
      }
      templateRunner.loadContentIntoSpecifiedFile(url, filePath);
    }
    //Send the file location to the server for use in later edit local/upload operations
    var self = this;
    window.AJAX.initRequest(widgetId, {'action':'cacheDocumentLocation','widgetId':widgetId,'fileLocation':filePath},
    function() { self.doNothing(); });

    if (baseSpanName) {
      this.showEditActionLinks(baseSpanName);
    }
    window.DHTML.unhourglass();
  }
}

DocumentUtilImpl.prototype.maybeClearTempDirectory = function() {
  var docResponse;
  eval("docResponse = " + window.AJAX.returnValue);

  var numCachedDocs = docResponse["numCachedDocs"];
  var baseSpanName = docResponse["baseSpanName"]

  //If the server isn't hanging onto any more locations, then we can clear out the local temp
  // directory, to keep it from growing indefinitely
  if (numCachedDocs == 0) {
    this.clearTempDirectory();
  }

  if (baseSpanName) {
    this.showBaseActionLinks(baseSpanName)
  }

  window.DHTML.unhourglass();
}

DocumentUtilImpl.prototype.clearTempDirectory = function() {
  if (this.getWindowTop ().document_frame && this.getWindowTop ().document_frame.document.templateRunner) {
    var templateRunner = this.getWindowTop ().document_frame.document.templateRunner;
    try {
      templateRunner.cleanTemporaryFiles();
    } catch (e) {
      // bjohnson - This shouldn't happen, because we checked for the templateRunner existing. However, in some unsupported cases,
      // including use of 64-bit IE, there are problems, so catch this and ignore it 
    }
  }
}

DocumentUtilImpl.prototype.doNothing = function() {

}


DocumentUtilImpl.prototype.sendScriptToDocumentControl = function(controlID, script, tempFilePath) {
  // window.alert("sendScriptToDocumentControl tempFilePath=" + tempFilePath); // todone ada
  Debug.log("sendScriptToDocumentControl tempFilePath=" + tempFilePath);
  this.getWindowTop ().document_frame.document.templateRunner.createFileFromScript(script, tempFilePath);

  var url = getBaseDocUtilPath() + "FileUpload.do";
  // window.alert("sendScriptToDocumentControl url=" + url + " widgetRenderId=" + controlID); // todone ada
  Debug.log("sendScriptToDocumentControl url=" + url);
  var newBody = this.getWindowTop ().document_frame.document.all.templateRunner.uploadFileContents(tempFilePath, 'fileContent', url, 'widgetRenderId', controlID, 'filePath', tempFilePath);
  this.getWindowTop ().document_frame.document.all.templateRunner.displayFile(tempFilePath);
  this.getWindowTop ().upload_frame.document.write(newBody);
  this.getWindowTop ().upload_frame.document.close();
}

DocumentUtilImpl.prototype.showBaseActionLinks = function(baseSpanName) {
  DHTML.showOrHideElement(baseSpanName + "view", true);
  DHTML.showOrHideElement(baseSpanName + "edit", true);
  DHTML.showOrHideElement(baseSpanName + "localEdit", false);
  DHTML.showOrHideElement(baseSpanName + "upload", false);
  DHTML.showOrHideElement(baseSpanName + "discard", false);
}

DocumentUtilImpl.prototype.showEditActionLinks = function(baseSpanName) {
  DHTML.showOrHideElement(baseSpanName + "view", false);
  DHTML.showOrHideElement(baseSpanName + "edit", false);
  DHTML.showOrHideElement(baseSpanName + "localEdit", true);
  DHTML.showOrHideElement(baseSpanName + "upload", true);
  DHTML.showOrHideElement(baseSpanName + "discard", true);
}

//-----------------------------------View/Edit/Update UI methods-------------------------------------
DocumentUtilImpl.prototype.displayRepositoryVersion = function(widgetId, operationsSuspendedMessage) {
  if (this.areDocumentOperationsSuspended()) {
    window.alert(operationsSuspendedMessage);
  } else {
    this.displayDocument(widgetId);
  }
}

DocumentUtilImpl.prototype.editRepositoryVersion = function(widgetId, operationsSuspendedMessage, baseSpanName) {
  if (this.areDocumentOperationsSuspended()) {
    window.alert(operationsSuspendedMessage);
  } else {
    this.displayDocumentAndCacheLocation(widgetId, baseSpanName);
  }
}

DocumentUtilImpl.prototype.editLocalVersion = function(widgetId, operationsSuspendedMessage) {
  if (this.areDocumentOperationsSuspended()) {
    window.alert(operationsSuspendedMessage);
  } else {
    this.displayDownloadedDocument(widgetId);
  }
}

DocumentUtilImpl.prototype.uploadLocalVersion = function(widgetId, operationsSuspendedMessage, baseSpanName) {
  if (this.areDocumentOperationsSuspended()) {
    window.alert(operationsSuspendedMessage);
  } else {
    this.uploadChangedDocument(widgetId, baseSpanName);
  }
}

DocumentUtilImpl.prototype.discardLocalVersion = function(widgetId, operationsSuspendedMessage, baseSpanName) {
  if (this.areDocumentOperationsSuspended()) {
    window.alert(operationsSuspendedMessage);
  } else {
    this.clearCachedDocumentLocation(widgetId, baseSpanName);
  }
}

DocumentUtilImpl.prototype.escapeForSendKeysVB = function( strKeys ) {
  var sb = "";
  for( i = 0; i < strKeys.length; i++ )
  {
    var c = strKeys.charAt( i );
    if(( c == '+' ) || ( c == '^' ) || ( c == '%' ) || ( c == '~' ) || ( c == '(' ) ||
        ( c == ')' ) || ( c == '[' ) || ( c == ']' ) || ( c == '{' ) || ( c == '}' ))
    {
      sb += "{" + c + "}";
    }
    else
    {
      sb += c;
    }
  }
  return sb;
}

//Decode Base64-encoded content
DocumentUtilImpl.prototype.decode64 = function (input) {
  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }
   } while (i < input.length);

   return output;
}

