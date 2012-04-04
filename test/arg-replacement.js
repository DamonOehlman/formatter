var expect = require('expect.js'),
    formatter = require('../pkg/cjs/formatter');

describe('argument replacement tests', function() {
    it('should be able to replace numeric expressions with argument values', function() {
        var test = formatter('Hi there {{0}}!');
        
        expect(test).to.be.ok();
        expect(test('Bob')).to.equal('Hi there Bob!');
    });
    
    it('should be able to replace numeric expressions when the string contains spaces', function() {
        var test = formatter('Hi there {{ 0 }}!');
        
        expect(test).to.be.ok();
        expect(test('Bob')).to.equal('Hi there Bob!');
    });
});