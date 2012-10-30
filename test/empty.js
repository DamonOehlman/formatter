var expect = require('expect.js'),
    formatter = require('../formatter');

describe('empty formatter tests', function() {
    it('should be able to successfully parse an empty formatter string', function() {
        var empty = formatter('');
        
        expect(empty).to.be.ok();
        expect(empty()).to.equal('');
        expect(empty('hi')).to.equal('');
    });
    
    it('should be able to successfully parse a formatter with no arguments', function() {
        var empty = formatter();
        
        expect(empty).to.be.ok();
        expect(empty()).to.equal('');
        expect(empty('hi')).to.equal('');
    });
});