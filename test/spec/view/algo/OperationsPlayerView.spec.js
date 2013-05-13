define(function(require) {
  var OperationsPlayerView = require('view/algo/OperationsPlayerView');
  var OperationsLoggerView = require('view/algo/OperationsLoggerView');
  var Operations = require('model/Operations');
  var Operation = require('model/Operation');
  var Backbone = require('backbone');

  describe('OperationsPlayerView', function() {
    var sandbox = null;

    var view = null;
    var logView = null;
    var model = null;
    var operations = null;
    var execSeq = null;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();

      execSeq = [];
      operations = new Operations([buildOperation(execSeq, '1'),
                    buildOperation(execSeq, '2'),
                    buildOperation(execSeq, '3')]);

      logView = new OperationsLoggerView();
      sandbox.spy(logView, 'addEntry');

      view = new OperationsPlayerView({ model : operations, noDelay : true,
          logView : logView });
    });

    var buildOperation = function(sequence, id) {
      var operand = {
        exec : function() { sequence.push(id); },
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
        expect(execSeq.length).to.be(3);
        expect(execSeq[0]).to.be('1');
        expect(execSeq[1]).to.be('2');
        expect(execSeq[2]).to.be('3');
      });

      it('should append views in order', function() {
        var log = view.$el.find('.log').children('div');
        expect(logView.addEntry.callCount).to.be(3);
      });
    });

    describe('replay', function() {
      it('should exec/undo approriate operations', function() {
        view.replay(0, 1);
        expect(execSeq.length).to.be(1);
        expect(execSeq[0]).to.be('1');

        view.replay(1, 2);
        expect(execSeq.length).to.be(2);
        expect(execSeq[0]).to.be('1');
        expect(execSeq[1]).to.be('2');

        view.replay(2, 1);
        expect(execSeq.length).to.be(1);
        expect(execSeq[0]).to.be('1');

        view.replay(1, 2);
        view.replay(2, 0);
        expect(execSeq.length).to.be(0);
      });
    });
  });
});
