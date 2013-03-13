/**
 * Responsible for handling the current layout that is seen by the user
 */
define(function(require) {

  var eventBus = require('eventBus');
  var Backbone = require('backbone');

  var MainView = Backbone.View.extend({

    initialize : function() {
      this.$el = $('body').find('.mainView');
      eventBus.on('setLayout', this.setLayout, this);
    },

    setLayout : function(view) {
      if (this.currentView !== view) {

         this.$el.children().detach();
         this.$el.append(view.$el);
         view.render();

         this.currentView = view;
      }
    }
  });

  return MainView;
});

