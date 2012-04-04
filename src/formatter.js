var reVariable = /\{\{\s*([^\}])\s*\}\}/;

function createReplacer(variable) {
    // get the varname
    var parsedVar = parseInt(variable, 10);
    
    // if the varname is not a number, fall back to the pure match
    if (isNaN(parsedVar)) {
        parsedVar = variable;
    }
    
    
    if (typeof parsedVar == 'number') {
        return function() {
            return arguments[parsedVar] || '';
        };
    }
    else {
        return function() {
            return (arguments[0] || {})[parsedVar] || '';
        };
    }
}

function formatter(format) {
    // extract the matches from the string
    var parts = [], chunk,
        match = reVariable.exec(format);
        
    while (match) {
        // get the prematch chunk
        chunk = format.slice(0, match.index);
        
        // if we have a valid chunk, add it to the parts
        if (chunk) {
            parts[parts.length] = chunk;
        }
        
        // extract the expression and add it as a function
        parts[parts.length] = createReplacer(match[1]);

        // remove this matched chunk and replacer from the string
        format = format.slice(match.index + match[0].length);
        
        // check for the next match
        match = reVariable.exec(format);
    }
    
    // if we still have some of the format string remaining, add it to the parts list
    if (format) {
        parts[parts.length] = format;
    }
    
    return function() {
        var output = [];
        
        // iterate through the parts list and compile the result string
        for (var ii = parts.length; ii--; ) {
            if (typeof parts[ii] == 'function') {
                output[ii] = parts[ii].apply(null, arguments);
            }
            else {
                output[ii] = parts[ii];
            }
        }
        
        // return the output
        return output.join('');
    };
}