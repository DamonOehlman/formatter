var expect = require('expect.js'),
    formatter = require('../formatter'),
    message = 'Unable to run module: {{ name }}';

describe('error helper tests', function() {
    it('should be able to create an error formatter', function() {
        var helper = formatter.error(message);
        
        expect(helper).to.be.ok();
        expect(typeof helper).to.equal('function');
    });
    
    it('should pass through falsy values', function() {
        var helper = formatter.error(message);
        
        expect(helper()).to.not.be.ok();
    });
    
    it('should mark up errors (removing unused variables)', function() {
        var helper = formatter.error(message),
            error = helper(new Error());
        
        expect(error).to.be.ok();
        expect(error.message).to.be.ok();
        expect(error.message).to.equal('Unable to run module: ');
    });
    
    it('should mark up errors (expanding known variables)', function() {
        var helper = formatter.error(message),
            error = helper(new Error(), { name: 'test' });
        
        expect(error).to.be.ok();
        expect(error.message).to.be.ok();
        expect(error.message).to.equal('Unable to run module: test');
    });
});