define(function(require) {

  var ExplorationView = require('view/algo/ExplorationView');
  var ExploreOperations = require('model/ExploreOperations');
  var ExploreOperation = require('model/ExploreOperation');
  var Node    = require('model/Node');
  var Nodes   = require('model/Nodes');
  var Edge    = require('model/Edge');
  var Edges   = require('model/Edges');
  var Graph   = require('model/Graph');

  describe('ExplorationView', function() {
    var graph = null;
    var nodes = null;
    var edges = null;
    var view  = null;
    var root  = null;
    var n1    = null;
    var n2    = null;
    var n3    = null;
    var sequence = null;

    beforeEach(function() {
      root = buildNode('root');
      n1 = buildNode('1');
      n2 = buildNode('2');
      n3 = buildNode('3');
      nodes = new Nodes([root, n1, n2, n3]);
      edges = new Edges([
        buildEdge(root, n1),
        buildEdge(root, n2),
        buildEdge(n2, n3)
      ]);

      sequence = new ExploreOperations([buildExploreOperation(edges.at(0))]);
      graph = new Graph({ edges : edges, nodes : nodes });
      view = new ExplorationView({ model : graph, sequence : sequence });
    });

    var buildNode = function(id) {
      return new Node({id : id});
    };
    var buildEdge = function(src, dest) {
      return new Edge({src : src, dest : dest});
    };
    var buildExploreOperation = function(edge) {
      return ExploreOperation.edgeOperation([], edge, Edge.STATE.TRAVERSED);
    };

    describe('generateOperations', function() {
      it('should convert sequence operation', function() {
        expect(view.generateOperations(sequence).length).to.be(1);
      });
    });

  });

});
