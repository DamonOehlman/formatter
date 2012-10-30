var expect = require('expect.js'),
    formatter = require('../formatter'),
    testData = {
        name: 'Bob',
        
        address: {
            street: {
                number: 15,
                name: 'West St'
            },
            
            country: 'Australia'
        }
    };

describe('nested expression replacement tests', function() {
    it('should be able to extract simple values from compound data', function() {
        var test = formatter('Hi there {{ name }}!');
        
        expect(test).to.be.ok();
        expect(test(testData)).to.equal('Hi there Bob!');
    });

    it('should be able to extract a value 2 levels deep', function() {
        var test = formatter('Hi there {{ name }} from {{ address.country }}!');
        
        expect(test).to.be.ok();
        expect(test(testData)).to.equal('Hi there Bob from Australia!');
    });
    
    it('should be able to extract a value 3 levels deep', function() {
        var test = formatter('{{ name }} lives on a street named {{ address.street.name }}');
        
        expect(test).to.be.ok();
        expect(test(testData)).to.equal('Bob lives on a street named West St');
    });
});