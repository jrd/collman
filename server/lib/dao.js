var Class = require('./classes').Class;
var sq3 = require('sqlite3').verbose();
var fs = require('fs');
var P = require('promised-io/promise');

exports.AbstractDao = Class(function() {
  var _dbType, _dbName;
  return {
    __init__: function(dbType, dbName) {
      _dbType = dbType;
      _dbName = dbName;
      _db = null;
    },
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
      var deferred = new P.Deferred();
      var self = this;
      _db = new sq3.Database(this.getPath(), function(err) {
        if (err === null) {
          _db.run('PRAGMA foreign_keys=on', function(err) {
            if (err === null) {
              self.checkDbInitialized().then(function(val) { deferred.resolve(self); }, function(err) { deferred.reject(err); });
            } else {
              deferred.reject(err);
            }
          });
        } else {
          deferred.reject(err);
        }
      });
      return deferred.promise;
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
      var deferred = new P.Deferred();
      var self = this;
      _db.run('SELECT 1 FROM {0} LIMIT 1'.format(this.getMainTableName()), function(err) {
        if (err !== null) {
          self.createDbSchema().then(function(val) { deferred.resolve(self); }, function(err) { deferred.reject(err); });
        } else {
          deferred.resolve(self);
        }
      });
      return deferred.promise;
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
    },
    saveOrUpdate: function(obj) {
      throw new Error("saveOrUpdate: Not implemented");
    }
  };
});
exports.exportDaoFunctions = function(daoClass) {
  var getDao = function(name) {
    var deferred = P.Deferred();
    new daoClass(name).selectDb().then(function(dao) {
      deferred.resolve(dao);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  return {
    'getDao': getDao,
    'findById': function(name, id) {
      return getDao(name).then(function(dao) {
        return dao.findById(id);
      });
    },
    'findAll': function(name, id) {
      return getDao(name).then(function(dao) {
        return dao.findAll();
      });
    },
    'saveOrUpdate': function(name, obj) {
      return getDao(name).then(function(dao) {
        return dao.saveOrUpdate(obj);
      });
    }
  };
};
