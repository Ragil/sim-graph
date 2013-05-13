define(function(require) {
  var ExploreOperation = require('./ExploreOperation');
  var check = require('check');
  var Backbone = require('backbone');

  var ExploreOperations = Backbone.Collection.extend({
    model : ExploreOperation,
    initialize : function(models, options) {
      check(models).each().isOfType(ExploreOperation);
    }
  });

  return ExploreOperations;
});
