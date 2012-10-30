var expect = require('expect.js'),
    formatter = require('../formatter');

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

    it('should be able to replace multiple instances of a variable', function() {
        var test = formatter('I like {{ 0 }}, {{ 0 }} tastes great!');
        
        expect(test).to.be.ok();
        expect(test('bacon')).to.equal('I like bacon, bacon tastes great!');
    });
    
    it('should be able replace multiple argument values', function() {
        var test = formatter('I like {{ 0 }}, it is way better than {{ 1 }}...');
        
        expect(test).to.be.ok();
        expect(test('bacon', 'ham')).to.equal('I like bacon, it is way better than ham...');
    });
});