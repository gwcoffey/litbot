import { expect } from "chai";
import { validatePostJson as validate } from "../../src/lib/posts_validator";

describe('validate schemas', () => {
    it('status with just status should be valid', () => {
        var result = validate([[{"status": "foo"}]])
        expect(result.ok).to.equal(true)
    });

    it('status with spoiler_text should be valid', () => {
        var result = validate([[{"status": "foo", "spoiler_text": "bar"}]])
        expect(result.ok).to.equal(true)
    });

    it('status with visibility public should be valid', () => {
        var result = validate([[{"status": "foo", "visibility": "public"}]])
        expect(result.ok).to.equal(true)
    });

    it('status with visibility unlisted should be valid', () => {
        var result = validate([[{"status": "foo", "visibility": "unlisted"}]])
        expect(result.ok).to.equal(true)
    });

    it('status with visibility private should be valid', () => {
        var result = validate([[{"status": "foo", "visibility": "private"}]])
        expect(result.ok).to.equal(true)
    });

    it('status with visibility direct should be valid', () => {
        var result = validate([[{"status": "foo", "visibility": "direct"}]])
        expect(result.ok).to.equal(true)
    });

    it('status with scheduled_in should be valid', () => {
        var result = validate([[{"status": "foo", "scheduled_in": 300}]])
        expect(result.ok).to.equal(true)
    });

    it('status with minimal poll should be valid', () => {
        var result = validate([[{"status": "foo", "poll": {"options": ["bar"], "expires_in": 10}}]])
        expect(result.ok).to.equal(true)
    });

    it('status with fully specified poll should be valid', () => {
        var result = validate([[{"status": "foo", "poll": {"options": ["bar", "baz"], "expires_in": 10, "multiple": true, "hide_totals": true}}]])
        expect(result.ok).to.equal(true)
    });

    it('empty thread array should be invalid', () => {
        var result = validate([])
        expect(result.ok).to.equal(false)
    });

    it('empty thread should be invalid', () => {
        var result = validate([[]])
        expect(result.ok).to.equal(false)
    });

    it('empty status object should be invalid', () => {
        var result = validate([[{}]])
        expect(result.ok).to.equal(false)
    });

    it('status with empty text should be invalid', () => {
        var result = validate([[{"status": ""}]])
        expect(result.ok).to.equal(false)
    });

    it('status with invalid visibility text should be invalid', () => {
        var result = validate([[{"status": "foo", "visibility": "invalid"}]])
        expect(result.ok).to.equal(false)
    });

    it('status with zero scheduled_in should be invalid', () => {
        var result = validate([[{"status": "foo", "scheduled_in": 0}]])
        expect(result.ok).to.equal(false)
    });

    it('status with negative scheduled_in should be invalid', () => {
        var result = validate([[{"status": "foo", "scheduled_in": -300}]])
        expect(result.ok).to.equal(false)
    });

    it('status with poll with no options should be invalid', () => {
        var result = validate([[{"status": "foo", "poll": {"expires_in": 10}}]])
        expect(result.ok).to.equal(false)
    });

    it('status with poll with empty options should be invalid', () => {
        var result = validate([[{"status": "foo", "poll": {"options": [], "expires_in": 10}}]])
        expect(result.ok).to.equal(false)
    });

    it('status with poll with no expires_in should be invalid', () => {
        var result = validate([[{"status": "foo", "poll": {"options": ["bar"]}}]])
        expect(result.ok).to.equal(false)
    });

    it('status with poll with zero expires_in should be invalid', () => {
        var result = validate([[{"status": "foo", "poll": {"options": ["bar"], "expires_in": 0}}]])
        expect(result.ok).to.equal(false)
    });

    it('status with poll with negative expires_in should be invalid', () => {
        var result = validate([[{"status": "foo", "poll": {"options": ["bar"], "expires_in": -100}}]])
        expect(result.ok).to.equal(false)
    });
});