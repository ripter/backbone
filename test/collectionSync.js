/*global Backbone, module, test, asyncTest, ok, strictEqual */
(function() {

  module('Backbone.Collection with Sync');

  test("#1412 - Trigger 'request' and 'sync' events.", 4, function() {
    var collection = new Backbone.Collection;
    collection.url = '/test';
    Backbone.ajax = function(settings){ settings.success(); };

    collection.on('request', function(obj, xhr, options) {
      ok(obj === collection, "collection has correct 'request' event after fetching");
    });
    collection.on('sync', function(obj, response, options) {
      ok(obj === collection, "collection has correct 'sync' event after fetching");
    });
    collection.fetch();
    collection.off();

    collection.on('request', function(obj, xhr, options) {
      ok(obj === collection.get(1), "collection has correct 'request' event after one of its models save");
    });
    collection.on('sync', function(obj, response, options) {
      ok(obj === collection.get(1), "collection has correct 'sync' event after one of its models save");
    });
    collection.create({id: 1});
    collection.off();
  });

  test("fetch parses models by default", 1, function() {
    var model = {};
    var Collection = Backbone.Collection.extend({
      url: 'test',
      model: Backbone.Model.extend({
        parse: function(resp) {
          strictEqual(resp, model);
        }
      })
    });
    new Collection().fetch();
    this.ajaxSettings.success([model]);
  });

  asyncTest("#1939 - `parse` is passed `options`", 1, function () {
    var collection = new (Backbone.Collection.extend({
      url: '/',
      parse: function (data, options) {
        strictEqual(options.xhr.someHeader, 'headerValue');
        return data;
      }
    }));
    var ajax = Backbone.ajax;
    Backbone.ajax = function (params) {
      _.defer(params.success);
      return {someHeader: 'headerValue'};
    };
    collection.fetch({
      success: function () { start(); }
    });
    Backbone.ajax = ajax;
  });

  test("#2606 - Collection#create, success arguments", 1, function() {
    var collection = new Backbone.Collection;
    collection.url = 'test';
    collection.create({}, {
      success: function(model, resp, options) {
        strictEqual(resp, 'response');
      }
    });
    this.ajaxSettings.success('response');
  });

  test("fetch", 4, function() {
    var collection = new Backbone.Collection;
    collection.url = '/test';
    collection.fetch();
    equal(this.syncArgs.method, 'read');
    equal(this.syncArgs.model, collection);
    equal(this.syncArgs.options.parse, true);

    collection.fetch({parse: false});
    equal(this.syncArgs.options.parse, false);
  });

  test("ensure fetch only parses once", 1, function() {
    var collection = new Backbone.Collection;
    var counter = 0;
    collection.parse = function(models) {
      counter++;
      return models;
    };
    collection.url = '/test';
    collection.fetch();
    this.syncArgs.options.success();
    equal(counter, 1);
  });

  test("create", 4, function() {
    var collection = new Backbone.Collection;
    collection.url = '/test';
    var model = collection.create({label: 'f'}, {wait: true});
    equal(this.syncArgs.method, 'create');
    equal(this.syncArgs.model, model);
    equal(model.get('label'), 'f');
    equal(model.collection, collection);
  });

  test("#714: access `model.collection` in a brand new model.", 2, function() {
    var collection = new Backbone.Collection;
    collection.url = '/test';
    var Model = Backbone.Model.extend({
      set: function(attrs) {
        equal(attrs.prop, 'value');
        equal(this.collection, collection);
        return this;
      }
    });
    collection.model = Model;
    collection.create({prop: 'value'});
  });

})();