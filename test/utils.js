/**
Determines if the input array is sorted, using the '>' 
comparision between successive elements. 

@param arr: input array
@returns: false if the input is not an array or is not 
  sorted
**/
function isSorted(arr) {
  if (!arr || arr.constructor != Array) {
    return false; 
  }

  if (arr.length < 2) return true;

  for (var i = 0; i < arr.length-1; i++) {
    if (arr[i] > arr[i+1]) return false;
  }
  return true; 
}

module.exports.isSorted = isSorted; 
