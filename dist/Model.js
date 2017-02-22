'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sql = require('sql');

var _sql2 = _interopRequireDefault(_sql);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: Refactor
var Model = function () {
  _createClass(Model, null, [{
    key: 'setDialect',


    /**
     * Set the type of database that is used.
     */
    value: function setDialect(dialect) {
      _sql2.default.setDialect(dialect);
    }

    /**
     * Create an event emitter on demand to isolate it to each subclass
     */

  }, {
    key: 'on',
    value: function on() {
      var _eventEmitter;

      return (_eventEmitter = this._eventEmitter).on.apply(_eventEmitter, arguments);
    }
  }, {
    key: 'once',
    value: function once() {
      var _eventEmitter2;

      return (_eventEmitter2 = this._eventEmitter).once.apply(_eventEmitter2, arguments);
    }
  }, {
    key: 'emit',
    value: function emit() {
      var _eventEmitter3;

      return (_eventEmitter3 = this._eventEmitter).emit.apply(_eventEmitter3, arguments);
    }
  }, {
    key: 'convertTableNameToTableInstance',
    value: function convertTableNameToTableInstance() {
      console.assert(Array.isArray(this.columns), this._table + ': Model expects the static column property' + (' to be an array of strings. Got ' + this.columns));

      this._table = _sql2.default.define({
        name: this._table,
        columns: this.columns
      });
    }
  }, {
    key: '_eventEmitter',
    get: function get() {
      if (!this.__eventEmitter) {
        this.__eventEmitter = new _events2.default();
      }
      return this.__eventEmitter;
    }

    /**
     * Whether to automatically load relations specified in hasMany and manyToMany
     */

  }, {
    key: 'table',
    get: function get() {
      if (typeof this._table === 'string') {
        this.convertTableNameToTableInstance();
      }

      return this._table;
    },
    set: function set(table) {
      this._table = table;
    }
  }]);

  function Model(fields) {
    _classCallCheck(this, Model);

    Object.assign(this, fields);
  }

  _createClass(Model, [{
    key: 'loadRelations',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.loadHasManyRelations();

              case 2:
                _context.next = 4;
                return this.loadManyToManyRelations();

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadRelations() {
        return _ref.apply(this, arguments);
      }

      return loadRelations;
    }()
  }, {
    key: 'loadHasManyRelations',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var _this = this;

        var _constructor, hasMany, table, id, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

        return regeneratorRuntime.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _constructor = this.constructor, hasMany = _constructor.hasMany, table = _constructor.table;
                id = this.id;

                if (!hasMany) {
                  _context3.next = 28;
                  break;
                }

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 6;
                _loop = regeneratorRuntime.mark(function _loop() {
                  var relation, options, foreignKey, relatedModel, related;
                  return regeneratorRuntime.wrap(function _loop$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          relation = _step.value;
                          options = hasMany[relation];
                          foreignKey = void 0;
                          relatedModel = void 0;


                          if (options instanceof Model) {
                            foreignKey = table._name + '_id';
                            relatedModel = options;
                          } else {
                            foreignKey = options.foreignKey;
                            relatedModel = options.model;
                          }

                          _context2.next = 7;
                          return relatedModel.filterOnKey(foreignKey, id);

                        case 7:
                          related = _context2.sent;


                          _this[relation] = related.map(function (relatedData) {
                            return new relatedModel(relatedData);
                          });

                        case 9:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _loop, _this);
                });
                _iterator = Object.keys(hasMany)[Symbol.iterator]();

              case 9:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 14;
                  break;
                }

                return _context3.delegateYield(_loop(), 't0', 11);

              case 11:
                _iteratorNormalCompletion = true;
                _context3.next = 9;
                break;

              case 14:
                _context3.next = 20;
                break;

              case 16:
                _context3.prev = 16;
                _context3.t1 = _context3['catch'](6);
                _didIteratorError = true;
                _iteratorError = _context3.t1;

              case 20:
                _context3.prev = 20;
                _context3.prev = 21;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 23:
                _context3.prev = 23;

                if (!_didIteratorError) {
                  _context3.next = 26;
                  break;
                }

                throw _iteratorError;

              case 26:
                return _context3.finish(23);

              case 27:
                return _context3.finish(20);

              case 28:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee2, this, [[6, 16, 20, 28], [21,, 23, 27]]);
      }));

      function loadHasManyRelations() {
        return _ref2.apply(this, arguments);
      }

      return loadHasManyRelations;
    }()
  }, {
    key: 'loadManyToManyRelations',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var _this2 = this;

        var _constructor2, manyToMany, table, id, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop2, _iterator2, _step2;

        return regeneratorRuntime.wrap(function _callee3$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _constructor2 = this.constructor, manyToMany = _constructor2.manyToMany, table = _constructor2.table;
                id = this.id;

                if (!manyToMany) {
                  _context5.next = 28;
                  break;
                }

                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context5.prev = 6;
                _loop2 = regeneratorRuntime.mark(function _loop2() {
                  var relation, relatedModel, tableNameOfThis, tableNameOfRelated, nameOfPivotTable, keyOfThis, keyOfRelated, pivotTable, relatedTable, query, dbResponse;
                  return regeneratorRuntime.wrap(function _loop2$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          relation = _step2.value;
                          relatedModel = manyToMany[relation];
                          tableNameOfThis = table._name;
                          tableNameOfRelated = relatedModel.table._name;
                          nameOfPivotTable = tableNameOfThis + '_' + tableNameOfRelated;
                          keyOfThis = tableNameOfThis + '_id';
                          keyOfRelated = tableNameOfRelated + '_id';
                          pivotTable = _sql2.default.define({
                            name: nameOfPivotTable,
                            columns: [keyOfThis, keyOfRelated]
                          });
                          relatedTable = relatedModel.table;
                          query = {
                            query: '\n            SELECT * FROM "' + nameOfPivotTable + '"\n            JOIN "' + tableNameOfRelated + '"\n            ON "' + nameOfPivotTable + '"."' + keyOfRelated + '"="' + tableNameOfRelated + '"."id"\n          ',
                            values: []
                          };
                          _context4.next = 12;
                          return _this2.constructor.db.query(query);

                        case 12:
                          dbResponse = _context4.sent;


                          _this2[relation] = dbResponse.map(function (data) {
                            return new relatedModel(data);
                          });

                        case 14:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _loop2, _this2);
                });
                _iterator2 = Object.keys(manyToMany)[Symbol.iterator]();

              case 9:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context5.next = 14;
                  break;
                }

                return _context5.delegateYield(_loop2(), 't0', 11);

              case 11:
                _iteratorNormalCompletion2 = true;
                _context5.next = 9;
                break;

              case 14:
                _context5.next = 20;
                break;

              case 16:
                _context5.prev = 16;
                _context5.t1 = _context5['catch'](6);
                _didIteratorError2 = true;
                _iteratorError2 = _context5.t1;

              case 20:
                _context5.prev = 20;
                _context5.prev = 21;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 23:
                _context5.prev = 23;

                if (!_didIteratorError2) {
                  _context5.next = 26;
                  break;
                }

                throw _iteratorError2;

              case 26:
                return _context5.finish(23);

              case 27:
                return _context5.finish(20);

              case 28:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee3, this, [[6, 16, 20, 28], [21,, 23, 27]]);
      }));

      function loadManyToManyRelations() {
        return _ref3.apply(this, arguments);
      }

      return loadManyToManyRelations;
    }()
  }, {
    key: 'extractValues',
    value: function extractValues() {
      var values = {};

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.keys(this)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var key = _step3.value;

          values[key] = this[key];
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return values;
    }
  }, {
    key: 'save',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var table, values, query, dbResponse, newColumns;
        return regeneratorRuntime.wrap(function _callee4$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                table = this.constructor.table;
                values = this.extractValues();
                query = table.insert(values).returning(table.star()).toQuery();
                _context6.next = 5;
                return this.constructor.db.query({
                  query: query.text,
                  values: query.values
                });

              case 5:
                dbResponse = _context6.sent;
                newColumns = dbResponse[0];


                Object.assign(this, newColumns);

              case 8:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee4, this);
      }));

      function save() {
        return _ref4.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'destroy',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.constructor.destroy(this.id);

              case 2:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee5, this);
      }));

      function destroy() {
        return _ref5.apply(this, arguments);
      }

      return destroy;
    }()
  }], [{
    key: 'createQueryForAll',
    value: function createQueryForAll(whereClauses) {
      var table = this.table;


      var query = table.select(table.star()).from(table);

      if (whereClauses) {
        query = query.where(whereClauses);
      }

      query = query.toQuery();

      return {
        query: query.text,
        values: query.values
      };
    }
  }, {
    key: 'all',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var whereClauses = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var query, instances;
        return regeneratorRuntime.wrap(function _callee6$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                query = this.createQueryForAll(whereClauses);
                instances = this.executeQueryAndCreateInstances(query);
                return _context8.abrupt('return', instances);

              case 3:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee6, this);
      }));

      function all() {
        return _ref6.apply(this, arguments);
      }

      return all;
    }()
  }, {
    key: 'executeQueryAndCreateInstances',
    value: function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(query) {
        var _this3 = this;

        var dbResponse, instances, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, instance;

        return regeneratorRuntime.wrap(function _callee7$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (query) {
                  _context9.next = 2;
                  break;
                }

                throw Error('Model#executeQueryAndCreateInstances called without a query');

              case 2:
                if (query.query) {
                  _context9.next = 4;
                  break;
                }

                throw Error('Model#executeQueryAndCreateInstances called without query.query');

              case 4:
                if (query.values) {
                  _context9.next = 6;
                  break;
                }

                throw Error('Model#executeQueryAndCreateInstances called without query.values');

              case 6:
                _context9.next = 8;
                return this.db.query(query);

              case 8:
                dbResponse = _context9.sent;
                instances = dbResponse.map(function (data) {
                  return new _this3(data);
                });

                if (!this.eagerLoadRelations) {
                  _context9.next = 37;
                  break;
                }

                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context9.prev = 14;
                _iterator4 = instances[Symbol.iterator]();

              case 16:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context9.next = 23;
                  break;
                }

                instance = _step4.value;
                _context9.next = 20;
                return instance.loadRelations();

              case 20:
                _iteratorNormalCompletion4 = true;
                _context9.next = 16;
                break;

              case 23:
                _context9.next = 29;
                break;

              case 25:
                _context9.prev = 25;
                _context9.t0 = _context9['catch'](14);
                _didIteratorError4 = true;
                _iteratorError4 = _context9.t0;

              case 29:
                _context9.prev = 29;
                _context9.prev = 30;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 32:
                _context9.prev = 32;

                if (!_didIteratorError4) {
                  _context9.next = 35;
                  break;
                }

                throw _iteratorError4;

              case 35:
                return _context9.finish(32);

              case 36:
                return _context9.finish(29);

              case 37:
                return _context9.abrupt('return', instances);

              case 38:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee7, this, [[14, 25, 29, 37], [30,, 32, 36]]);
      }));

      function executeQueryAndCreateInstances(_x2) {
        return _ref7.apply(this, arguments);
      }

      return executeQueryAndCreateInstances;
    }()

    /**
     * Query the database and return new instances of this class for every match.
     */

  }, {
    key: 'query',
    value: function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(closure) {
        var table, query;
        return regeneratorRuntime.wrap(function _callee8$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                table = this.table;
                _context10.next = 3;
                return closure(table);

              case 3:
                query = _context10.sent;
                return _context10.abrupt('return', this.executeQueryAndCreateInstances(query));

              case 5:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee8, this);
      }));

      function query(_x3) {
        return _ref8.apply(this, arguments);
      }

      return query;
    }()
  }, {
    key: 'filterOnKey',
    value: function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(key, val) {
        var query;
        return regeneratorRuntime.wrap(function _callee9$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (this.table[key]) {
                  _context11.next = 2;
                  break;
                }

                throw Error('The column ' + key + ' was not found on the table: ' + this.table._name);

              case 2:
                query = this.table.select(this.table.star()).from(this.table).where(this.table[key].equals(val)).toQuery();
                return _context11.abrupt('return', this.executeQueryAndCreateInstances({
                  query: query.text,
                  values: query.values
                }));

              case 4:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee9, this);
      }));

      function filterOnKey(_x4, _x5) {
        return _ref9.apply(this, arguments);
      }

      return filterOnKey;
    }()
  }, {
    key: 'createQueryForOne',
    value: function createQueryForOne(id) {
      var table = this.table;


      var query = table.select(table.star()).from(table).where(table.id.equals(id)).limit(1).toQuery();

      return {
        query: query.text,
        values: query.values
      };
    }
  }, {
    key: 'oneWhere',
    value: function () {
      var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
        var whereClauses = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var dbQuery, query, values;
        return regeneratorRuntime.wrap(function _callee10$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                dbQuery = this.table.select(this.table.star()).from(this.table).where(whereClauses).limit(1);
                query = dbQuery.text;
                values = dbQuery.values;
                return _context12.abrupt('return', this.db.query({ query: query, values: values }));

              case 4:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee10, this);
      }));

      function oneWhere() {
        return _ref10.apply(this, arguments);
      }

      return oneWhere;
    }()
  }, {
    key: 'one',
    value: function () {
      var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(id) {
        var query, dbResponse, modelData, instance;
        return regeneratorRuntime.wrap(function _callee11$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (!(id && (typeof id === 'undefined' ? 'undefined' : _typeof(id)) === 'object')) {
                  _context13.next = 2;
                  break;
                }

                return _context13.abrupt('return', this.oneWhere(id));

              case 2:
                query = this.createQueryForOne(id);
                _context13.next = 5;
                return this.db.query(query);

              case 5:
                dbResponse = _context13.sent;
                modelData = dbResponse[0];

                if (modelData) {
                  _context13.next = 9;
                  break;
                }

                return _context13.abrupt('return', null);

              case 9:
                instance = new this(modelData);
                return _context13.abrupt('return', instance);

              case 11:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee11, this);
      }));

      function one(_x7) {
        return _ref11.apply(this, arguments);
      }

      return one;
    }()
  }, {
    key: 'create',
    value: function () {
      var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(fields) {
        var instance;
        return regeneratorRuntime.wrap(function _callee12$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                instance = new this(fields);
                _context14.next = 3;
                return instance.save();

              case 3:

                this.emit('create', instance);

                return _context14.abrupt('return', instance);

              case 5:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee12, this);
      }));

      function create(_x8) {
        return _ref12.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: 'createQueryForDestroy',
    value: function createQueryForDestroy(id) {
      var table = this.table;


      var query = table.delete().where(table.id.equals(id)).toQuery();

      return {
        query: query.text,
        values: query.values
      };
    }
  }, {
    key: 'destroy',
    value: function () {
      var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(id) {
        var removedData, query;
        return regeneratorRuntime.wrap(function _callee13$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.one(id);

              case 2:
                removedData = _context15.sent;
                query = this.createQueryForDestroy(id);
                _context15.next = 6;
                return this.db.query(query);

              case 6:

                this.emit('destroy', removedData);

              case 7:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee13, this);
      }));

      function destroy(_x9) {
        return _ref13.apply(this, arguments);
      }

      return destroy;
    }()
  }, {
    key: 'createQueryForUpdate',
    value: function createQueryForUpdate(id, updates) {
      var table = this.table;


      var query = table.update(updates).where(table.id.equals(id)).toQuery();

      return {
        query: query.text,
        values: query.values
      };
    }
  }, {
    key: 'update',
    value: function () {
      var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(id) {
        var updates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var error, query, newValue;
        return regeneratorRuntime.wrap(function _callee14$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                if (Object.keys(updates).length) {
                  _context16.next = 4;
                  break;
                }

                error = Error('[Model]: Updates are required');

                error.httpStatusCode = 422;
                throw error;

              case 4:
                query = this.createQueryForUpdate(id, updates);
                _context16.next = 7;
                return this.db.query(query);

              case 7:
                _context16.next = 9;
                return this.one(id);

              case 9:
                newValue = _context16.sent;

                this.emit('update', newValue);
                return _context16.abrupt('return', newValue);

              case 12:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee14, this);
      }));

      function update(_x10) {
        return _ref14.apply(this, arguments);
      }

      return update;
    }()
  }]);

  return Model;
}();

Model._table = null;
Model.db = null;
Model.eagerLoadRelations = false;
exports.default = Model;