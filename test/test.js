'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
describe('hello', () => {
    it('should return message', () => {
        var result = index.hello();
        expect(result).to.equal('Hello world!');
    });
});