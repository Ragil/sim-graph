define(function(require) {

  var Backbone = require('backbone');
  var check = require('check');
  var _ = require('underscore');
  var OperationsLoggerView = require('./OperationsLoggerView');
  var Operations = require('model/Operations');

  var STATE = {
    PLAY : 1,
    STOP : 2
  };

  // playback speed 0.5 seconds for each operation
  var PLAYBACK_SPEED = 500;

  var OperationsPlayerView = Backbone.View.extend({
    tagName : 'div',
    className : 'operationsPlayerView',
    initialize : function(options) {
      check(options.model).isOfType(Operations);
      check(options.logView).isOfType(OperationsLoggerView);

      if (options.noDelay) {
        check(options.noDelay).isBoolean();
        this.noDelay = options.noDelay;
      }

      this.logView = options.logView;
      this.$el.append(this.logView.$el);

      this.state = STATE.STOP;
      this.nextIndex = 0;
    },

    // undo all operations with index [from, to]
    undo : function(from, to) {
      for (var i = from; i >= to; i--) {
        this.model.at(i).undo();
      }
    },

    // Execute all operations with index [from, to]
    exec : function(from, to) {
      for (var i = from; i <= to; i++) {
        this.model.at(i).exec();
      }
    },

    // executes operands in [from, to)
    replay : function(from, to) {
      if (to > from) {
        this.exec(from, to - 1);
      } if (to < from) {
        this.undo(from - 1, to);
      }
    },

    appendToLog : function(index) {
      var $el = this.model.at(index).get('view').$el;
      this.logView.addEntry(index, $el, {
        onClick : _.bind(function() {
          this.replay(this.nextIndex, index + 1);
          this.nextIndex = index + 1;
          this.logView.highlight(index);
        }, this)
      });
    },

    play : function() {
      if (this.state !== STATE.PLAY) {
        this.state = STATE.PLAY;

        var next = null;
        var setupNext = null;

        next = _.bind(function() {
          if (this.state === STATE.PLAY) {
            this.exec(this.nextIndex, this.nextIndex);
            this.appendToLog(this.nextIndex);

            this.nextIndex++;

            if (this.nextIndex < this.model.length) {
              setupNext();
            }
          }
        }, this);

        setupNext = _.bind(function() {
          if (this.noDelay) {
            next();
          } else {
            setTimeout(next, PLAYBACK_SPEED);
          }
        }, this);

        setupNext();
      }
    }
  }, {
    get : function(operations) {
      return new OperationsPlayerView({
        model : operations,
        logView : OperationsLoggerView.get()
      });
    }
  });

  return OperationsPlayerView;
});
