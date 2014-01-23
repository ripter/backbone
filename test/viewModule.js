/*global Backbone, module, test, ok */
(function() {

  module("Backbone.View", {
  });

  test( 'Backbone.$ exists', function() {
    ok(typeof Backbone.$ !== 'undefined');
  });

  test('Backbone.Events exists', function() {
    ok(typeof Backbone.Events !== 'undefined');
  });

  test('Backbone.View.extend exists', function() {
    ok(typeof Backbone.View.extend === 'function');
  });
})();