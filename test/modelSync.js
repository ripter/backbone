/*global Backbone, module, test, ok, equal */
(function() {

  var proxy = Backbone.Model.extend();
  var doc;

  module('Backbone.Model with Sync', {
    setup: function() {
      doc = new proxy({
        id     : '1-the-tempest',
        title  : "The Tempest",
        author : "Bill Shakespeare",
        length : 123
      });

    }
  });

  test("save", 2, function() {
    doc.url = '/test';
    doc.save({title : "Henry V"});
    equal(this.syncArgs.method, 'update');
    ok(_.isEqual(this.syncArgs.model, doc));
  });

  test("save within change event", 1, function () {
    var env = this;
    var model = new Backbone.Model({firstName : "Taylor", lastName: "Swift"});
    model.url = '/test';
    model.on('change', function () {
      model.save();
      ok(_.isEqual(env.syncArgs.model, model));
    });
    model.set({lastName: 'Hicks'});
  });

  test("save with PATCH", function() {
    doc.url = '/test';
    doc.clear().set({id: 1, a: 1, b: 2, c: 3, d: 4});
    doc.save();
    equal(this.syncArgs.method, 'update');
    equal(this.syncArgs.options.attrs, undefined);

    doc.save({b: 2, d: 4}, {patch: true});
    equal(this.syncArgs.method, 'patch');
    equal(_.size(this.syncArgs.options.attrs), 2);
    equal(this.syncArgs.options.attrs.d, 4);
    equal(this.syncArgs.options.attrs.a, undefined);
    equal(this.ajaxSettings.data, "{\"b\":2,\"d\":4}");
  });

  test("fetch", 2, function() {
    doc.url = '/test';
    doc.fetch();
    equal(this.syncArgs.method, 'read');
    ok(_.isEqual(this.syncArgs.model, doc));
  });

  test("destroy", 3, function() {
    doc.url = '/test';
    doc.destroy();
    equal(this.syncArgs.method, 'delete');
    ok(_.isEqual(this.syncArgs.model, doc));

    var newModel = new Backbone.Model;
    equal(newModel.destroy(), false);
  });

  test("save with `wait` succeeds without `validate`", 1, function() {
    var model = new Backbone.Model();
    model.url = '/test';
    model.save({x: 1}, {wait: true});
    ok(this.syncArgs.model === model);
  });

  test("`save` with `wait` sends correct attributes", 5, function() {
    var changed = 0;
    var model = new Backbone.Model({x: 1, y: 2});
    model.url = '/test';
    model.on('change:x', function() { changed++; });
    model.save({x: 3}, {wait: true});
    deepEqual(JSON.parse(this.ajaxSettings.data), {x: 3, y: 2});
    equal(model.get('x'), 1);
    equal(changed, 0);
    this.syncArgs.options.success({});
    equal(model.get('x'), 3);
    equal(changed, 1);
  });

  test("a failed `save` with `wait` doesn't leave attributes behind", 1, function() {
    var model = new Backbone.Model;
    model.url = '/test';
    model.save({x: 1}, {wait: true});
    equal(model.get('x'), void 0);
  });

  test("save with wait validates attributes", function() {
    var model = new Backbone.Model();
    model.url = '/test';
    model.validate = function() { ok(true); };
    model.save({x: 1}, {wait: true});
  });

  test("toJSON receives attrs during save(..., {wait: true})", 1, function() {
    var Model = Backbone.Model.extend({
      url: '/test',
      toJSON: function() {
        strictEqual(this.attributes.x, 1);
        return _.clone(this.attributes);
      }
    });
    var model = new Model;
    model.save({x: 1}, {wait: true});
  });


})();