'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PostgresDatabase = require('./databases/PostgresDatabase');

var _PostgresDatabase2 = _interopRequireDefault(_PostgresDatabase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  postgres: function postgres(settings) {
    return new _PostgresDatabase2.default(settings);
  }
};