define(function(require) {
  var check = require('check');
  var Graph = require('model/Graph');
  var Node  = require('model/Node');
  var Edge  = require('model/Edge');
  var ExploreOperation = require('model/ExploreOperation');

  var getExecSequence = function(graph) {
    check(graph).isOfType(Graph);

    var sequence = [];
    var visited  = {};
    var queue    = [];
    var edgeList = graph.get('edgeList');
    var nodes    = graph.get('nodes');

    sequence.push(new ExploreOperation({
      queue : queue
    }));

    // adding root nodes
    graph.get('rootNodes').each(function(node) {
      queue.push(node.id);
      sequence.push(ExploreOperation.nodeOperation(queue, node,
          Node.STATE.PENDING));
    });

    while (queue.length > 0) {
      var node = nodes.get(queue.shift());
      sequence.push(ExploreOperation.nodeOperation(queue, node,
          Node.STATE.PROCESSING));

      visited[node.id] = true;

      // process children
      _.each(edgeList[node.id], function(childId) {
        if (!visited[childId]) {

          // traverse edge
          var edge = graph.findEdge(node.id, childId);
          sequence.push(ExploreOperation.edgeOperation(queue, edge,
              Edge.STATE.TRAVERSING));

          var next = graph.get('nodes').get(childId);
          queue.push(next.id);
          sequence.push(ExploreOperation.nodeOperation(queue, next,
              Node.STATE.PENDING));

          // traversed edge
          sequence.push(ExploreOperation.edgeOperation(queue, edge,
              Edge.STATE.TRAVERSED));
        }
      }, this);

      sequence.push(ExploreOperation.nodeOperation(queue, node,
          Node.STATE.VISITED));
    }

    return sequence;
  };

  return { getExecSequence : getExecSequence };
});
