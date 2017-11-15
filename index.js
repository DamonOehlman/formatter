const reVariable = /\{\{\s*([^\}]+?)\s*\}\}/;
const mods = require('./mods');

var formatter = module.exports = function(format, opts) {
  const ignoreNumeric = (opts || {}).ignoreNumeric;
  const parts = [];
  const output = [];

  let chunk;
  let varname;
  let varParts;
  let match = reVariable.exec(format);
  let isNumeric;
  let outputIdx = 0;

  while (match) {
    // get the prematch chunk
    chunk = format.slice(0, match.index);
    if (chunk) {
      output[outputIdx++] = chunk;
    }
    
    varParts = match[1].split(/\s*\|\s*/);
    match[1] = varParts[0];
    
    // extract the varname
    varname = parseInt(match[1], 10);
    isNumeric = !isNaN(varname);

    // if this is a numeric replacement expression, and we are ignoring
    // those expressions then pass it through to the output
    if (ignoreNumeric && isNumeric) {
      output[outputIdx++] = match[0];
    } else {
      // extract the expression and add it as a function
      parts[parts.length] = {
        idx: (outputIdx++),
        numeric: isNumeric,
        varname: isNumeric ? varname : match[1],
        modifiers: varParts.length > 1 ? createModifiers(varParts.slice(1)) : []
      };
    }

    // remove this matched chunk and replacer from the string
    format = format.slice(match.index + match[0].length);

    // check for the next match
    match = reVariable.exec(format);
  }
  
  // if we still have some of the format string remaining, add it to the list
  if (format) {
    output[outputIdx++] = format;
  }

  return collect(parts, output);
};

formatter.error = function(message) {
  // create the format
  var format = formatter(message);
  
  return function(err) {
    var output;
    
    // if no error has been supplied, then pass it straight through
    if (! err) {
      return;
    }

    output = new Error(
      format.apply(null, Array.prototype.slice.call(arguments, 1)));

    output._original = err;

    // return the new error
    return output;
  };
};

function collect(parts, resolved, indexShift) {
  // default optionals
  indexShift = indexShift || 0;

  return function() {
    var output = [].concat(resolved);
    var unresolved;
    var ii;
    var part;
    var partIdx;
    var propNames;
    var val;
    var numericResolved = [];

    // find the unresolved parts
    unresolved = parts.filter(function(part) {
      return typeof output[part.idx] == 'undefined';
    });

    // initialise the counter
    ii = unresolved.length;

    // iterate through the unresolved parts and attempt to resolve the value
    for (; ii--; ) {
      part = unresolved[ii];

      if (typeof part == 'object') {
        // if this is a numeric part, this is a simple index lookup
        if (part.numeric) {
          partIdx = part.varname - indexShift;
          if (arguments.length > partIdx) {
            output[part.idx] = arguments[partIdx];
            if (numericResolved.indexOf(part.varname) < 0) {
              numericResolved[numericResolved.length] = part.varname;
            }
          }
        }
        // otherwise, we are doing a recursive property search
        else if (arguments.length > 0) {
          propNames = (part.varname || '').split('.');

          // initialise the output from the last valid argument
          output[part.idx] = (arguments[arguments.length - 1] || {});
          while (output[part.idx] && propNames.length > 0) {
            val = output[part.idx][propNames.shift()];
            output[part.idx] = typeof val != 'undefined' ? val : '';
          }
        }

        // if the output was resolved, then apply the modifier
        if (typeof output[part.idx] != 'undefined' && part.modifiers) {
          output[part.idx] = applyModifiers(part.modifiers, output[part.idx]);
        }
      }
    }

    // reasses unresolved (only caring about numeric parts)
    unresolved = parts.filter(function(part) {
      return part.numeric && typeof output[part.idx] == 'undefined';
    });

    // if we have no unresolved parts, then return the value
    if (unresolved.length === 0) {
      return output.join('');
    }

    // otherwise, return the collect function again
    return collect(
      parts,
      output,
      indexShift + numericResolved.length
    );
  };
}

function applyModifiers(modifiers, value) {
  // if we have modifiers, then tweak the output
  for (var ii = 0, count = modifiers.length; ii < count; ii++) {
    value = modifiers[ii](value);
  }

  return value;
}

function createModifiers(modifierStrings) {
  var modifiers = [];
  var parts;
  var fn;
  
  for (var ii = 0, count = modifierStrings.length; ii < count; ii++) {
    parts = modifierStrings[ii].split(':');
    fn = mods[parts[0].toLowerCase()];
    
    if (fn) {
      modifiers[modifiers.length] = fn.apply(null, parts.slice(1));
    }
  }
  
  return modifiers;
}
