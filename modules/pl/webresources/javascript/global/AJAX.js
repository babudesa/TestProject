/**
 * Coordinates AJAX request between client and server
 */

//-------------------------------------------------------------------------- interface
window.AJAX = new AJAXImpl();

function AJAXImpl() {
  this.request = AJAXImpl_createXMLHttpRequest();
  this.returnValue = null;
  this.queueRequests = [];
  this.hourglassTimeout = null;
  this._loadingHtml = '';
  this._errMsgs = []; // error messages to display
  this.ERROR = {}; // an unique object to indicate error
}

AJAXImpl.prototype.initRequest = AJAXImpl_initRequest;
AJAXImpl.prototype.buildSingleRequest = AJAXImpl_buildSingleRequest;
AJAXImpl.prototype.initRequestEx = AJAXImpl_initRequestEx;
AJAXImpl.prototype.getLoadingHTML = AJAXImpl_getLoadingHTML;

//-------------------------------------------------------------------------- implementation

/**
 * Starts an AJAX request.
 * The request may be put to queue or ignored if we are still waiting for the response of last AJAX request.
 *
 * @param viewRootId id of the server side widget that this request is targeted to
 * @param paramMap extra params to send. 
 *          If null, simply render the view root widget; otherwise, invoke <code>renderAJAXresponse()</code> on the widget
 * @param callback an optional function to invoke when the response comes back
 * @param sync if true, disallow user action till the request is done;
 *             if set, this request will be queued instead of ignored, if AJAX previous request still pending
 * @param postMainForm if true, post values of the main form to server (NOT IMPLEMENTED)
 *
 * @return true, if the request is sent; false, if the request is not sent due to previous request still pending
 */
function AJAXImpl_initRequest(viewRootId, paramMap, callback, sync, postMainForm) {
  return this.initRequestEx([AJAX.buildSingleRequest(viewRootId, paramMap, callback)], sync, postMainForm);
}

/**
 * Returns a new object which only contains attributes that are not null and allowed in the list of attributes
 * @param attrList a list of allowed attribute names
 */
function AJAXImpl_filterAttributes(object, attrList) {
  var filtered = {};
  for (var attr in object) {
    if (object.hasOwnProperty(attr) && (!attrList || ArrayUtil.inArray(attr, attrList))) {
      var value = object[attr];
      if (value) {
        filtered[attr] = value;
      }
    }
  }
  return filtered;
}

function AJAXImpl_buildSingleRequest(viewRootId, paramMap, callback) {
  return {'viewRootId':viewRootId, 'paramMap':paramMap, 'callback':callback};
}

/**
 * Similar to <code>AJAX.initRequest()</code>, but allows multiple requests to be sent to server in the same round trip.
 * @param callbackEx the callback after process all requests in the requestList
 */
function AJAXImpl_initRequestEx(requestList, sync, postMainForm, callbackEx) {
  if (this.request.readyState != 0 && this.request.readyState != 4) {
    if (sync) {
      ArrayUtil.appendElement(this.queueRequests,
              function(){
                Debug.log('Process queued AJAX reqest');
                AJAX.initRequestEx(requestList, sync, postMainForm, callbackEx);
              });
      Debug.log('AJAX request in queue');
    }
    return false; // new request not sent
  }

  var formAction = window.document.forms[0].action;
  var params;
  
  if (postMainForm) {
    alert("Post all form values to server is not yet supported");
    return false;
  } else {
    params = "renderViewRootOnly=true"; // only talk to view root
  }

  if (requestList) {
    var filtered = [];
    for (var i=0; i<requestList.length; i++) {
      filtered[i] = AJAXImpl_filterAttributes(requestList[i], ['viewRootId', 'paramMap']);
    }
    var encodedComp = encodeURIComponent(filtered.toJSONString());
    params = params + '&ajaxRequestInfo=' + encodedComp;
  }

  params = params + '&__navigator_index=' + window.document.forms[0].elements['__navigator_index'].value

  if (sync) {
    Events.disableNavigation();
    this.hourglassTimeout = window.setTimeout(AJAXImpl_hourglass, 500); // enable hourglass if the operation takes long
  }

  this.request.open("POST", formAction, true);
  this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  this.request.onreadystatechange = function() { AJAXImpl_processRequest(sync, requestList, callbackEx) };

  Debug.log('Send AJAX request');
  this.request.send(params);
  return true;
}

function AJAXImpl_hourglass() {
  Debug.log("Enable hourglass - synced AJAX call takes too long")
  DHTML.hourglass();
}

/**
 * Processes the response
 */
function AJAXImpl_processRequest(sync, reqInfoList, callbackEx) {
  with (AJAX) {
    if (request.readyState == 4) {
      Debug.log('AJAX request completed');
      if (sync) {
        window.clearTimeout(hourglassTimeout);
        hourglassTimeout = null;
        DHTML.unhourglass();
      }
      
      if (request.status == 200) {
        /* Do not use XML. use JSON instead
        var contentItem = request.responseXML.getElementsByTagName("content")[0];
        returnValue = contentItem.firstChild.nodeValue;
        */
        
        var numResponses = reqInfoList.length;
        var respValues = AJAXImpl_getReturnValueFromResponse(request.responseText, numResponses);
        if (respValues != undefined && respValues != null) {  // if (respValues) will be false if respValues == ""
          for (var i = 0; i < numResponses; i++) {
            returnValue = numResponses > 1 ? respValues[i] : respValues;
            if (returnValue != ERROR) {
              var callback = reqInfoList[i].callback;
              if (callback != null) {
                callback();
              }
            }
            returnValue = undefined; // clear last result after done
          }
        }
        if (callbackEx) { // callback after all request is done
          callbackEx();
        }
      }

      AJAXImpl_initNextRequestInQueue();
    }
  }
}

/**
 * Returns the decoded object from the text, if formatted; otherwise, returns the original text
 */
function AJAXImpl_decodeStringResponse(text) {
  try {
    var decoded = null;
    eval('decoded = ' + text);
    return decoded;
  } catch (ignore) {
    // not a formatted value
    return text;
  }
}

/**
 * Retrieves the "returnValue" property, if the response is a formatted JSON object, or the entire repsone text.
 * @param numResponses the expected number of response
 * @return the returnValue, or an array of returnValues when numResponse > 1
 */
function AJAXImpl_getReturnValueFromResponse(responseText, numResponses) {
  if (responseText != null && responseText.length > 1 && responseText.charAt(0) == '{'
          || numResponses > 1) {

    var responseInfo = AJAXImpl_decodeStringResponse(responseText);
    if (numResponses > 1) {
      if (typeof(responseInfo) == typeof('')) {
        alert('Expected formatted response for multiple concurrent AJAX requests!');
        return null;
      } else if (responseInfo.length != numResponses) {
        alert('Expected ' +numResponses+ ' AJAX responses, but got ' + responseInfo.length);
        return null;
      }
    }

    var values = [];
    for (var i=0; i<numResponses; i++) {
      var item = numResponses > 1 ? AJAXImpl_decodeStringResponse(responseInfo[i]) : responseInfo;
      values[i] = AJAX.ERROR;

      if (item.__formatted == true) { // formatted response

        // process "eval" command:
        if (item.__eval != null) {
          try {
            eval(item.__eval);
          } catch (e) {
            if (item.__errorMsgs == null) {
              item.__errorMsgs = [];
            }
            ArrayUtil.appendElement(item.__errorMsgs, e.message);
          }
        }

        // process error msgs:
        if (item.__errorMsgs != null) {
          AJAXImpl_addErrorMsgs(item.__errorMsgs);
          continue;
        }

        values[i] = item.__returnValue;
      } else { // not formatted, use the raw text:
        values[i] = typeof(item)==typeof('') ? item : item.toJSONString();
      }
    }

    //unbox the return value from the array, if a single response
    return numResponses > 1 ? values : values[0];
  }
  return responseText;
}

/**
 * Accumulates error messages to display them at the end of all AJAX calls
 * @param msgs an array of errors
 */
function AJAXImpl_addErrorMsgs(msgs) {
  if (typeof(msgs) == typeof('')) {
    msgs = [msgs];
  }

  for (var i = 0; i < msgs.length; i++) {
    Events.queueUniqueItem(msgs[i], AJAXImpl_displayErrorMsgs)
  }
}

/**
 * Displays all error messages then clears them all
 */
function AJAXImpl_displayErrorMsgs(msgs) {
  if (msgs.length > 0) {
    var msg = '';
    for (var i = 0; i < msgs.length; i++) {
      if (i>0) {
        msg += '\n';
      }
      msg += (msgs[i])
    }
    alert(msg);
  }
}

/**
 * Initializes next AJAX request in queue, if any
 */
function AJAXImpl_initNextRequestInQueue() {
  with (AJAX) {
    if (queueRequests.length > 0) {
      var nextReq = queueRequests[0];
      ArrayUtil.removeElement(queueRequests, 0);
      nextReq();
    }
  }
}

/**
 * Creates XMLHttpRequest object
 */
function AJAXImpl_createXMLHttpRequest() {
  var request;
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return request;
}

/**
 *@return html to display when loading info thru AJAX
 */
function AJAXImpl_getLoadingHTML() {
  if (!this._loadingHtml) {
    this._loadingHtml = '<img src="'+Events.getResourceURL('images/loading.gif') + '" border=0/>';
  }
  return this._loadingHtml;
}