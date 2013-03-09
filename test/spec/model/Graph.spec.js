define(function(require) {

  var _     = require('underscore');
  var Graph = require('model/Graph');
  var Node  = require('model/Node');
  var Nodes = require('model/Nodes');
  var Edge  = require('model/Edge');
  var Edges = require('model/Edges');

  describe('Graph', function() {

    var graph         = null;
    var validEdges    = null;
    var invalidEdges  = null;
    var rootA         = null;
    var nodeB         = null;
    var nodeC         = null;
    var root1         = null;
    var node2         = null;

    beforeEach(function() {
      // nodes
      rootA = buildNode('A');
      nodeB = buildNode('B');
      nodeC = buildNode('C');
      root1 = buildNode('1');
      node2 = buildNode('2');

      // collection
      var nodes = new Nodes([rootA, nodeB, nodeC, root1, node2]);

      // edges
      validEdges = [
        buildEdge(rootA, nodeB),
        buildEdge(rootA, nodeC),
        buildEdge(root1, node2)
      ];

      // invalid edges
      invalidEdges = [
        buildEdge(buildNode('a'), buildNode('B')),
        buildEdge(buildNode('A'), buildNode('b')),
        buildEdge(buildNode('a'), buildNode('b'))
      ];

      // collection
      var edges = new Edges(validEdges.concat(invalidEdges));

      graph = new Graph({
        nodes : nodes,
        edges : edges
      });
    });

    var buildNode = function(id) {
      return new Node({ id : id });
    };
    var buildEdge = function(src, dest) {
      return new Edge({ src : src, dest : dest });
    };

    describe('findValidEdges', function() {
      it('should filter valid edges', function() {
        var edges = graph.get('validEdges');
        expect(edges.length).to.be(3);
        for (var i = 0; i < edges.length; i++) {
          expect(_.indexOf(validEdges, edges.at(i))).not.to.be(-1);
        }
      });
    });

    describe('findInvalidEdges', function() {
      it('should filter invalid edges', function() {
        var edges = graph.get('invalidEdges');
        expect(edges.length).to.be(3);
        for (var i = 0; i < edges.length; i++) {
          expect(_.indexOf(invalidEdges, edges.at(i))).not.to.be(-1);
        }
      });
    });

    describe('generateEdgeList', function() {
      it('should generate reverse edges', function() {
        var edgeList = graph.get('redgeList');
        expect(_.keys(edgeList).length).to.be(5);

        // root nodes
        expect(edgeList[rootA.id].length).to.be(0);
        expect(edgeList[root1.id].length).to.be(0);

        // child nodes
        expect(edgeList[nodeB.id].length).to.be(1);
        expect(edgeList[nodeB.id][0]).to.be(rootA.id);
        expect(edgeList[nodeC.id].length).to.be(1);
        expect(edgeList[nodeC.id][0]).to.be(rootA.id);
        expect(edgeList[node2.id].length).to.be(1);
        expect(edgeList[node2.id][0]).to.be(root1.id);
      });

      it('should generate forward edges', function() {
        var edgeList = graph.get('edgeList');
        expect(_.keys(edgeList).length).to.be(5);

        // root nodes
        expect(edgeList[rootA.id].length).to.be(2);
        for (var i = 0; i < 2; i++) {
          expect(_.indexOf([nodeB.id, nodeC.id],
              edgeList[rootA.id][i])).not.to.be(-1);
        }
        expect(edgeList[root1.id].length).to.be(1);
        expect(edgeList[root1.id][0]).to.be(node2.id);
      });
    });

    describe('findRootNodes', function() {
      it('should find all root nodes', function() {
        var rootNodes = graph.get('rootNodes');
        expect(rootNodes.length).to.be(2);
        expect(_.indexOf(rootNodes, rootA)).not.to.be(-1);
        expect(_.indexOf(rootNodes, root1)).not.to.be(-1);
      });
    });

    describe('maxTreeDimension', function() {
      it('should return the node count at the distance' +
          ' that has the maximum number of nodes as width', function() {
        expect(graph.maxTreeDimension(rootA).width).to.be(2);
        expect(graph.maxTreeDimension(rootA).height).to.be(2);
        expect(graph.maxTreeDimension(root1).width).to.be(1);
        expect(graph.maxTreeDimension(root1).height).to.be(2);
      });
    });

  });

});
