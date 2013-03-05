/**
 * This is used to check types during runtime.
 */
define(function(require) {

    var verify = function(arg, type, options) {
        // constructor is for primitive types (Number, String...)
        // instanceof is for custom types ($...)
        if (!((arg !== undefined && arg !== null) && type && 
                (arg.constructor === type || arg instanceof type))) {
            if (options && options.strict) {
                // throw custom error message
                if (options && options.msg) {
                    throw new Error(options.msg);
                }

                throw new Error('Expected: ' + type.toString()
                        + ' Constructor : '
                        + (arg ? arg.constructor.toString() : arg) + ' Type : '
                        + (typeof arg).toString());
            }
            return false;
        }

        return true;
    };

    var check = function(arg, options) {
        options = options || {};
        return {
            isString : function() {
                return verify(arg, String, options);
            },
            isNumber : function() {
                return verify(arg, Number, options);
            },
            isBoolean : function() {
                return verify(arg, Boolean, options);
            },
            isArray : function() {
                return verify(arg, Array, options);
            },
            isObject : function() {
                return verify(arg, Object, options);
            },
            isFunction : function() {
                return verify(arg, Function, options);
            },
            isOfType : function(type) {
                return verify(arg, type, options);
            },
            strict : function() {
                options.strict = true;
                return this;
            },
            msg : function(msg) {
                options.msg = msg;
                return this;
            }
        };
    };

    return check;

});
