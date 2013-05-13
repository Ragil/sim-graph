define(function(require) {
  var Backbone = require('backbone');
  var check = require('check');

  var OperationLoggerView = Backbone.View.extend({
    tagName : 'div',
    className : 'operationsLoggerView',
    initialize : function() {
      // id -> $entry
      this.entries = {};
    },

    highlight : function(id) {
      _.each(this.entries, function(value, id) {
        value.removeClass('selected');
      });
      this.entries[id].addClass('selected');
    },

    addEntry : function(id, $el, options) {
      // make sure we don't create duplicate entires
      if (!this.entries[id]) {
        // add a wrapper
        var $entry = $('<div id="' + id + '" class="entry clickable"></div>');
        $entry.append($el);

        // setup on click if exist
        options = options || {};
        if (options.onClick) {
          check(options.onClick).isFunction();
          $entry.click(options.onClick);
        }

        // append to dom
        this.$el.append($entry);
        this.entries[id] = $el;
      }

      this.highlight(id);
    },

    removeEntry : function(id) {
      this.entries[id].remove();
      delete this.entries[id];
    }
  }, {
    get : function() {
      return new OperationLoggerView();
    }
  });

  return OperationLoggerView;
});
