'use strict';

class Wrapper {
    /**
     * Builds object with test cases
     * @constructor
     *
     * @param {String} title - short definition of object
     * @param {WrapperFunction} [wrapFn] - object builder
     * @param {TestCase} [cases] - test cases
     */
    constructor(title, wrapFn, cases) {
        this.title = title;
        this.builder = Wrapper.normalizeFn(wrapFn);

        this.cases = cases || [];
    }

    /**
     * Adds test case
     *
     * @param {String} subTitle - short definition of test case
     * @param {Object} obj - an argument to wrapper function
     * @param {ValidationError} [error] - error if obj validation fails, omitted for positive cases
     */
    addCase(subTitle, obj, error) {
        this.cases.push({
            title: this.formatTitle(subTitle),
            obj: this.builder(obj),
            error: error
        });
    }

    /**
     * Builds full definition for test case
     *
     * @param {String} subTitle - short definition of test case
     *
     * @returns {String}
     */
    formatTitle(subTitle) {
        return subTitle ? this.title + ': ' + subTitle : this.title;
    }

    /**
     * Builds inner object with test cases
     * @constructor
     *
     * @param {String} title - short definition of object
     * @param {WrapperFunction} [wrapFn] - object builder
     */
    createInnerWrapper(title, wrapFn) {
        const innerBuilder = Wrapper.normalizeFn(wrapFn);

        return new Wrapper(this.formatTitle(title), obj => this.builder(innerBuilder(obj)), this.cases);
    }

    /**
     * Returns all test cases
     *
     * @returns {TestCase[]}
     */
    getCases() {
        return this.cases;
    }

    /**
     * @param {Function} [fn]
     *
     * @returns {Function}
     */
    static normalizeFn(fn) {
        return fn || (obj => obj);
    }
}

module.exports = Wrapper;

/**
 * @typedef {Object} TestCase
 *
 * @property {String} title - short definition of case
 * @property {Object} object - actual object to test
 * @property {ValidationError} error
 */

/**
 * @typedef {Function} WrapperFunction
 *
 * @example
 * function(innerObj) {
 *     return {
 *         mods: innerObj
 *     };
 * }
 */

/**
 * @typedef {Object} ValidationError
 *
 * @property {String} keyword
 * @property {Object.<String>} params
 * @property {*} schema
 */
