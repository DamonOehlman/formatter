var expect = require('expect.js'),
    formatter = require('../formatter');

describe('multiline input strings', function() {
    it('should be able to replace named expressions (spaceless expression)', function() {
        var test = formatter('Hi there.\nYour name is {{name}}!');
        
        expect(test).to.be.ok();
        expect(test({ name: 'Bob' })).to.equal('Hi there.\nYour name is Bob!');
    });
    
    /*
    it('should be able to replace named expressions (with spaces in the expression)', function() {
        var test = formatter('Hi there {{ name }}!');
        
        expect(test).to.be.ok();
        expect(test({ name: 'Bob' })).to.equal('Hi there Bob!');
    });

    it('should be able to replace multiple instances of a variable', function() {
        var test = formatter('I like {{ like }}, {{ like }} tastes great!');
        
        expect(test).to.be.ok();
        expect(test({ like: 'bacon' })).to.equal('I like bacon, bacon tastes great!');
    });
    
    it('should be able replace multiple argument values', function() {
        var test = formatter('I like {{ best }}, it is way better than {{ ok }}...');
        
        expect(test).to.be.ok();
        expect(test({ best: 'bacon', ok: 'ham' })).to.equal('I like bacon, it is way better than ham...');
    });
    
    it('should remove unresolved placeholders', function() {
        var test = formatter('Hi there {{ name}}!');
        
        expect(test()).to.equal('Hi there !');
    });
    */
});