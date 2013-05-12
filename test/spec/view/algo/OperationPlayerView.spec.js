define(function(require) {
  var OperationPlayerView = require('view/algo/OperationPlayerView');
  var Operations = require('model/Operations');
  var Operation = require('model/Operation');
  var Backbone = require('backbone');

  describe('OperationPlayerView', function() {
    var view = null;
    var model = null;
    var operations = null;
    var executionSequence = null;

    beforeEach(function() {
      executionSequence = [];
      operations = new Operations([buildOperation(executionSequence, '1'),
                    buildOperation(executionSequence, '2'),
                    buildOperation(executionSequence, '3')]);

      view = new OperationPlayerView({ model : operations, noDelay : true });
    });

    var buildOperation = function(sequence, id) {
      var operand = {
        exec : function() {
          sequence.push(id); },
        undo : function() { sequence.pop(); }
      };
      var view = new (Backbone.View.extend({
        initialize : function() {
          this.$el.attr('id', id);
        }
      }))();
      return new Operation({
        operand : operand,
        view : view
      });
    };

    describe('play', function() {
      beforeEach(function() {
        view.play();
      });
      it('should execute operands in order', function() {
        expect(executionSequence.length).to.be(3);
        expect(executionSequence[0]).to.be('1');
        expect(executionSequence[1]).to.be('2');
        expect(executionSequence[2]).to.be('3');
      });

      it('should append views in order', function() {
        var log = view.$el.find('.log').children('div');
        expect(log.length).to.be(3);
        expect($(log[0]).prop('id')).to.be('1');
        expect($(log[1]).prop('id')).to.be('2');
        expect($(log[2]).prop('id')).to.be('3');
      });
    });
  });
});
