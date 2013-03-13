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
      directed : true,
      tree : true,
      width : 600, // width of the canvas
      height : 600 // height of the canvas
    },
    initialize : function(options) {
      check(options.nodes).isOfType(Nodes);
      check(options.edges).isOfType(Edges);

      this.set({
        invalidEdges : [],
        validEdges : [],
        edgeList : {}, // forward edges
        redgeList : {}, // reverse edges
        rootNodes : [] // a list of nodes without incoming edges
      });

      this.set('invalidEdges', this.findInvalidEdges());
      this.set('validEdges', this.findValidEdges());
      this.generateEdgeList();
      this.set('rootNodes', this.findRootNodes());

      this.on('change:tree', this.computeGraphPos, this);
      this.computeGraphPos();
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
    getTreeDimension : function(root) {
      var keyFn = function(args) {
        return args.dist;
      };
      var valFn = function(args) {
        return args.prev ? args.prev + 1 : 1;
      };
      var nodeAtDist = this.bfs(root, keyFn, valFn);

      return {
        width : _.max(_.values(nodeAtDist)),
        height : parseInt(_.max(_.keys(nodeAtDist),
            function(key) { return parseInt(key, 10); }), 10) + 1
      };
    },

    // performs a bfs and returns a map for each node that is visited
    // as (key : keyFn({ node, dist }), value : valFn({ node, dist }))
    bfs : function(root, keyFn, valFn) {
      var output = {};
      var queue = [];
      var visited = [];
      var edgeList = this.get('edgeList');
      var nodes = this.get('nodes');
      queue.push({ node : root, dist : 0 });

      while (queue.length !== 0) {
        var next = queue.shift();
        visited[next.node.id] = true;

        var key = keyFn(next);
        output[key] = valFn({
          prev : output[key],
          node : next.node,
          dist : next.dist
        });

        _.each(edgeList[next.node.id], function(adjId) {
          if (!visited[adjId]) {
            queue.push({ node : nodes.get(adjId), dist : next.dist + 1 });
            visited[adjId] = true;
          }
        });
      }

      return output;
    },

    // reset node positions for a tree.
    computeTreePos : function(root, width, height) {
      var keyFn = function(arg) {
        return arg.dist;
      };
      var valFn = function(arg) {
        if (arg.prev) {
          arg.prev.push(arg.node);
          return arg.prev;
        }
        return [arg.node];
      };
      var distToNodes = this.bfs(root, keyFn, valFn);
      var treeHeight = parseInt(_.max(_.keys(distToNodes),
          function(key) { return parseInt(key, 10); }), 10) +1;
      var rowHeight = height / treeHeight;
      var radius = Math.max(height, width);

      // change node positions
      _.each(distToNodes, function(nodeArr, dist) {
        dist = parseInt(dist, 10);

        // radius = Math.min(width / nodecount, height / treeheight) * 0.8 / 2
        radius = Math.min(width / nodeArr.length * 0.8 / 2);
        radius = Math.min(radius, rowHeight * 0.8 / 2);

        _.each(nodeArr, function(node, index) {
          node.set({
            top : rowHeight * (dist + 0.5),
            left : (width / nodeArr.length) * (index + 0.5)
          }, { silent : true });
        });
      });

      // set the radius
      _.each(distToNodes, function(nodeArr, dist) {
        _.each(nodeArr, function(node, index) {
          node.set({ radius : radius });
        });
      });
    },

    // reset node positions so that the graph
    // is displayed as a tree.
    computeGraphPosAsTree : function() {
      var rootNodes = this.get('rootNodes');
      var dimensions = {};
      var totalWidth = 0;
      var maxHeight = 0;
      var svgWidth = this.get('width');
      var svgHeight = this.get('height');

      // compute the dimensions
      _.each(rootNodes, _.bind(function(node) {
        var dimension = this.getTreeDimension(node);
        totalWidth = totalWidth + dimension.width;
        maxHeight = _.max([maxHeight, dimension.height]);
        dimensions[node.id] = dimension;
      }, this));

      // assign max width for each node
      var marginLeft = 0;
      _.each(rootNodes, _.bind(function(node, index) {
        var svgTreeWidth = svgWidth * (dimensions[node.id].width / totalWidth);
        var svgTreeHeight = svgHeight *
            (dimensions[node.id].height / maxHeight);

        this.computeTreePos(node, svgTreeWidth, svgTreeHeight);
        this.bfs(node, function(arg) { return arg.node.id; }, function(arg) {
          arg.node.set({ left : arg.node.get('left') + marginLeft });
          return arg.node;
        });

        marginLeft = marginLeft + svgTreeWidth;
      }, this));
    },

    // reposition nodes based on the type of graph that we expect
    computeGraphPos : function() {
      if (this.get('tree')) {
        this.computeGraphPosAsTree();
      }
    }
  });

  return Graph;
});
