var sq3 = require('sqlite3').verbose();
var fs = require('fs');

exports.AbstractDao = function(dbType, dbName) {
  var _dbType = dbType;
  var _dbName = dbName;
  var _db = null;
  return {
    getDbType: function() {
      return _dbType;
    },
    getDbName: function() {
      return _dbName;
    },
    getDb: function() {
      return _db;
    },
    selectDb: function() {
      if (!_dbName) {
        throw new Error("Bad usage");
      }
      _db = new sq3.Database(this.getPath());
      this.checkDbInitialized();
    },
    getPath: function() {
      if (!_dbName || !_dbType) {
        throw new Error("Bad usage");
      }
      return _dbName + '.' + _dbType + '.sqlite3';
    },
    getMainTableName: function() {
      throw new Error("getMainTableName: Not implemented");
    },
    checkDbInitialized: function() {
      if (!_db) {
        throw new Error("Bad usage");
      }
      _db.run('SELECT 1 FROM {0} LIMIT 1'.format(this.getMainTableName()), function(err) {
        if (err !== null) {
          this.createDbSchema();
        }
      });
    },
    createDbSchema: function() {
      throw new Error("createDbSchema: Not implemented");
    },
    deleteDb: function() {
      if (!_dbName) {
        throw new Error("Bad usage");
      }
      fs.unlinkSync(this.getPath());
    },
    findById: function(id) {
      throw new Error("findById: Not implemented");
    },
    findAll: function() {
      throw new Error("findAll: Not implemented");
    }
  };
};
