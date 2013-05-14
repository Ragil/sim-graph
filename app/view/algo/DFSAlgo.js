define(function(require) {
  var check = require('check');
  var Graph = require('model/Graph');
  var Node  = require('model/Node');
  var Edge  = require('model/Edge');
  var ExploreOperation = require('model/ExploreOperation');

  var MODE = {
    PREORDER : 1,
    POSTORDER : 2
  };

  var _dfs = function(curNode, nodes, edgeList, stack, sequence,
      graph, visited, mode) {

    // start processing curNode
    visited[curNode.id] = true;
    sequence.push(ExploreOperation.nodeOperation(stack, curNode,
        Node.STATE.PROCESSING));

    if (mode === MODE.PREORDER) {
      stack.pop();
      // visited node
      sequence.push(ExploreOperation.nodeOperation(stack, curNode,
          Node.STATE.VISITED));
    }

    var children = edgeList[curNode.id];
    for (var i = 0; i < children.length; i++) {
      // traverse edge
      var edge = graph.findEdge(curNode.id, children[i]);
      sequence.push(ExploreOperation.edgeOperation(stack, edge,
          Edge.STATE.TRAVERSING));

      // recurse to child
      var child = nodes.get(edge.get('dest').id);
      if (!visited[child.id]) {
        stack.push(child.id);
        sequence.push(ExploreOperation.nodeOperation(stack, child,
            Node.STATE.PENDING));
        _dfs(child, nodes, edgeList, stack, sequence, graph, visited, mode);
      }

      // traversed edge
      sequence.push(ExploreOperation.edgeOperation(stack, edge,
          Edge.STATE.TRAVERSED));
    }

    if (mode === MODE.POSTORDER) {
      stack.pop();
      // visited node
      sequence.push(ExploreOperation.nodeOperation(stack, curNode,
          Node.STATE.VISITED));
    }
  };

  var getExecSequence = function(graph, mode) {
    check(graph).isOfType(Graph);
    check(mode).isNumber();

    var sequence  = [];
    var visited   = {};
    var stack     = [];
    var edgeList  = graph.get('edgeList');
    var nodes     = graph.get('nodes');

    sequence.push(new ExploreOperation({
      stack : stack
    }));

    // adding root nodes
    graph.get('rootNodes').each(function(node) {
      stack.push(node.id);
      sequence.push(ExploreOperation.nodeOperation(stack, node,
          Node.STATE.PENDING));
      _dfs(node, nodes, edgeList, stack, sequence, graph, visited, mode);
      stack.pop();
    });

    return sequence;
  };

  return {
    getExecSequence : getExecSequence,
    MODE : MODE
  };
});
