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
    var root_         = null;

    beforeEach(function() {
      // nodes
      root_ = buildNode('_');
      rootA = buildNode('A');
      nodeB = buildNode('B');
      nodeC = buildNode('C');
      root1 = buildNode('1');
      node2 = buildNode('2');

      // collection
      var nodes = new Nodes([root_, rootA, nodeB, nodeC, root1, node2]);

      // edges
      validEdges = [
        buildEdge(rootA, nodeB),
        buildEdge(rootA, nodeC),
        buildEdge(root1, node2),
        buildEdge(root_, nodeB),
        buildEdge(root_, nodeC),
        buildEdge(root_, node2)
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
    var expectFloat = function(actual, expected) {
      expect(actual.toFixed(8)).to.be(expected.toFixed(8));
    };

    describe('findValidEdges', function() {
      it('should filter valid edges', function() {
        var edges = graph.get('validEdges');
        expect(edges.length).to.be(6);
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
        expect(_.keys(edgeList).length).to.be(6);

        // root nodes
        expect(edgeList[rootA.id].length).to.be(0);
        expect(edgeList[root1.id].length).to.be(0);
        expect(edgeList[root_.id].length).to.be(0);

        // child nodes
        expect(edgeList[nodeB.id].length).to.be(2);
        expect(edgeList[nodeB.id][0]).to.be(rootA.id);
        expect(edgeList[nodeC.id].length).to.be(2);
        expect(edgeList[nodeC.id][0]).to.be(rootA.id);
        expect(edgeList[node2.id].length).to.be(2);
        expect(edgeList[node2.id][0]).to.be(root1.id);
      });

      it('should generate forward edges', function() {
        var edgeList = graph.get('edgeList');
        expect(_.keys(edgeList).length).to.be(6);

        // root nodes
        expect(edgeList[rootA.id].length).to.be(2);
        for (var i = 0; i < edgeList[rootA.id].length; i++) {
          expect(_.indexOf([nodeB.id, nodeC.id],
              edgeList[rootA.id][i])).not.to.be(-1);
        }

        expect(edgeList[root1.id].length).to.be(1);
        expect(edgeList[root1.id][0]).to.be(node2.id);

        expect(edgeList[root_.id].length).to.be(3);
        for (i = 0; i < edgeList[root_.id].length; i++) {
          expect(_.indexOf([nodeB.id, nodeC.id, node2.id],
              edgeList[root_.id][i])).not.to.be(-1);
        }
      });
    });

    describe('findRootNodes', function() {
      it('should find all root nodes', function() {
        var rootNodes = graph.get('rootNodes');
        expect(rootNodes.length).to.be(3);
        expect(rootNodes.indexOf(rootA)).not.to.be(-1);
        expect(rootNodes.indexOf(root1)).not.to.be(-1);
        expect(rootNodes.indexOf(root_)).not.to.be(-1);
        rootNodes.each(function(node) {
          expect(node.get('isRoot')).to.be(true);
        });
      });
    });

    describe('getTreeDimension', function() {
      it('should return the node count at the distance' +
          ' that has the maximum number of nodes as width', function() {
        expect(graph.getTreeDimension(rootA).width).to.be(2);
        expect(graph.getTreeDimension(root1).width).to.be(1);
        expect(graph.getTreeDimension(root_).width).to.be(3);
      });

      it('should return the height of the tree', function() {
        expect(graph.getTreeDimension(rootA).height).to.be(2);
        expect(graph.getTreeDimension(root1).height).to.be(2);
        expect(graph.getTreeDimension(root_).height).to.be(2);
      });
    });

    describe('computeTreePos', function() {
      var createTest = function(verifyFn, attrName) {
        describe(attrName, function() {
          it('should set ' + attrName + ' correctly for 100 * 100', function() {
            verifyFn(100, 100);
          });

          it('should set ' + attrName + ' correctly for 200 * 100', function() {
            verifyFn(200, 100);
          });

          it('should set ' + attrName + ' correctly for 150 * 400', function() {
            verifyFn(150, 400);
          });
        });
      };

      describe('width 1', function() {
        createTest(function(width, height) {
          graph.computeTreePos(root1, width, height);
          expectFloat(root1.get('left'), width / 2);
          expectFloat(node2.get('left'), width / 2);
        }, 'left');

        describe('height 2', function() {
          createTest(function(width, height) {
            graph.computeTreePos(root1, width, height);
            expectFloat(root1.get('top'), height / 4);
            expectFloat(node2.get('top'), 3 * height / 4);
          }, 'top');

          createTest(function(width, height) {
            graph.computeTreePos(root1, width, height);
            var r = Math.min(width, height / 2) * 0.8 / 2;
            expectFloat(root1.get('radius'), r);
            expectFloat(node2.get('radius'), r);
          }, 'radius');
        });
      });

      describe('width 2', function() {
        createTest(function(width, height) {
          graph.computeTreePos(rootA, width, height);
          expectFloat(rootA.get('left'), width / 2);
          expectFloat(nodeB.get('left'), width / 4);
          expectFloat(nodeC.get('left'), 3 * width / 4);
        }, 'left');

        describe('height 2', function() {
          createTest(function(width, height) {
            graph.computeTreePos(rootA, width, height);
            expectFloat(rootA.get('top'), height / 4);
            expectFloat(nodeB.get('top'), 3 * height / 4);
            expectFloat(nodeC.get('top'), 3 * height / 4);
          }, 'top');

          createTest(function(width, height) {
            graph.computeTreePos(rootA, width, height);
            var r = Math.min(width / 2, height / 2) * 0.8 / 2;
            expectFloat(rootA.get('radius'), r);
            expectFloat(nodeB.get('radius'), r);
            expectFloat(nodeC.get('radius'), r);
          }, 'radius');
        });
      });

      describe('width 3', function() {
        createTest(function(width, height) {
          graph.computeTreePos(root_, width, height);
          expectFloat(root_.get('left'), width / 2);
          expectFloat(nodeB.get('left'), width / 6);
          expectFloat(nodeC.get('left'), 3 * width / 6);
          expectFloat(node2.get('left'), 5 * width / 6);
        }, 'left');

        describe('height 2', function() {
          createTest(function(width, height) {
            graph.computeTreePos(root_, width, height);
            expectFloat(root_.get('top'), height / 4);
            expectFloat(nodeB.get('top'), 3 * height / 4);
            expectFloat(nodeC.get('top'), 3 * height / 4);
            expectFloat(node2.get('top'), 3 * height / 4);
          }, 'top');

          createTest(function(width, height) {
            graph.computeTreePos(root_, width, height);
            var r = Math.min(width / 3, height / 2) * 0.8 / 2;
            expectFloat(root_.get('radius'), r);
            expectFloat(nodeB.get('radius'), r);
            expectFloat(nodeC.get('radius'), r);
            expectFloat(node2.get('radius'), r);
          }, 'radius');
        });
      });
    });

    describe('computeGraphPosAsTree', function() {
      beforeEach(function() {
        graph.set({ width : 600, height : 600 });
        graph.computeGraphPosAsTree();
      });

      it('should not pad the left tree', function() {
        expectFloat(root_.get('left'), 150);
      });

      it('should pad the middle tree', function() {
        expectFloat(rootA.get('left'), 400);
        expectFloat(nodeB.get('left'), 350);
        expectFloat(nodeC.get('left'), 450);
      });

      it('should pad the right tree', function() {
        expectFloat(root1.get('left'), 550);
        expectFloat(node2.get('left'), 550);
      });
    });
  });

  describe('Graph', function() {
    var graph = null;
    var nodes = null;
    var root_, node1, node2, node3, node4, node5, node6;
    var validEdges = null;

    beforeEach(function() {
      // nodes
      root_ = buildNode('_');
      node1 = buildNode('A');
      node2 = buildNode('B');
      node3 = buildNode('C');
      node4 = buildNode('1');
      node5 = buildNode('2');
      node6 = buildNode('3');

      // collection
      nodes = new Nodes([root_, node1, node2, node3, node4, node5, node6]);

      // edges
      validEdges = [
        buildEdge(root_, node1),
        buildEdge(root_, node2),
        buildEdge(root_, node3),
        buildEdge(root_, node4),
        buildEdge(root_, node5),
        buildEdge(root_, node6)
      ];

      graph = new Graph({
        width : 600,
        height : 600,
        nodes : nodes,
        edges : new Edges(validEdges)
      });
    });

    var buildNode = function(id) {
      return new Node({ id : id });
    };
    var buildEdge = function(src, dest) {
      return new Edge({ src : src, dest : dest });
    };

    describe('computeGraphPosAsTree', function() {
      it('should set all node radius to 40', function() {
        graph.get('nodes').each(function(node) {
          expect(node.get('radius')).to.be(40);
        });
      });
    });
  });

  describe('Graph.randomTree', function() {
    var graph = null;
    var numNodes = 50;

    beforeEach(function() {
      graph = Graph.randomTree(numNodes);
    });

    it('should only generate 1 root node', function() {
      expect(graph.get('rootNodes').length).to.be(1);
    });

    it('should generate edges for children in the tree', function() {
      expect(graph.get('validEdges').length).to.be(numNodes - 1);
    });

    it('every node should be accessible from the root', function() {
      var parents = graph.get('rootNodes').models;
      var visited = 0;
      while (parents.length !== 0) {
        var children = [];
        visited += parents.length;

        _.each(parents, function(node) {
          // find all children accessible from this node
          graph.get('validEdges').each(function(edge) {
            if (edge.get('src').id === node.id) {
              children.push(edge.get('dest'));
            }
          });
        });

        parents = children;
      }

      expect(visited).to.be(numNodes);
    });
  });

});
