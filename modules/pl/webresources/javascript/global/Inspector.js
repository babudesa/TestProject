/**
 * (c) 2003 Guidewire Software
 *
 * Class: Inspector
 *
 * Implements the JavaScript inspector, a debugging tool for JavaScript.
 * Invoked with Alt+Shift+I after clicking in the frame to inspect.
 */

/**
 * Opens inspector window.
 */
function inspector() {
  inspectorWindow = showFrame('jsinspector');
}

/**
 * Evaluates the string passes in and returns the formatted results.
 */
function inspectValues(toInspect) {
  var result, formattedResult = '';
  try {
    result = eval(toInspect);
  } catch (e) {
    result = new Array();
    result[0] = 'Error encountered!';
    result[1] = e.description;
  }

  var resultType = typeof result;

  if(resultType == 'string' || resultType == 'number' || resultType == 'boolean' ||
     resultType == 'undefined' || resultType == 'function' || result == null) {
    formattedResult = inspectValue(result, resultType);
  } else if(result instanceof Array) {
    formattedResult = 'Array(' + result.length + '): {' + inspectArray(toInspect, result) + '<br>}';
  } else {
    formattedResult = 'Object {' + inspectObject(toInspect, result) + '<br>}';
  }

  return formattedResult;
}

/**
* Inspects an array
*/
function inspectArray(toInspect, result) {
  var formattedResult = '';
  for(var i = 0; i < result.length; i++) {
    var subItem = toInspect + '[' + i + ']';
    formattedResult += '<br>&nbsp; &nbsp; <b>' + subItem + '</b> = ' + inspectValue(result[i], typeof result[i], subItem);
  }
  return formattedResult;
}

/**
 * Inspects a single object
 */
function inspectObject(toInspect, result) {
  var formattedResult = '';
  var keys = new Array();
  for(var a in result) {
    if(a != 'innerHTML' && a != 'outerHTML' && a != 'fileUpdatedDate') {
      keys[keys.length] = a + "";
    }
  }
  keys.sort();
  for(var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var subItem = toInspect +  "[" + key + "]";
    for(var j = 0; j < key.length; j++) {
      if("0123456789".indexOf(key.charAt[j]) == -1) {
        subItem = toInspect +  '.' + key;
      }
    }
    formattedResult += '<br>&nbsp; &nbsp; <b>' + subItem + '</b> = ';
    try {
      formattedResult += inspectValue(result[key], typeof result[key], subItem);
    } catch (err) {
      formattedResult += '<i>ERROR</i>';
    }
  }
  return formattedResult;
}

/**
 * Inspect a single value
 */
function inspectValue(value, valueType, valueLink) {
  if(valueType == 'string') {
    return "'" + value + "'";
  } else if(valueType == 'number' || valueType == 'boolean') {
    return value;
  } else if(valueType == 'undefined') {
    return '<i>undefined</i>';
  } else if(valueType == 'function') {
    return '<i>function</i>';
  } else if(value == null) {
    return '<i>null</i>';
  } else {
    return '<a href="javascript:inspect(&quot;' + valueLink + '&quot;)">' +
          ((value instanceof Array) ? 'Array[' + value.length + ']' : 'Object') + '</a>';
  }
}

/**
 * Opens up a view with the basic information about the Location.
 */
function locationInfo() {
  showFrame('locinfo');
}

/**
 * Opens up a view of the widget contents of the page.
 */
function widgetPageInfo() {
  showFrame('widget');
}

function showFrame(frameId) {
  return window.open(window.location.pathname + '?inFrame=' + frameId + '&r=' + Math.floor(Math.random() * 10000),
              frameId,
              'scrollbars=yes,width=600,height=500,dependent=yes,resizable=yes');
}
