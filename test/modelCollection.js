/*global Backbone, module, test, asyncTest, ok, strictEqual, equal */
(function() {

  var proxy = Backbone.Model.extend();
  var klass, doc, collection;
  klass = Backbone.Collection.extend({
    url : function() { return '/collection'; }
  });

  module('Backbone.Model with Collection', {

    setup: function() {
      doc = new proxy({
        id     : '1-the-tempest',
        title  : "The Tempest",
        author : "Bill Shakespeare",
        length : 123
      });

      collection = new klass();
      collection.add(doc);
    }
  });

  test("initialize with Collection", function() {
    var Model = Backbone.Model.extend({
      initialize: function() {
        this.one = 1;
        equal(this.collection, collection);
      }
    });
    var model = new Model({}, {collection: collection});
    equal(model.one, 1);
    equal(model.collection, collection);
  });

  test("url", function() {
    doc.urlRoot = null;
    equal(doc.url(), '/collection/1-the-tempest');
    doc.collection.url = '/collection/';
    equal(doc.url(), '/collection/1-the-tempest');
    doc.collection = null;
    raises(function() { doc.url(); });
    doc.collection = collection;
  });
})();