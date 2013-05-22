/* ~formatter~
 * 
 * Simple String Variable Replacement Formatter
 * 
 * -meta---
 * version:    0.1.5
 * builddate:  2012-10-30T00:00:26.204Z
 * generator:  interleave@0.5.23
 * 
 * 
 * 
 */ 

// umdjs returnExports pattern: https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root['formatter'] = factory();
    }
}(this, function () {
    var reVariable = /\{\{\s*([^\}]+?)\s*\}\}/,
        mods = {},
        isNumber;
        
    // initialise the length mod
    mods.len = function(length, padder) {
        var testInt = parseInt(padder, 10);

        // default the padder to a space
        padder = (! isNaN(testInt)) ? testInt : (padder || ' ');

        // check whether we have a number for padding (we will pad left if we do)
        isNumber = typeof padder == 'number';
        console.log(padder, isNumber);
        
        return function(input) {
            var output = input.toString().slice(0, length);
            
            // pad the string to the required length
            while (output.length < length) {
                output = isNumber ? padder + output : output + padder;
            }
            
            return output;
        };
    };
    
    function createModifiers(modifierStrings) {
        var modifiers = [];
        
        for (var ii = 0, count = modifierStrings.length; ii < count; ii++) {
            var parts = modifierStrings[ii].split(':'),
                fn = mods[parts[0].toLowerCase()];
            
           if (fn) {
               modifiers[modifiers.length] = fn.apply(null, parts.slice(1));
           }
        }
        
        return modifiers;
    }
    
    function formatter(format) {
        // extract the matches from the string
        var parts = [], chunk, varname, varParts,
            match = reVariable.exec(format);
            
        while (match) {
            // get the prematch chunk
            chunk = format.slice(0, match.index);
            
            // if we have a valid chunk, add it to the parts
            if (chunk) {
                parts[parts.length] = chunk;
            }
            
            varParts = match[1].split(/\s*\|\s*/);
            match[1] = varParts[0];
            
            // extract the varname
            varname = parseInt(match[1], 10);
            
            // extract the expression and add it as a function
            parts[parts.length] = {
                numeric: !isNaN(varname),
                varname: varname || match[1],
                modifiers: varParts.length > 1 ? createModifiers(varParts.slice(1)) : []
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
                    // if this is a numeric part, this is a simple index lookup
                    if (part.numeric) {
                        output[ii] = arguments[part.varname];
                    }
                    // otherwise, we are doing a recursive property search
                    else {
                        var propNames = (part.varname || '').split('.');
                        
                        output[ii] = (arguments[0] || {});
                        while (output[ii] && propNames.length > 0) {
                            var val = output[ii][propNames.shift()];
                            
                            output[ii] = typeof val != 'undefined' ? val : '';
                        }
                    }
                    
                    // if we have modifiers, then tweak the output
                    for (var modIdx = 0, count = part.modifiers.length; modIdx < count; modIdx++) {
                        output[ii] = part.modifiers[modIdx](output[ii]);
                    }
                }
            }
            
            // return the output
            return output.join('');
        };
    }
    
    formatter.error = function(message) {
        // create the format
        var format = formatter(message);
        
        return function(err) {
            var output;
            
            // if no error has been supplied, then pass it straight through
            if (! err) return;
            
            // otherwise create a new error with the formatter message in
            output = new Error(format.apply(null, Array.prototype.slice.call(arguments, 1)));
            output._original = err;
            
            // return the new error
            return output;
        };
    };
    
    return typeof formatter != 'undefined' ? formatter : undefined;
}));