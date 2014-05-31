var sq3 = require('sqlite3').verbose();
var P = require('promised-io/promise');
var promiseme = require('./promise').promiseme;
var fs = require('fs');

function getPath(dbType, dbName) {
  return dbName + '.' + dbType + '.sqlite3';
}

function checkDbInitialized(db, dbType) {
  if (dbType == 'movie') {
    db.run('SELECT 1 FROM Movie LIMIT 1', function(err) {
      if (err !== null) {
        createDbSchema(db, dbType);
      }
    });
  } else {
    throw new Exception("Db type unknown: " + dbType);
  }
}

function createDbSchema(db, dbType) {
  if (dbType == 'movie') {
    db.run('CREATE TABLE Country (code TEXT PRIMARY KEY, name TEXT)');
    db.run('CREATE TABLE Movie (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, title_orig TEXT, rlz_year INTEGER, length INTEGER, synopsys TEXT, format TEXT, region TEXT, serie TEXT, volume INTEGER, number_of_disks INTEGER)');
    db.run('CREATE TABLE MovieCountry (code TEXT REFERENCES Country(code) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)');
    db.run('CREATE TABLE Personne (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE, firstname TEXT, lastname TEXT)');
    db.run('CREATE TABLE MovieCast (id INTEGER PRIMARY KEY AUTOINCREMENT, character TEXT, actor_id INTEGER REFERENCES Personne(id) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)');
    db.run('CREATE TABLE Tag (tag TEXT, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE, PRIMARY KEY(tag, movie_id))');
    db.run('CREATE TABLE Language (code TEXT PRIMARY KEY, name TEXT)');
    db.run('CREATE TABLE MovieLang (code TEXT REFERENCES Language(code) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)');
    db.run('CREATE TABLE MovieSub (code TEXT REFERENCES Language(code) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)');
  } else {
    throw new Exception("Db type unknown: " + dbType);
  }
}

function selectDb(dbType, dbName) {
  if (dbType == 'movie') {
    var moviesDb = new sq3.Database(getPath(dbType, dbName));
    checkDbInitialized(moviesDb, dbType);
    return moviesDb;
  } else {
    throw new Exception("Db type unknown: " + dbType);
  }
}

function deleteDb(dbType, dbName) {
  if (dbType == 'movie') {
    fs.unlinkSync(getPath(dbType, dbName));
  } else {
    throw new Exception("Db type unknown: " + dbType);
  }
}

function findMovie(db, id) {
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
  var dbGet = promiseme(db.get, db);
  var dbAll = promiseme(db.all, db);
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
}

exports.selectDb = selectDb;
exports.deleteDb = deleteDb;
exports.findMovie = findMovie;
