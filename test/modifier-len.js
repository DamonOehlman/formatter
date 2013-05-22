var expect = require('expect.js'),
    formatter = require('../formatter');

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

    it('should pad numeric ladding to the left of the original value', function() {
        var line = formatter('{{ value|len:10:0 }}');

        expect(line).to.be.ok();
        expect(line({ value: 500 })).to.equal('0000000500');
    });
});