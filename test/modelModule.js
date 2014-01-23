
/*global Backbone, module, test, ok */
(function() {

  module("Backbone.Model", {
  });

  test('Backbone.Events exists', function() {
    ok(typeof Backbone.Events !== 'undefined');
  });

  test('Backbone.Model.extend exists', function() {
    ok(typeof Backbone.Model.extend === 'function');
  });
})();