/**
 * Handles auto-update progress bar
 */

//-------------------------------------------------------------------------- interface
window.Progress = new ProgressImpl();

function ProgressImpl() {
  this._version = 0;
  this[this._version] = [];
  this._interval = window.setInterval(ProgressImpl_pollIfNeeded, 3000) // periodically check to see if we need to poll from the server
}
ProgressImpl.prototype.updateProgress = ProgressImpl_updateProgress;

function ProgressImpl_updateProgress (info) {

  // refresh the containing element, if needed:
  if (info == null || ProgressImpl_refreshContainerIfNeeded(info)) {
    return;
  }

  var done = info.percentage >= 100;
  if (info.sync) {
    // invoke action on completion:
    if (done) {
      Debug.log("Invoke event after progress completes: " + info.id);
      Events.enableNavigation();
      Events.invokeEvent(info.id+'_act', true);
      return;
    }

    Debug.log("Disabled navigation for sync progress");    
    Events.disableNavigation();
    DHTML.hourglass();
  }

  // update progress status:
  var htmlContent = '';

  // spiny icon w unknown %completion:
  if (info.percentage < 0 && !info.hideAnimation) {
    htmlContent += '<span class="inProgressIcon"></span> ';
  }
  // status message:
  if (info.status != null) {
    htmlContent += '<span class="inProgressMsg">' + info.status + '</span>';
  }
  // progress bar w known %completion:
  if (info.percentage >= 0 && !done && !info.hideAnimation ) {
    htmlContent += '<div class="progressBar" title="'+info.percentage+'%"><span class="progressCompleted" style="width:'+info.percentage+'%"></span></div>';
  }

  var elt = document.getElementById(info.id);
  DHTML.setInnerHTML(elt, htmlContent);
  if(!document.all && info.percentage >= 0 && !done && !info.hideAnimation) {
    //fix display for firefox
    elt.childNodes[1].childNodes[0].style.width = "";
    var pad = 200 * info.percentage / 100;
    elt.childNodes[1].childNodes[0].style.paddingLeft = pad + "px";
    if(document.defaultView.getComputedStyle(elt.childNodes[1], "").getPropertyValue("display") == "inline") {
      elt.childNodes[1].style.paddingRight = (200 - pad) + "px";
    }
  }
  Debug.log('Progress of "' +info.id+ '" updated to ' + info.percentage);

  // poll again if not done:
  if (!done) {
    ProgressImpl_registerToPoll(info.id)
  }
}

/**
 *@return true if the container is refreshed
 */
function ProgressImpl_refreshContainerIfNeeded (info) {
  if (info.refreshContainerId != null) {
    DHTML.updateElement(info.refreshContainerId, info.content, info.delayedJS, info.refreshChildrenOnly);
    Debug.log('progress done; container reloaded')
    return true;
  }
  return false; // container not refreshed
}

/**
 * Polls the server if any progress widgets have registered to poll
 */
function ProgressImpl_pollIfNeeded(){
  var currentPoll = Progress._version;
  if (Progress[currentPoll].length == 0) {
    return; // no op
  }

  var nextPoll = currentPoll+1;
  Progress[nextPoll] = []
  Progress._version = nextPoll; // atomic operation to increase version

  var ids = Progress[currentPoll];
  Progress[currentPoll] = null; // clear old list

  var reqs = [];
  for (var i = 0; i < ids.length; i++) {
    reqs[i] = AJAX.buildSingleRequest(ids[i], null, ProgressImpl_callback)
  }
  AJAX.initRequestEx(reqs)
}

/**
 * Registers one progress widget for the next poll
 * @param id id of the progress widget
 */
function ProgressImpl_registerToPoll(id){
  Progress[Progress._version].push(id);
}

/**
 * The callback function to process a server update thru AJAX
 */
function ProgressImpl_callback() {
  eval("ProgressImpl_updateProgress(" +AJAX.returnValue+ ")")
}
