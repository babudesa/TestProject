/**
 * (c) 2003 Guidewire Software
 *
 * Class: ArrayUtil
 *
 * Contains global helper functions for manipluating arrays.
 * Feel free to add your own helper functions here.
 */

/**
 * Register the ArrayUtil class as a global library
 */
window.ArrayUtil = new ArrayUtilImpl();

/**
 * Constructor
 */
function ArrayUtilImpl() {
  // Do nothing
}

/**
 * Returns true if the passed object is an array
 */
ArrayUtilImpl.prototype.isArray = function(obj) { 
  return typeof(obj.length) != 'undefined'; 
}

/**
 * Returns true if the passed in-needle exists in the "haystack" array
 */
ArrayUtilImpl.prototype.inArray = function(needle, haystack) {
  if (haystack == null) {
    return false;
  }
  for (var i = 0; i < haystack.length; i++) {
    if (haystack[i] == needle) {
      return true;
    }
  }
  return false;
}

ArrayUtilImpl.prototype.indexOf = function(needle, haystack) {
  if (haystack == null) {
    return -1;
  }
  for (var i = 0; i < haystack.length; i++) {
    if (haystack[i] == needle) {
      return i;
    }
  }
  return -1;
}

/**
 * Helper: removes a single element from an array (splice not available in IE5)
 */
ArrayUtilImpl.prototype.removeElement = function(array, index) {
  if (index >= array.length || index < 0) {
    DHTML.alert("Bug: attempting to remove element " + index + " from array " + array);
    return;
  }
  for (var i = index + 1; i < array.length; i++) {
    array[i - 1] = array[i];
  }
  array.length--;
}

/**
 * Helper: appends a single element to an array (push not available in IE5)
 */
ArrayUtilImpl.prototype.appendElement = function(array, element) {
  array[array.length] = element;
  return array;
}

/**
 * Helper: compare two arrays, and return true if they refer to the same set of objects, false otherwise
 * NOTE: this will not work (as written) for arrays which contain other arrays; the contents of the array
 * arguments are compared as primitives, so arrays of objects will only return true if the contents if they
 * are ==
 */
ArrayUtilImpl.prototype.contentsEqual = function(a1, a2) {
  if (a1 == a2) {
    return true;
  }
  if (!a1 || !a2) {
    return (!a1 && !a2);
  }
  if (a1.length != a2.length) {
    return false;
  }
  for (var i=0;i<a1.length;i++) {
    if (a1[i] != a2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Helper: Remove any elements from needles which are not in haystack. NOTE: THIS WILL MODIFY NEEDLES
 */
ArrayUtilImpl.prototype.removeMissingValues = function(needles, haystack) {
  //Remove items from the value set which are not in the next array
  var validValueCount = 0;
  for (var i=0; i < needles.length ; i++) {
    if (ArrayUtil.inArray(needles[i], haystack)) {
      if (i != validValueCount) {
        needles[validValueCount] = needles[i];
      }
      validValueCount++;
    }
  }
  needles.length = validValueCount;  
}
