var reVariable = /\{\{\s*([^\}]+?)\s*\}\}/;

function formatter(format) {
    // extract the matches from the string
    var parts = [], chunk, varname,
        match = reVariable.exec(format);
        
    while (match) {
        // get the prematch chunk
        chunk = format.slice(0, match.index);
        
        // if we have a valid chunk, add it to the parts
        if (chunk) {
            parts[parts.length] = chunk;
        }
        
        // extract the varname
        varname = parseInt(match[1], 10);
        
        // extract the expression and add it as a function
        parts[parts.length] = {
            numeric: !isNaN(varname),
            varname: varname || match[1]
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
        var output = [].concat(parts);
        
        // iterate through the parts list and compile the result string
        for (var ii = output.length; ii--; ) {
            var part = output[ii];
            
            if (typeof part == 'object') {
                output[ii] = (part.numeric ? arguments[part.varname] : (arguments[0] || {})[part.varname]) || '';
            }
        }
        
        // return the output
        return output.join('');
    };
}

module.exports = formatter;