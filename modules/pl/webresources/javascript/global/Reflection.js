/**
 * (c) 2003 Guidewire Software
 *
 * Glocal library for Reflection utilities
 */



//------------------------------------------------------------ Reflection

/**
* Build reflector array from metadata
*/
function ReflectionImpl_init(metaMap, bAppend, reflectionOnLoad) {
  if (!bAppend) { // reset reflectors:
    this.reflectors = new Array();
    this.rangeReflectorToTriggersMap = {};
  }
  for (var rId in metaMap) {
    if (metaMap.hasOwnProperty(rId)) {
      var reflector = new Reflector(rId, metaMap[rId]);
      ArrayUtil.appendElement(this.reflectors, reflector);
      reflector.addRangeReflector(this.rangeReflectorToTriggersMap); // collect all range reflectors
    }
  }
  this._reflectPath = [];

  if (reflectionOnLoad) {// redo reflection for user values not yet in backing model, when return to page after click away
    this._trackElementsToRedo = [];
    this._pendingReqs = [];
    for (var i = 0; i < reflectionOnLoad.length; i++) {
      Reflection.reflect(DHTML.getElementById(reflectionOnLoad[i]), true)
    }

    // add requests for updating sum value into the AJAX call
    var sumValueReqs = DHTML.updateSumValues(Reflection._trackElementsToRedo);
    if (sumValueReqs) {
      for (var i=0; i<sumValueReqs.length; i++) {
        this._pendingReqs.push(sumValueReqs[i]);
      }
    }

    if (this._pendingReqs.length > 0) {
      AJAX.initRequestEx(this._pendingReqs, true, false, ReflectionImpl_endRedoMode); // send all ajax requests at once
    } else {
      ReflectionImpl_endRedoMode();
    }
    this._pendingReqs = null;
  }
}

/**
 * Ends redo mode, after all chained reflections are done.
 */
function ReflectionImpl_endRedoMode() {
  Events.queueEvent('Debug.log("End reflection redo mode");Reflection._trackElementsToRedo = null', /*bLow*/true)
}

/**
 * If the trigger range reflects on other widgets, collects value of the range triggers and send them to the server
 * @param triggerElem trigger element
 */
function ReflectionImpl_getPrerequisiteAjaxParam(triggerElem) {
  var rangeTriggers = Reflection.rangeReflectorToTriggersMap[ReflectionImpl_getIdForReflection(triggerElem)];
  return rangeTriggers == null ? null : ReflectionImpl_addAjaxParams({}, null, rangeTriggers, null);
}

/**
 * Reflect the trigger element
 * @param e element which has changed
 * @param bDirectChange if the element is changed directly on the UI
 */
function ReflectionImpl_reflect(e, bDirectChange) {

  // Post page to server, if this is a postOnChange item
  var tId = e.id;
  if (ArrayUtil.inArray(ReflectionImpl_getIdForReflection(e), postOnChangeInfo)) {
    // If mouse is about to be released, wait till then before post (No need to post, if the current mouse event is going to post)
    var actionStr = ReflectionImpl_getDelayedRefreshActionString(tId);
    var waitTillMouseRelease = EventHandlers.setMouseReleaseActionString(actionStr);
    if (!waitTillMouseRelease) {
      // post after all other events already in queue get executed:
      eval(actionStr);
    }
    return;
  }

  //
  // client reflection:
  //
  if (bDirectChange) {
    this._reflectPath = [tId]; // reset reflect path
  }

  // gather all reflector aspects of this trigger:
  var aspects = [];
  var reflectors = [];
  var cancelledReflectors = [];
  for (var i=0; i<this.reflectors.length; i++) {
    var reflector = this.reflectors[i];
    if (this._trackElementsToRedo && DHTML.getElementById(reflector.id).tagName != 'SPAN') {
      continue; // ignore editable reflector, the value of which should have been remembered
    }
    if (!ArrayUtil.inArray(reflector.id, this._reflectPath)) {
      var oldLen = aspects.length;
      reflector.addAspects(e, bDirectChange, aspects);
      if (aspects.length > oldLen) {
        reflectors[reflectors.length] = reflector.id;
      }
    } else {
      // circle detected, cancel
      var temp = [];
      reflector.addAspects(e, bDirectChange, temp);
      if (temp.length > 0) {
        cancelledReflectors[cancelledReflectors.length] = reflector.id;
      }
    }
  }

  if (aspects.length > 0 || cancelledReflectors.length > 0) {
    // log debug info:
    if (Debug.isOn()) {
      var logMsg = '<b>Start reflecting </b>: ' + e.id;
      if (this._reflectPath.length > 1) {
        logMsg += '<br>(path): ' + this._reflectPath;
      }
      if (aspects.length > 0) {
        logMsg += '<br>(Reflectors): ';
        for (var i = 0; i < aspects.length; i++) {
          if (i>0) {
            logMsg += ' | '
          }
          logMsg += aspects[i].reflector.id + ' [' +aspects[i].name+ ']';
        }
      }
      if (cancelledReflectors.length > 0) {
        logMsg += '<br>(Circular reflectors cancelled): ' + cancelledReflectors;
      }
      Debug.log(logMsg);
    }

    var newValues = [];
    var ajaxRequests = [];
    var updateReflectors = function() {
      Reflection.updateAllReflectors(aspects, newValues);
      // update reflect path before invoking chained reflections:
      for (var i = 0; i < reflectors.length; i++) {
        Reflection._reflectPath[Reflection._reflectPath.length] = reflectors[i];
      }
    };

    // fetch new value for each aspect that has been triggered (some new value may be on the server side):
    for (var i = 0; i < aspects.length; i++) {
      newValues[i] = this.NO_CHANGE;
      var ajaxCall = aspects[i].addNewReflectorValue(e, newValues, i);
      if (ajaxCall) {
        ajaxRequests[ajaxRequests.length] = ajaxCall;
      }
    }

    // update all reflectors:
    if (ajaxRequests.length > 0) {
      // attach callback to the last AJAX request to update reflectors:
      var origCallback = ajaxRequests[ajaxRequests.length-1].callback;
      ajaxRequests[ajaxRequests.length-1].callback = function(){ origCallback(); updateReflectors(); };

      if (this._trackElementsToRedo) { // collect all ajax requests to be sent at once
        for (var i=0; i<ajaxRequests.length; i++) {
          this._pendingReqs.push(ajaxRequests[i]);
        }
      } else {
        AJAX.initRequestEx(ajaxRequests, true);
      }
    } else {
      updateReflectors();
    }
  }

  // update style class, if needed:
  DHTML.updateStyle(e);
  // update alt value, if any:
  DHTML.updateAltValue(e);

  if (this._trackElementsToRedo) {
    this._trackElementsToRedo.push(e); // simply collect pending sum-value calls
  } else {
    Events.queueUniqueItem(e, ReflectionImpl_updateSumValues); // wait till the end of operation before update sum, to avoid redundant AJAX calls
  }
}

/**
 * Updates sum values of the given elements
 * @param elemArray an array of elements
 */
function ReflectionImpl_updateSumValues(elemArray) {
  var reqs = DHTML.updateSumValues(elemArray)
  if (reqs) {
    AJAX.initRequestEx(reqs, true);
  }
}
/**
 * Update all reflectors based on the new values
 */
function ReflectionImpl_updateAllReflectors(aspects, newValues) {
  for (var i = 0; i < aspects.length; i++) {
    aspects[i].updateReflector(newValues[i]);
  }
}

function ReflectionImpl_getDelayedRefreshActionString(id) {
  return 'Events.queueEvent(\'Events.refresh(\\\''+id+'\\\')\');'
}

function ReflectionImpl_getIdForReflection(e) {
  var type = e.type;
  if (type == 'radio' || type == 'checkbox') {
    var id = e.id;
    var name = e.name;
    return id.indexOf(name) == 0 ? name : id; // if the id is in the form of "name"+"value", returns "name" as renderId
  } else {
    return e.id;
  }
}

/**
* Declare ReflectionImpl
*/
function ReflectionImpl() {
  /**
   * A string that can be evaluated to refresh page after all other events that are already in queue.
   * (E.g., in case of tabbing out a field, it will wait till the focus goes into the next field.)
   */
  this.NO_CHANGE = '<NOCHANGE>'; // a special string to indicate value not changed
  this.TRIGGER_INDEX_PARAM = 'TRIGGER_INDEX'; // name of trigger index param
}

ReflectionImpl.prototype.reflect = ReflectionImpl_reflect
ReflectionImpl.prototype.updateAllReflectors = ReflectionImpl_updateAllReflectors
ReflectionImpl.prototype.init = ReflectionImpl_init

/**
* Register as global library
*/
window.Reflection = new ReflectionImpl();



//------------------------------------------------------------ Reflector

/**
 * Reflector
 */
function Reflector (id, aspectMap) {
  if (arguments.length == 0) {
    return;
  }

  this.id = id;
  this.aspects = new Array();
  for (var name in aspectMap) {
    if (aspectMap.hasOwnProperty(name)) {
      if ('DIRECT_ONLY' == name) {
        this.bReflectDirectChangeOnly = aspectMap[name];
      } else {
        ArrayUtil.appendElement(this.aspects, new ReflectAspect(this, name, aspectMap[name]));
      }
    }
  }
}
/**
 * Adds all aspects that are triggered by the given trigger
 * @param e trigger
 * @param bDirectChange true, if this trigger is changed directly by the user
 * @param aspects the array to add into
 */
function ReflectorImpl_addAspects(e, bDirectChange, aspects) {
  if (!this.bReflectDirectChangeOnly || bDirectChange) {
    for (var i = 0; i < this.aspects.length; i++) {
      var aspect = this.aspects[i];
      if (aspect.isTriggered(e)) {
        aspects[aspects.length] = aspect;
      }
    }
  }
}

/**
 * If this reflector is a range reflector, adds to the map
 * @param reflectorToTriggersMap a map from rangeReflector to its triggers
 */
function ReflectorImpl_addRangeReflector(reflectorToTriggersMap) {
  for (var i = 0; i < this.aspects.length; i++) {
    var rangeTriggers = this.aspects[i].getRangeTriggers();
    if (rangeTriggers != null) {
      reflectorToTriggersMap[this.id] = rangeTriggers;
      break;
    }
  }
}
Reflector.prototype.addAspects = ReflectorImpl_addAspects
Reflector.prototype.addRangeReflector = ReflectorImpl_addRangeReflector


//------------------------------------------------------------ Reflector Aspect

/**
* Reflector Aspect:
*/
function ReflectAspect (reflector, name, args) {
  if (arguments.length == 0) {
    return;
  }
  this.reflector = reflector;
  this.name = name;
  this.method = args[0];
  this.tIds = args[1];
  if (args.length > 2) {
    this.args = args[2];
  }
}

/**
 * Returns true if this aspect is triggered by the trigger element
 */
function ReflectAspectImpl_isTriggered(e) {
  return ArrayUtil.inArray(ReflectionImpl_getIdForReflection(e), this.tIds);
}

/**
 * Returns trigger ids, if the is a range reflection aspect
 */
function ReflectAspectImpl_getRangeTriggers() {
  return this.name == 'OPTIONS' ? this.tIds : null;
}

/**
 * Caculates the new reflector value and adds to the specified array
 * @param e the trigger element
 * @param newValues the array to insert the new value
 * @param index index in the value array to insert the new value
 * @return null, or an AJAX request to fetch value from server
 */
function ReflectAspectImpl_addNewReflectorValue(e, newValues, index) {
  var ajaxParams = null;
  if (this.method == 'map') {
    ajaxParams = ReflectionImpl_getPrerequisiteAjaxParam(e); // if this is forced to be ajax reflection
  }

  if (ajaxParams == null) {
    ajaxParams = this[this.method](e, newValues, index);
  } else {
    ReflectionImpl_addAjaxParams(ajaxParams, this.name, this.tIds, e.id) // if we are sending an ajax request, append aspect type and other trigger values
  }
  if (ajaxParams) {
    Debug.log('Request reflecotr value from server for "' + this.reflector.id + '", trigger("'+e.id+'") - ' +this.name);
    return AJAX.buildSingleRequest(this.reflector.id, ajaxParams, function() {newValues[index] = AJAX.returnValue;});
  } else {
    return null;
  }
}

/**
 * Update reflector to the given value
 */
function ReflectAspectImpl_updateReflector(value) {
  if (value == Reflection.NO_CHANGE) {
    return; // no op
  }
  
  var rE = document.getElementById(this.reflector.id)
  switch (this.name) {
    case 'VALUE':
      DHTML.setValue(rE, value, null);
      break;
    case 'OPTIONS':
      DHTML.setOptions(rE, value);
      break;
    case 'AVAILABLE':
      DHTML.setAvailability(rE, value)
      break;
    case 'MASK':
      FieldValidation.setInputFieldValidator(rE.id, value);
      break;
    case 'CUSTOM':
      // no-op
      break;
    default:
      alert ("Unkown aspect: " + asName);
      break;
  }
}
/**
 * Get trigger value
 */
function ReflectAspectImpl_getTriggerValue(e, newValues, index) {
  newValues[index] = DHTML.getValue(e);
}
/**
 * Calculates new value from map:
 */
function ReflectAspectImpl_map (e, newValues, index) {
  if (this.args != null) {
    for (var i = 0; i<this.args.length; i++) {
      if (ArrayUtil.contentsEqual(this.args[i][0], DHTML.getValueByIds(this.tIds))) {
        newValues[index] = this.args[i][1];
        return null;
      }
    }
    newValues[index] = Reflection.NO_CHANGE;
    return null;
  } else { // value on server:
    return ReflectionImpl_addAjaxParams({}, this.name, this.tIds, e.id); // returns params to fetch new value from server thru AJAX
  }
}

/**
 * Adds the aspect type and trigger values to the ajax request params
 * @param params the param map
 * @param type aspect type
 * @param tIds an array of trigger ids
 * @param triggerId the one id among the tIds array that causes this reflection
 */
function ReflectionImpl_addAjaxParams(params, type, tIds, triggerId) {
  if (type) {
    params['aspectType'] = type;
  }
  var tValues = DHTML.getValueByIds(tIds);
  for (var i=0; i<tIds.length; i++) {
    params[tIds[i]] = tValues[i];
    if (tIds.length > 1 && triggerId == tIds[i]) {
      params[Reflection.TRIGGER_INDEX_PARAM] = i+1; // add 1-based trigger index to ajax params
    }
  }
  return params;
}

/**
 * Calculates new value from filter info
 */
function ReflectAspectImpl_filter (e, newValues, index) {
  var tValues = DHTML.getValueByIds(this.tIds);

  var result = new Array();
  for (var i = 0; i < this.args.length; i++) {
    var item = this.args[i][0]
    var ok = true;

    // check each trigger
    if (this.args[i].length > 1) {
      var conditions = this.args[i][1];

      for (var j = 0; j < tValues.length; j++) {
        var tValue = tValues[j]

        if (tValue != '') { // value specified
          var expected = conditions[this.tIds[j]]
          if (!ArrayUtil.inArray(tValue, expected)) {
            ok = false;
            break;
          }
        }
      }
    }

    if (ok) {
      ArrayUtil.appendElement(result, item);
    }
  }

  newValues[index] =  result;
}
/**
 * Evaluate expression
 */
function ReflectAspectImpl_eval(e, newValues, index) {

  // set up global variables before evaluate expression:
  window.VALUE = DHTML.getValue(e);
  // VALUE1, VALUE2, ..., and trigger index
  for (var i = 0; i < this.tIds.length; i++) {
    var idx = Number(i)+1;
    window['VALUE'+idx] = DHTML.getValueById(this.tIds[i]);
    if (this.tIds.length > 1 && e.id == this.tIds[i]) {
      window[Reflection.TRIGGER_INDEX_PARAM] = idx;
    }
  }
  // REFLECTOR:
  window.REFLECTOR = document.getElementById(this.reflector.id)

  newValues[index] =  eval(this.args[0]);
}
ReflectAspect.prototype.addNewReflectorValue = ReflectAspectImpl_addNewReflectorValue
ReflectAspect.prototype.updateReflector = ReflectAspectImpl_updateReflector
ReflectAspect.prototype.isTriggered = ReflectAspectImpl_isTriggered
ReflectAspect.prototype.getRangeTriggers = ReflectAspectImpl_getRangeTriggers

ReflectAspect.prototype.tv = ReflectAspectImpl_getTriggerValue
ReflectAspect.prototype.map = ReflectAspectImpl_map
ReflectAspect.prototype.filter = ReflectAspectImpl_filter
ReflectAspect.prototype.eval = ReflectAspectImpl_eval
