/*global Backbone, module, test, ok */
(function() {
  var view;

  module("Backbone.View", {
    setup: function() {
      view = new Backbone.View({
        id        : 'test-view',
        className : 'test-view',
        other     : 'non-special-option'
      });
    }

  });

  test( 'Backbone.$ exists', function() {
    ok(typeof Backbone.$ !== 'undefined');
  });
  test('Backbone.Events exists', function() {
    ok(typeof Backbone.Events !== 'undefined');
  });
})();