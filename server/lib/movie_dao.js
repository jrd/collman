require('./common');
var dao = require('./dao');
var P = require('promised-io/promise');
var promiseme = require('./promise').promiseme;
var promiseEach = require('./promise').promiseEach;
var mocks = require('./mocks');

var MovieDao = function(dbName) {
  var _super = dao.AbstractDao('movie', dbName);
  _super.getMainTableName = function() {
    return 'Movie';
  };
  _super.createDbSchema = function() {
    _db.run('CREATE TABLE Country (code TEXT PRIMARY KEY, name TEXT)');
    _db.run('CREATE TABLE Movie (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, title_orig TEXT, rlz_year INTEGER, length INTEGER, synopsys TEXT, format TEXT, region TEXT, serie TEXT, volume INTEGER, number_of_disks INTEGER)');
    _db.run('CREATE TABLE MovieCountry (code TEXT REFERENCES Country(code) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)');
    _db.run('CREATE TABLE Personne (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE, firstname TEXT, lastname TEXT)');
    _db.run('CREATE TABLE MovieCast (id INTEGER PRIMARY KEY AUTOINCREMENT, character TEXT, actor_id INTEGER REFERENCES Personne(id) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)');
    _db.run('CREATE TABLE Tag (tag TEXT, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE, PRIMARY KEY(tag, movie_id))');
    _db.run('CREATE TABLE Language (code TEXT PRIMARY KEY, name TEXT)');
    _db.run('CREATE TABLE MovieLang (code TEXT REFERENCES Language(code) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)');
    _db.run('CREATE TABLE MovieSub (code TEXT REFERENCES Language(code) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)');
  };
  _super.findById = function(id) {
    var jsonPromise = P.Deferred();
    var json = {
      id: null,
      title: null,
      origTitle: null,
      rlzYear: null,
      length: null,
      countries: null,
      directors: null,
      producers: null,
      cast: null,
      synopsys: null,
      format: null,
      tags: null,
      languages: null,
      subtitles: null,
      region: null,
      serie: null,
      volume: null,
      numberOfDisks: null
    };
    var error = false;
    var dbGet = promiseme(_super.getDb().get, _super.getDb());
    var dbAll = promiseme(_super.getDb().all, _super.getDb());
    var fnError = function(name) {
      return function(err) {
        error = true;
        throw new Error("Error for " + name + ": " + err);
      };
    };
    P.all([
      dbGet("SELECT * FROM Movie WHERE id=$id", { $id: id }).then(
        function(ctx) {
          var movie = ctx[1];
          if (!error && movie && movie.length) {
            json.id = movie.id;
            json.title = movie.title;
            json.origTitle = movie.title_orig;
            json.rlzYear = movie.rlz_year;
            json.length = movie.length;
            json.synopsys = movie.synopsys;
            json.format = movie.format;
            json.region = movie.region;
            json.serie = movie.serie;
            json.volume = movie.volume;
            json.numberOfDisks = movie.number_of_disks;
          }
        }, fnError('movie')),
      dbAll("SELECT code FROM MovieCountry WHERE movie_id=$id", { $id: id }).then(
        function(ctx) {
          var countries = ctx[1];
          if (!error && countries && countries.length) {
            json.countries = countries.map(function (country) {
              return country.code;
            });
          }
        }, fnError('countries')),
      dbAll("SELECT * FROM Personne WHERE role='director' AND movie_id=$id", { $id: id }).then(
        function(ctx) {
          var directors = ctx[1];
          if (!error && directors && directors.length) {
            json.directors = directors.map(function (director) {
              return director.firstname + ' ' + director.lastname;
            });
          }
        }, fnError('directors')),
      dbAll("SELECT * FROM Personne WHERE role='producer' AND movie_id=$id", { $id: id }).then(
        function(ctx) {
          var producers = ctx[1];
          if (!error && producers && producers.length) {
            json.producers = producers.map(function (producer) {
              return producer.firstname + ' ' + producer.lastname;
            });
          }
        }, fnError('producers')),
      dbAll("SELECT mc.character, p.firstname, p.lastname FROM MovieCast mc, Personne p WHERE mc.movie_id=$id AND mc.actor_id = p.id", { $id: id }).then(
        function(ctx) {
          var actors = ctx[1];
          if (!error && actors && actors.length) {
            json.cast = actors.map(function (actor) {
              return {actor: actor.firstname + ' ' + actor.lastname, character: actor.character};
            });
          }
        }, fnError('actors')),
      dbAll("SELECT tag FROM Tag WHERE movie_id=$id", { $id: id }).then(
        function(ctx) {
          var tags = ctx[1];
          if (!error && tags && tags.length) {
            json.tags = tags.map(function (tag) {
              return tag.tag;
            });
          }
        }, fnError('tags')),
      dbAll("SELECT l.* FROM Language l, MovieLang ml WHERE ml.movie_id=$id AND ml.code = l.code", { $id: id }).then(
        function(ctx) {
          var langs = ctx[1];
          if (!error && langs && langs.length) {
            json.languages = langs;
          }
        }, fnError('languages')),
      dbAll("SELECT l.* FROM Language l, MovieSub ms WHERE ms.movie_id=$id AND ms.code = l.code", { $id: id }).then(
        function(ctx) {
          var langs = ctx[1];
          if (!error && langs && langs.length) {
            json.subtitles = langs;
          }
        }, fnError('subtitles'))
    ]).then(
      function(array) {
        if (json.id !== null) {
          jsonPromise.resolve(json);
        } else {
          jsonPromise.resolve(null);
        }
      }, function(err) {
        jsonPromise.reject(err.message);
      }
    );
    return jsonPromise.promise;
  };
  _super.findAll = function() {
    var jsonPromise = P.Deferred();
    var json = {
      name: null,
      totalSize: null,
      data: []
    };
    var error = false;
    var dbEach = promiseEach(_super.getDb().each, _super.getDb());
    var dbAll = promiseme(_super.getDb().all, _super.getDb());
    var fnError = function(name) {
      return function(err) {
        error = true;
        throw new Error("Error for " + name + ": " + err);
      };
    };
    dbEach("SELECT * FROM Movie ORDER BY title, id", function(err, movie, fnIterationDone) {
      if (!error && movie && movie.length) {
        var jsonMovie = {
          id: movie.id,
          title: movie.title,
          origTitle: movie.title_orig,
          rlzYear: movie.rlz_year,
          length: movie.length,
          countries: [],
          format: movie.format,
          tags: [],
          languages: [],
          subtitles: [],
          serie: movie.serie,
          volume: movie.volume
        };
        P.all([
          dbAll("SELECT code FROM MovieCountry WHERE movie_id=$id", { $id: movie.id }).then(
            function(ctx) {
              var countries = ctx[1];
              if (!error && countries && countries.length) {
                jsonMovie.countries = countries.map(function (country) {
                  return country.code;
                });
              }
            }, fnError('countries')),
          dbAll("SELECT tag FROM Tag WHERE movie_id=$id", { $id: movie.id }).then(
            function(ctx) {
              var tags = ctx[1];
              if (!error && tags && tags.length) {
                jsonMovie.tags = tags.map(function (tag) {
                  return tag.tag;
                });
              }
            }, fnError('tags')),
          dbAll("SELECT l.* FROM Language l, MovieLang ml WHERE ml.movie_id=$id AND ml.code = l.code", { $id: movie.id }).then(
            function(ctx) {
              var langs = ctx[1];
              if (!error && langs && langs.length) {
                jsonMovie.languages = langs;
              }
            }, fnError('languages')),
          dbAll("SELECT l.* FROM Language l, MovieSub ms WHERE ms.movie_id=$id AND ms.code = l.code", { $id: movie.id }).then(
            function(ctx) {
              var langs = ctx[1];
              if (!error && langs && langs.length) {
                jsonMovie.subtitles = langs;
              }
            }, fnError('subtitles'))
        ]).then(
          function(array) {
            json.data.push(jsonMovie);
            fnIterationDone();
          }, fnError('movie')
        );
      }
    }).then(
      function(nb) {
        if (!error) {
          json.totalSize = nb;
          json.name = _super.getDbName();
          jsonPromise.resolve(json);
        } else {
          jsonPromise.reject(null);
        }
      }, fnError('movies'));
    return jsonPromise.promise;
  };
  _super.selectDb();
  return _super;
};

exports.findMovie = function(name, id) {
  var movieDao = new MovieDao(name);
  return movieDao.findById(id);
};
exports.allMovies = function(name) {
  var movieDao = new MovieDao(name);
  return movieDao.findAll();
};
