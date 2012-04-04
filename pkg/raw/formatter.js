var reVariable = /\{\{([^\}])\}\}/;

function formatter(format) {
    // extract the matches from the string
    var parts = [], chunk,
        match = reVariable.exec(format);
        
    while (match) {
        // get the prematch chunk
        chunk = format.slice(0, match.index - 1);
        
        // if we have a valid chunk, add it to the parts
        if (chunk) {
            parts[parts.length] = chunk;
        }
        
        // extract the expression and add it as a function
        parts[parts.length] = function(args) {
            return '';
        };

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
                output[ii] = parts[ii].apply(arguments);
            }
            else {
                output[ii] = parts[ii];
            }
        }
        
        // return the output
        return output.join('');
    };
}