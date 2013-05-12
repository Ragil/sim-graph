define(function(require) {

  var Backbone = require('backbone');
  var check = require('check');
  var _ = require('underscore');
  var Operations = require('model/Operations');
  var template = require('text!./OperationPlayerView.html');

  var STATE = {
    PLAY : 1,
    STOP : 2
  };

  // playback speed 0.5 seconds for each operation
  var PLAYBACK_SPEED = 500;

  var OperationPlayerView = Backbone.View.extend({
    className : 'operationPlayerView',
    initialize : function(options) {
      check(options.model).isOfType(Operations);
      if (options.noDelay) {
        check(options.noDelay).isBoolean();
        this.noDelay = options.noDelay;
      }

      this.$el.html(template);
      this.$log = this.$('.log');

      this.state = STATE.STOP;
      this.currentIndex = 0;
    },

    play : function() {
      if (this.state !== STATE.PLAY) {
        this.state = STATE.PLAY;

        var next = null;
        var setupNext = null;

        next = _.bind(function() {
          if (this.state === STATE.PLAY) {
            var operation = this.model.at(this.currentIndex++);
            operation.exec();
            this.$log.append(operation.get('view').$el);

            if (this.currentIndex < this.model.length) {
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
      return new OperationPlayerView({
        model : operations
      });
    }
  });

  return OperationPlayerView;
});
