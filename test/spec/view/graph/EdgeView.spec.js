define(function(require) {

  var Node      = require('model/Node');
  var Edge      = require('model/Edge');
  var EdgeView  = require('view/graph/EdgeView');

  describe('EdgeView', function() {
    var view = null;
    var edge = null;
    var src  = null;
    var dest = null;
    var $svg = null;

    beforeEach(function() {
      src  = new Node({ id : 'src',
          left : 0, top : 0, radius : 10});
      dest = new Node({ id : 'dest',
          left : 100, top : 100, radius :  10});
      edge = new Edge({ src : src, dest : dest });
      $svg = $('<div/>');
      view = new EdgeView({ model : edge,
          svg : d3.select($svg[0]).append('svg') });
    });

    afterEach(function() {
      view.remove();
    });

    describe('render', function() {
      beforeEach(function() {
        view.render();
      });

      it('should set pos for src', function() {
        expect($svg.find('line').attr('x1')).to.be('7.0710678118654755');
        expect($svg.find('line').attr('y1')).to.be('7.0710678118654755');
      });

      it('should set pos for dest', function() {
        expect($svg.find('line').attr('x2')).to.be('92.92893218813452');
        expect($svg.find('line').attr('y2')).to.be('92.92893218813452');
      });
    });
  });

});
