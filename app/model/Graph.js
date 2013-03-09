define(function(require) {

  var check     = require('check');
  var Backbone  = require('backbone');
  var _         = require('underscore');
  var Node      = require('model/Node');
  var Nodes     = require('model/Nodes');
  var Edge      = require('model/Edge');
  var Edges     = require('model/Edges');

  var Graph = Backbone.Model.extend({
    defaults : {
      nodes : new Nodes(),
      edges : new Edges(),
      invalidEdges : [],
      validEdges : [],
      edgeList : {}, // forward edges
      redgeList : {}, // reverse edges
      rootNodes : [], // a list of nodes without incoming edges
      directed : true,
      tree : false,
      width : 500, // width of the canvas
      height : 500 // height of the canvas
    },
    initialize : function(options) {
      check(options.nodes).isOfType(Nodes);
      check(options.edges).isOfType(Edges);

      this.set('invalidEdges', this.findInvalidEdges());
      this.set('validEdges', this.findValidEdges());
      this.generateEdgeList();
      this.set('rootNodes', this.findRootNodes());

      this.on('change:tree', this.computeTreePos, this);
    },

    // finds all edges that have known nodes as their src/dest
    findValidEdges : function() {
      var edges = this.get('edges');
      var nodes = this.get('nodes');
      return new Edges(edges.filter(function(edge) {
        return (nodes.get(edge.get('src')) ? true : false) &&
            (nodes.get(edge.get('dest')) ? true : false);
      }));
    },

    // find all edges with src or dest as an unknown node
    findInvalidEdges : function() {
      var edges = this.get('edges');
      var nodes = this.get('nodes');
      return new Edges(edges.filter(function(edge) {
        return !((nodes.get(edge.get('src')) ? true : false) &&
            (nodes.get(edge.get('dest')) ? true : false));
      }));
    },

    // converts a list of edges to an edge list and a
    // reverse edge list representation
    generateEdgeList : function() {
      var nodes = this.get('nodes');
      var edges = this.get('validEdges');
      var edgeList = this.get('edgeList');
      var redgeList = this.get('redgeList');

      // init edge list
      nodes.each(function(node) {
        edgeList[node.id] = [];
        redgeList[node.id] = [];
      });

      // convert to edge list
      edges.each(function(edge) {
          edgeList[edge.get('src').id].push(edge.get('dest').id);
          redgeList[edge.get('dest').id].push(edge.get('src').id);
      });
    },

    // searchs for nodes without incoming edges
    findRootNodes : function() {
      var nodes = this.get('nodes');
      var redgeList = this.get('redgeList');
      var rootNodes = [];

      nodes.each(function(node) {
        if (redgeList[node.id].length === 0) {
          rootNodes.push(node);
        }
      });
      return rootNodes;
    },

    // returns the maximum set of nodes at all distances
    maxTreeDimension : function(root) {
      var nodeAtDist = {};
      var queue = [];
      var visited = {};
      var edgeList = this.get('edgeList');
      queue.push({ id : root.id, dist : 0 });

      while (queue.length !== 0) {
        var node = queue.shift();
        visited[node.id] = true;

        nodeAtDist[node.dist] = nodeAtDist[node.dist] ?
            nodeAtDist[node.dist] + 1 : 1;

        _.each(edgeList[node.id], function(childId) {
          if (!visited[childId]) {
            queue.push({ id : childId, dist : node.dist + 1 });
            visited[childId] = true;
          }
        });
      }

      return {
        width : _.max(_.values(nodeAtDist)),
        height : parseInt(_.max(_.keys(nodeAtDist),
            function(key) { return parseInt(key, 10); }), 10) + 1
      };
    },

    // reset node positions so that the graph
    // is displayed as a tree.
    computeTreePos : function() {
      var rootNodes = this.get('rootNodes');
      var width = 0;
      var height = 0;
      _.each(rootNodes, function(node) {
        var dimension = maxTreeDimension(node);
        width = width + dimension.width;
        height = _.max([height, dimension.height]);
      });
    }
  });

  return Graph;
});
