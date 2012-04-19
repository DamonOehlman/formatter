var expect = require('expect.js'),
    formatter = require('../pkg/cjs/formatter');

describe('nested expression replacement tests', function() {
    it('should be able to replace simple nested expressions', function() {
        var test = formatter('Hi there {{ person.name }}!');
        
        expect(test).to.be.ok();
        expect(test({ person: { name: 'Bob' }})).to.equal('Hi there Bob!');
    });
});