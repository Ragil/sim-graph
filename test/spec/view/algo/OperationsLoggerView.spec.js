define(function(require) {
  var OperationsLoggerView = require('view/algo/OperationsLoggerView');

  describe('OperationsLoggerView', function() {
    var view = null;

    beforeEach(function() {
      view = new OperationsLoggerView();
    });

    describe('addEntry', function() {
      beforeEach(function() {
        var $el = $('<div id="content"></div>');
        view.addEntry(0, $el);
      });
      it('should add an entry', function() {
        expect(view.$el.find('#content').length).to.be(1);
      });
    });
  });
});
