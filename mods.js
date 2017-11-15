exports.len = function(length, padder) {
  const testInt = parseInt(padder, 10);
  let isNumber;

  // default the padder to a space
  padder = (! isNaN(testInt)) ? testInt : (padder || ' ');

  // check whether we have a number for padding (we will pad left if we do)
  isNumber = typeof padder == 'number';
  return function(input) {
    let output = input.toString().slice(0, length);
    while (output.length < length) {
      output = isNumber ? padder + output : output + padder;
    }
    
    return output;
  };
};
