/*global Backbone, module, test, ok */
(function() {

  module("Backbone.Events");

  test( 'includes Backbone._extend', function() {
    ok(typeof Backbone._extend === 'function');
  });
})();