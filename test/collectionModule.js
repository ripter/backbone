/*global Backbone, module, test, ok */
(function() {

  module("Backbone.Collection", {
  });

  test('Backbone.Events exists', function() {
    ok(typeof Backbone.Events !== 'undefined');
  });

  test('Backbone.Model exists', function() {
    ok(typeof Backbone.Model !== 'undefined');
  });
})();