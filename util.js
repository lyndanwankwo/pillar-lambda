const to = {
    ones: { pos: 'e0', neg:'e-0' },
    tenths: { pos: 'e1', neg:'e-1' },
    hundredths: { pos: 'e2', neg:'e-2' },
    thousandths: { pos: 'e3', neg:'e-3' }
  }
  
  function round(value) {
    return Math.round(value * 100) / 100;
  }
  
  function roundSigned(value) {
    return Math.sign(value) > 0 ? Math.round(value) : Math.round(value * -1) * -1;
  }
  
  function roundRecurring(value) {
    const fraction = value % 1;
    return (fraction > 0.49) ? Math.ceil(value) : Math.round(value);
  }
  
  function roundSignedRecurring(value) {
    return Math.sign(value) > 0 ? roundRecurring(value) : roundRecurring(value * -1) * -1;
  }
  
  
  function roundTo(to, value) {
   if (value > -0.0000000001 && value < 0.0000000001) return 0;
    let roundedValue = Number(Math.round(parseFloat(value.toPrecision(15)) + to.pos) + to.neg);
    return roundedValue;
  }
  
  function getFirstValueIfArray(arg) {
    return Array.isArray(arg) ? arg[0] : arg;
  }
  
  function findByPropertyExists(key, iterable) {
    // in case iterable is object of objects
    if (iterable instanceof Object) {
      for (let [objK, item] of Object.entries(iterable)) {
        if (key in item) return item[key];
      }
    }
    // in case iterable Array of objects
    else {
      let foundItem = iterable.find(function (item) {
        return key in item;
      });
      return foundItem[key]
    }
  }
  
  function isBetweenNumbers(value, lower, upper) {
    return lower <= value && value <= upper;
  }
  
  function atLeast(value, lowerBound) {
    return value > lowerBound ? value : lowerBound;
  }
  
  function atMost(value, upperBound) {
    return value < upperBound ? value : upperBound;
  }
  
  function atBounds(value, lowerBound, upperBound) {
    return atMost(atLeast(value, lowerBound), upperBound);
  }
  
  function trimAndLower(value) {
    return value.trim().toLowerCase();
  }
  
  function trimAndUpper(value) {
    return value.trim().toUpperCase();
  }
  
  function trimLowerRemoveNonAlphanumeric(value) {
    let retVal = trimAndLower(value);
    retVal = retVal.replace(/[\s\W]*/g, '');
    return retVal;
  }
  
  function cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  exports.to = to;
  exports.round = round;
  exports.roundSigned = roundSigned;
  exports.roundRecurring = roundRecurring;
  exports.roundSignedRecurring = roundSignedRecurring;
  exports.roundTo = roundTo;
  exports.getFirstValueIfArray = getFirstValueIfArray;
  exports.findByPropertyExists = findByPropertyExists;
  exports.isBetweenNumbers = isBetweenNumbers;
  exports.atLeast = atLeast;
  exports.atMost = atMost;
  exports.atBounds = atBounds;
  exports.trimAndLower = trimAndLower;
  exports.trimAndUpper = trimAndUpper;
  exports.trimLowerRemoveNonAlphanumeric = trimLowerRemoveNonAlphanumeric;
  exports.cloneObj = cloneObj;
  