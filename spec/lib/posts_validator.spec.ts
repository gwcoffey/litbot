import { expect } from "chai";
import { validatePostJson as validate } from "../../src/lib/posts_validator";

describe('validate schemas', () => {
    it('post with text and location should be valid', () => {
        var result = validate([{"text": "foo", "location": ["bar"]}])
        expect(result.ok).to.equal(true)
    });

    it('post with content_warning should be valid', () => {
        var result = validate([{"text": "foo", "location": ["bar"], "content_warning": "baz"}])
        expect(result.ok).to.equal(true)
    });

    it('empty array should be invalid', () => {
        var result = validate([])
        expect(result.ok).to.equal(false)
    });

    it('post with no props should be invalid', () => {
        var result = validate([{}])
        expect(result.ok).to.equal(false)
    });

    it('post with no location should be invalid', () => {
        var result = validate([{"text": "foo"}])
        expect(result.ok).to.equal(false)
    });

    it('post with no text should be invalid', () => {
        var result = validate([{"location": ["bar"]}])
        expect(result.ok).to.equal(false)
    });

    it('post with empty text should be invalid', () => {
        var result = validate([{"text": "", "location": ["bar"]}])
        expect(result.ok).to.equal(false)
    });

    it('post with empty location name should be invalid', () => {
        var result = validate([{"text": "foo", "location": [""]}])
        expect(result.ok).to.equal(false)
    });

    it('post with empty location array should be invalid', () => {
        var result = validate([{"text": "foo", "location": []}])
        expect(result.ok).to.equal(false)
    });

});