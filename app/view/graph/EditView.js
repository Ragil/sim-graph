 define(function(require) {

  var check     = require('check');
  var d3        = require('d3');
  var Backbone  = require('backbone');
  var Edge      = require('model/Edge');

  var EdgeView = Backbone.View.extend({
    model : Edge,
    initialize : function(options) {
      check(options.model).isOfType(Edge);
      check(options.svg[0])
        .each(function(val, key) { return !isNaN(parseInt(key, 10)); })
        .isOfType(SVGSVGElement);
    }
  });

  return EdgeView;
 });
