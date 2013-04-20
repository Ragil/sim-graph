define(function(require) {

  var BFSView = require('view/algo/BFSView');
  var Node    = require('model/Node');
  var Nodes   = require('model/Nodes');
  var Edge    = require('model/Edge');
  var Edges   = require('model/Edges');
  var Graph   = require('model/Graph');

  describe('BFSView', function() {
    var graph = null;
    var nodes = null;
    var edges = null;
    var view  = null;
    var root  = null;
    var n1    = null;
    var n2    = null;
    var n3    = null;

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

      graph = new Graph({ edges : edges, nodes : nodes });
      view = new BFSView({ model : graph });
    });

    var buildNode = function(id) {
      return new Node({id : id});
    };
    var buildEdge = function(src, dest) {
      return new Edge({src : src, dest : dest});
    };

    describe('getExecSequence', function() {
      var sequence = null;
      beforeEach(function() {
        sequence = view.getExecSequence();
      });

      var verifyNodeOperation = function(operation, expected) {
        expect(operation.get('queue')).to.eql(expected.queue);
        expect(operation.get('operand').id).to.be(expected.id);

        var prevState = operation.get('operand').get('state');
        operation.exec();
        expect(operation.get('operand').get('state')).to.be(expected.state);
        operation.undo();
        expect(operation.get('prevState')).to.be(prevState);
      };

      it('it should generate the correct sequence', function() {
        expect(sequence.length).to.be(13);
        // start of bfs
        expect(sequence.shift().get('queue')).to.eql([]);

        // add root node
        verifyNodeOperation(sequence.shift(), { queue : [ root.id ],
            id : root.id, state : Node.STATE.PENDING });

        // process root node
        verifyNodeOperation(sequence.shift(), { queue : [],
            id : root.id, state : Node.STATE.PROCESSING });

        // add nodes at height 1
        verifyNodeOperation(sequence.shift(), { queue : [ n1.id ],
            id : n1.id, state : Node.STATE.PENDING });
        verifyNodeOperation(sequence.shift(), { queue : [ n1.id, n2.id ],
            id : n2.id, state : Node.STATE.PENDING });

        // visited root node
        verifyNodeOperation(sequence.shift(), { queue : [ n1.id, n2.id],
            id : root.id, state : Node.STATE.VISITED });

        // process n1
        verifyNodeOperation(sequence.shift(), { queue : [ n2.id ],
            id : n1.id, state : Node.STATE.PROCESSING });

        // visited n1
        verifyNodeOperation(sequence.shift(), { queue : [ n2.id ],
            id : n1.id, state : Node.STATE.VISITED });

        // process n2
        verifyNodeOperation(sequence.shift(), { queue : [],
            id : n2.id, state : Node.STATE.PROCESSING });

        // add nodes at height 2
        verifyNodeOperation(sequence.shift(), { queue : [ n3.id ],
            id : n3.id, state : Node.STATE.PENDING });

        // visited n2
        verifyNodeOperation(sequence.shift(), { queue : [ n3.id ],
            id : n2.id, state : Node.STATE.VISITED });

        // process n3
        verifyNodeOperation(sequence.shift(), { queue : [],
            id : n3.id, state : Node.STATE.PROCESSING });

        // visited n3
        verifyNodeOperation(sequence.shift(), { queue : [],
            id : n3.id, state : Node.STATE.VISITED });
      });
    });
  });

});
