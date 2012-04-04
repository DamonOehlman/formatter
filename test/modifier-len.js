var expect = require('expect.js'),
    formatter = require('../pkg/cjs/formatter');

describe('length modifier tests', function() {
    it('should be able to process a length modifier (numeric args)', function() {
        var line = formatter('{{ 0|len:10 }}');
        
        expect(line).to.be.ok();
        expect(line('test')).to.equal('test      ');
    });
    
    it('should be able to process a length modifier (numeric args, custom padding charater)', function() {
        var line = formatter('{{ 0|len:10:a }}');
        
        expect(line).to.be.ok();
        expect(line('test')).to.equal('testaaaaaa');
    });
    
    it('should be able to process a length modifier (named args)', function() {
        var line = formatter('{{ name|len:10 }}');
        
        expect(line).to.be.ok();
        expect(line({ name: 'Ted' })).to.equal('Ted       ');
    });
    
    it('should be able to process a length modifier (named args, custom padding charater)', function() {
        var line = formatter('{{ name|len:10:a }}');
        
        expect(line).to.be.ok();
        expect(line({ name: 'Ted' })).to.equal('Tedaaaaaaa');
    });
});