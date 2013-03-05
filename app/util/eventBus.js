/**
 * A shared event bus to co-ordinate events among different areas of the
 * application.
 */
define(function(require) {
    var _ = require('underscore');
    var Backbone = require('backbone');

    return _.clone(Backbone.Events);
});

