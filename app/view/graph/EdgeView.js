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

      options.svg.append("svg:defs")
        .append("svg:marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 10)
        .attr("refY", 5)
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", 8)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z");

      this.line = options.svg.append('line');

      this.model.on('change', this.render, this);
      this.render();
    },

    render : function() {
      var src = this.model.get('src');
      var dest = this.model.get('dest');

      var x1 = src.get('left');
      var y1 = src.get('top');
      var x2 = dest.get('left');
      var y2 = dest.get('top');

      var dx = Math.abs(x1 - x2);
      var dy = Math.abs(y1 - y2);
      var dist = Math.sqrt(dx * dx + dy * dy);

      var srcRatio = src.get('radius') / dist;
      var destRatio = dest.get('radius') / dist;

      var x1Pos =  x1 + (x2 - x1) * srcRatio;
      var y1Pos =  y1 + (y2 - y1) * srcRatio;

      var x2Pos =  x2 + (x1 - x2) * destRatio;
      var y2Pos =  y2 + (y1 - y2) * destRatio;

      this.line
        .attr('id', this.model.id)
        .attr('class', 'edge')
        .attr('x1', x1Pos)
        .attr('y1', y1Pos)
        .attr('x2', x2Pos)
        .attr('y2', y2Pos)
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)');
    }
  });

  return EdgeView;
 });
