define(function(require) {

  var GraphView = require('view/graph/GraphView');
  var Node      = require('model/Node');
  var Nodes     = require('model/Nodes');
  var Edge      = require('model/Edge');
  var Edges     = require('model/Edges');
  var Graph     = require('model/Graph');

  describe('GraphView', function() {

    var view = null;
    var graph = null;
    var nodes = null;
    var nodeA = null;
    var nodeB = null;
    var nodeC = null;
    var edges = null;
    var edgeAB = null;
    var edgeBC = null;

    beforeEach(function() {
      nodes = new Nodes([
        nodeA = buildNode('a'),
        nodeB = buildNode('b'),
        nodeC = buildNode('c')
      ]);

      edgeAB = buildEdge(nodeA, nodeB);
      edgeBC = buildEdge(nodeB, nodeC);
      edges = new Edges([ edgeAB, edgeBC ]);

      graph = new Graph({
        nodes : nodes,
        edges : edges
      });
      view = new GraphView({ model : graph });
    });

    var buildNode = function(id) {
      return new Node({ id : id });
    };
    var buildEdge = function(src, dest) {
      return new Edge({ src : src, dest : dest });
    };

    describe('render', function() {
      beforeEach(function() {
        view.render();
      });

      it('should draw each node', function() {
        expect(view.$('#a').attr('class').indexOf('node')).to.not.be(-1);
        expect(view.$('#b').attr('class').indexOf('node')).to.not.be(-1);
        expect(view.$('#c').attr('class').indexOf('node')).to.not.be(-1);
      });

      it('should draw each edge', function() {
        expect(view.$('.edge').length).to.be(2);
        expect($(view.$('.edge')[0]).attr('id')).to.be('a->b');
        expect($(view.$('.edge')[1]).attr('id')).to.be('b->c');
      });
    });

  });

});
