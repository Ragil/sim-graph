define(function(require) {
  var Router = require('Router');

  $(document).ready(function() {
    describe('Router', function() {
      var router = null;

      beforeEach(function() {
        $('body').append('<div class="mainView"></div>');
        router = new Router();
      });
      afterEach(function() {
        $('.mainView').remove();
      });

      it('dfs', function() {
        router.dfs('1');
        expect(router.mainView.$el.find('.dfsView').length).to.be(1);
      });
      it('bfs', function() {
        router.bfs();
        expect(router.mainView.$el.find('.bfsView').length).to.be(1);
      });
    });
  });
});
