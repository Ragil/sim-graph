/**
 * Test for MainView.js
 */
define(function(require) {

    require('sinon');
    var check = require('check');
    var Backbone = require('backbone');
    var MainView = require('view/MainView');

    var TestView = Backbone.View.extend({
        initialize : function(options) {
            check(options).isObject();
        },

        remove : function() {
            this.$el.remove();
        }
    });

    describe('MainView', function() {

        beforeEach(function() {
            $('body').append('<div class="mainView"></div>');
        });

        afterEach(function() {
            $('.mainView').remove();
        });

        describe('setLayout', function() {

            it('should set the current view and call render', function() {
                // create a backbone view and mainview
                var view = new TestView();
                var mainView = new MainView();

                // spy on render
                var spy = sinon.stub(view, 'render');

                // trigger
                mainView.setLayout(view);

                // verify
                expect(spy.callCount).to.be(1);
                expect(mainView.$el.children().html()).to.be(view.$el.html());

                // clean up
                spy.restore();
                mainView.remove();
                view.remove();
            });

            it('should not switch out view if already shown', function() {
                // create a backbone view and mainview
                var view = new TestView();
                var mainView = new MainView();

                // spy on render
                var spy = sinon.stub(view, 'render');

                // trigger
                mainView.setLayout(view);

                // verify
                expect(spy.callCount).to.be(1);
                expect(mainView.$el.children().html()).to.be(view.$el.html());

                // call it a second time
                spy.reset();
                mainView.setLayout(view);

                // verify
                expect(spy.callCount).to.be(0);
                expect(mainView.$el.children().html()).to.be(view.$el.html());

                // clean up
                spy.restore();
                mainView.remove();
                view.remove();
            });

        });

    });

});
