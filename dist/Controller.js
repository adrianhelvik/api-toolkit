'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tryCatch = Symbol('tryCatch');
var handleError = Symbol('handleError');
var createStaticRouteHandlers = Symbol('createStaticRouteHandlers');
var routeHandlerFactory = Symbol('routeHandlerFactory');
var privateModel = Symbol('model');

var Controller = function () {
  _createClass(Controller, null, [{
    key: 'model',
    get: function get() {
      /*
      if (! this[privateModel]) {
        throw Error('[Controller]: No model set. Assign the model as a static member')
      }
      */
      return this[privateModel];
    },
    set: function set(model) {
      this[privateModel] = model;
    }
  }]);

  function Controller(req, res, model) {
    _classCallCheck(this, Controller);

    this.req = req;
    this.res = res;
    this.model = model;
    this.startTime = new Date();
  }

  _createClass(Controller, [{
    key: 'create',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.model.create(this.req.body);

              case 2:
                this.res.status(201).json({
                  success: true,
                  time: new Date() - this.startTime
                });

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function create() {
        return _ref.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: 'all',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var rawWhere, where;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                rawWhere = this.req.query.where;
                where = rawWhere ? JSON.parse(rawWhere) : null;
                _context2.t0 = this.res;
                _context2.next = 5;
                return this.model.all(where);

              case 5:
                _context2.t1 = _context2.sent;
                _context2.t2 = new Date() - this.startTime;
                _context2.t3 = {
                  data: _context2.t1,
                  success: true,
                  time: _context2.t2
                };

                _context2.t0.json.call(_context2.t0, _context2.t3);

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function all() {
        return _ref2.apply(this, arguments);
      }

      return all;
    }()
  }, {
    key: 'one',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var req, res, model;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                req = this.req, res = this.res, model = this.model;
                _context3.t0 = res;
                _context3.next = 4;
                return model.one(req.params.id);

              case 4:
                _context3.t1 = _context3.sent;
                _context3.t2 = new Date() - this.startTime;
                _context3.t3 = {
                  data: _context3.t1,
                  success: true,
                  time: _context3.t2
                };

                _context3.t0.json.call(_context3.t0, _context3.t3);

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function one() {
        return _ref3.apply(this, arguments);
      }

      return one;
    }()
  }, {
    key: 'destroy',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var req, res, model, id;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                req = this.req, res = this.res, model = this.model;
                id = req.params.id;
                _context4.next = 4;
                return model.destroy(id);

              case 4:
                res.status(202).json({
                  success: true,
                  time: new Date() - this.startTime
                });

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function destroy() {
        return _ref4.apply(this, arguments);
      }

      return destroy;
    }()
  }, {
    key: 'update',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var req, res, model, id, response;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                req = this.req, res = this.res, model = this.model;
                id = req.params.id;
                _context5.next = 4;
                return model.update(id, req.body);

              case 4:
                response = _context5.sent;


                res.status(202).json({
                  success: true,
                  time: new Date() - this.startTime
                });

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function update() {
        return _ref5.apply(this, arguments);
      }

      return update;
    }()

    /**
     * @private
     */

  }, {
    key: handleError,
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(error) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                console.log('Called error handler');
                this.res.status(error.httpStatusCode || 500).json({
                  success: false,
                  reason: error.message
                });

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function value(_x) {
        return _ref6.apply(this, arguments);
      }

      return value;
    }()

    /**
     * Create a router for CRUD operations
     *
     * Method | Route            | Handler
     * ----------------------------------------
     * GET    | /{baseRoute}     | Controller.all
     * POST   | /{baseRoute}     | Controller.create
     * GET    | /{baseRoute}/:id | Controller.one
     * PUT    | /{baseRoute}/:id | Controller.update
     * DELETE | /{baseRoute}/:id | Controller.destroy
     */

  }], [{
    key: 'resource',
    value: function resource(baseRoute) {
      var router = new _express.Router();

      if (process.env.NODE_ENV !== 'test') {
        console.log(('Registering routes for ' + baseRoute + ':').green);
      }

      router.get(baseRoute, this.all.bind(this));
      router.get(baseRoute + '/:id', this.one.bind(this));
      router.post(baseRoute, this.create.bind(this));
      router.delete(baseRoute + '/:id', this.destroy.bind(this));
      router.put(baseRoute + '/:id', this.update.bind(this));

      return router;
    }

    /**
     * @private
     */

  }, {
    key: createStaticRouteHandlers,
    value: function value() {
      // TODO: Find route methods automatically
      var routeMethods = ['create', 'all', 'one', 'destroy', 'update'];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = routeMethods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var methodName = _step.value;

          this[methodName] = this[routeHandlerFactory](methodName);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * @private
     */

  }, {
    key: routeHandlerFactory,
    value: function value(methodName) {
      var routeHandler = function () {
        var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(req, res) {
          var instance;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  instance = new this(req, res, this.model);
                  _context7.prev = 1;
                  _context7.next = 4;
                  return instance[methodName]();

                case 4:
                  _context7.next = 11;
                  break;

                case 6:
                  _context7.prev = 6;
                  _context7.t0 = _context7['catch'](1);

                  console.error(_context7.t0.message.red);
                  console.error(_context7.t0);
                  instance[handleError](_context7.t0);

                case 11:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, this, [[1, 6]]);
        }));

        return function routeHandler(_x2, _x3) {
          return _ref7.apply(this, arguments);
        };
      }();

      return routeHandler;
    }
  }]);

  return Controller;
}();

//
// Create a static alias for all route methods,
// which calls the errorHandler method of the
// instance if an error occurs.
//

Controller[createStaticRouteHandlers]();

exports.default = Controller;