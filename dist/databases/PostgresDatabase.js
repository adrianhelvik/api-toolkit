'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PostgresDatabase = function () {
  function PostgresDatabase(userSettings) {
    _classCallCheck(this, PostgresDatabase);

    // Load dependencies on demand only
    var pg = require('pg');
    var Pool = require('pg-pool');

    var settings = _extends({
      Client: pg.Client,
      idleTimeoutMillis: 1000
    }, userSettings);

    this.pool = new Pool(settings);
    this.connect().catch(function (error) {
      throw error;
    });
  }

  _createClass(PostgresDatabase, [{
    key: 'connect',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.connection) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', this.connection);

              case 2:
                _context.next = 4;
                return this.pool.connect();

              case 4:
                this.connection = _context.sent;
                return _context.abrupt('return', this.connection);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connect() {
        return _ref.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: 'query',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref3) {
        var _query = _ref3.query,
            values = _ref3.values;
        var connection;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.connect();

              case 2:
                connection = _context2.sent;
                return _context2.abrupt('return', connection.query(_query, values));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function query(_x) {
        return _ref2.apply(this, arguments);
      }

      return query;
    }()
  }]);

  return PostgresDatabase;
}();

exports.default = PostgresDatabase;