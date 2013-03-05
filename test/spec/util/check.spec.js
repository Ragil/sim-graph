/**
 * Test for check.js
 */
define(function(require) {

    var check = require('check');

    describe('check', function() {

        describe('isString', function() {

            it('should return false for 1', function() {
                expect(check(1).isString()).to.be(false);
            });

            it('should return true for "string"', function() {
                expect(check('string').isString()).to.be(true);
            });

            it('should return false for true', function() {
                expect(check(true).isString()).to.be(false);
            });

            it('should return false for []', function() {
                expect(check([]).isString()).to.be(false);
            });

            it('should return false for {}', function() {
                expect(check({}).isString()).to.be(false);
            });

            it('should return false for "function(){}"', function() {
                expect(check(function() {}).isString()).to.be(false);
            });

            it('should return false for null', function() {
                expect(check(null).isString()).to.be(false);
            });

            it('should return false for undefined', function() {
                expect(check(undefined).isString()).to.be(false);
            });

        });

        describe('isNumber', function() {

            it('should return true for 1', function() {
                expect(check(1).isNumber()).to.be(true);
            });

            it('should return true for 0', function() {
                expect(check(0).isNumber()).to.be(true);
            });

            it('should return true for parseInt("2")', function() {
                expect(check(parseInt("2", 10)).isNumber()).to.be(true);
            });

            it('should return true for parseFloat("2.3")', function() {
                expect(check(parseFloat("2.3")).isNumber()).to.be(true);
            });

            it('should return false for "string"', function() {
                expect(check('string').isNumber()).to.be(false);
            });

            it('should return false for true', function() {
                expect(check(true).isNumber()).to.be(false);
            });

            it('should return false for []', function() {
                expect(check([]).isNumber()).to.be(false);
            });

            it('should return false for {}', function() {
                expect(check({}).isNumber()).to.be(false);
            });

            it('should return false for "function(){}"', function() {
                expect(check(function() {}).isNumber()).to.be(false);
            });

            it('should return false for null', function() {
                expect(check(null).isNumber()).to.be(false);
            });

            it('should return false for undefined', function() {
                expect(check(undefined).isNumber()).to.be(false);
            });

        });

        describe('isBoolean', function() {

            it('should return false for 0', function() {
                expect(check(0).isBoolean()).to.be(false);
            });

            it('should return false for "string"', function() {
                expect(check('string').isBoolean()).to.be(false);
            });

            it('should return true for true', function() {
                expect(check(true).isBoolean()).to.be(true);
            });

            it('should return true for false', function() {
                expect(check(false).isBoolean()).to.be(true);
            });

            it('should return false for []', function() {
                expect(check([]).isBoolean()).to.be(false);
            });

            it('should return false for {}', function() {
                expect(check({}).isBoolean()).to.be(false);
            });

            it('should return false for "function(){}"', function() {
                expect(check(function() {}).isBoolean()).to.be(false);
            });

            it('should return false for null', function() {
                expect(check(null).isBoolean()).to.be(false);
            });

            it('should return false for undefined', function() {
                expect(check(undefined).isBoolean()).to.be(false);
            });

        });

        describe('isArray', function() {

            it('should return false for 0', function() {
                expect(check(0).isArray()).to.be(false);
            });

            it('should return false for "string"', function() {
                expect(check('string').isArray()).to.be(false);
            });

            it('should return false for true', function() {
                expect(check(true).isArray()).to.be(false);
            });

            it('should return true for []', function() {
                expect(check([]).isArray()).to.be(true);
            });

            it('should return false for {}', function() {
                expect(check({}).isArray()).to.be(false);
            });

            it('should return false for "function(){}"', function() {
                expect(check(function() {}).isArray()).to.be(false);
            });

            it('should return false for null', function() {
                expect(check(null).isArray()).to.be(false);
            });

            it('should return false for undefined', function() {
                expect(check(undefined).isArray()).to.be(false);
            });

        });

        describe('isObject', function() {

            it('should return false for 1', function() {
                expect(check(1).isObject()).to.be(false);
            });

            it('should return false for "string"', function() {
                expect(check('string').isObject()).to.be(false);
            });

            it('should return false for true', function() {
                expect(check(true).isObject()).to.be(false);
            });

            it('should return true for []', function() {
                expect(check([]).isObject()).to.be(true);
            });

            it('should return true for {}', function() {
                expect(check({}).isObject()).to.be(true);
            });

            it('should return true for "function(){}"', function() {
                expect(check(function() {}).isObject()).to.be(true);
            });

            it('should return false for null', function() {
                expect(check(null).isObject()).to.be(false);
            });

            it('should return false for undefined', function() {
                expect(check(undefined).isObject()).to.be(false);
            });

        });

        describe('isFunction', function() {

            it('should return false for 1', function() {
                expect(check(1).isFunction()).to.be(false);
            });

            it('should return false for "string"', function() {
                expect(check('string').isFunction()).to.be(false);
            });

            it('should return false for true', function() {
                expect(check(true).isFunction()).to.be(false);
            });

            it('should return false for []', function() {
                expect(check([]).isFunction()).to.be(false);
            });

            it('should return false for {}', function() {
                expect(check({}).isFunction()).to.be(false);
            });

            it('should return true for "function(){}"', function() {
                expect(check(function() {}).isFunction()).to.be(true);
            });

            it('should return false for null', function() {
                expect(check(null).isFunction()).to.be(false);
            });

            it('should return false for undefined', function() {
                expect(check(undefined).isFunction()).to.be(false);
            });

        });

        describe('isOfType', function() {

            var CustomType = function() {
                this.C = 'C';
                this.u = 'u';
                this.s = 's';
                this.t = 't';
                this.o = 'o';
                this.m = 'm';
                this.T = 'T';
                this.y = 'y';
                this.p = 'p';
                this.e = 'e';
                this.call = function() {
                    return 'CustomType';
                };
            };
            CustomType.prototype.F = function() {};

            it('should return false for 1', function() {
                expect(check(1).isOfType(CustomType)).to.be(false);
            });

            it('should return false for "string"', function() {
                expect(check('string').isOfType(CustomType)).to.be(false);
            });

            it('should return false for true', function() {
                expect(check(true).isOfType(CustomType)).to.be(false);
            });

            it('should return false for []', function() {
                expect(check([]).isOfType(CustomType)).to.be(false);
            });

            it('should return false for {}', function() {
                expect(check({}).isOfType(CustomType)).to.be(false);
            });

            it('should return false for "function(){}"', function() {
                expect(check(function() {}).isOfType(CustomType)).to.be(false);
            });

            it('should return true for "new CustomType()"', function() {
                expect(check(new CustomType()).isOfType(CustomType)).to
                        .be(true);
            });

            it('should return false for null', function() {
                expect(check(null).isOfType(CustomType)).to.be(false);
            });

            it('should return false for undefined', function() {
                expect(check(undefined).isOfType(CustomType)).to.be(false);
            });

        });

        describe('strict', function() {

            it('should throw exception when mismatch occurs', function() {
                expect(function() {
                    check(1).strict().isString();
                }).to.throwError();
            });

            describe('msg', function() {

                it('should support custom exception message', function() {
                    expect(function() {
                        check(1).strict().msg('custom message').isString();
                    }).to.throwError('custom message');
                });

                it('should support custom message for null', function() {
                    expect(function() {
                        check(null).strict().msg('custom message').isString();
                    }).to.throwError('custom message');
                });

                it('should support custom message for undefined', function() {
                    expect(function() {
                        check(undefined).strict().msg('custom message')
                                .isString();
                    }).to.throwError('custom message');
                });

            });

        });

    });

});
