var sq3 = require('sqlite3').verbose();
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

function chainCall() {
  var max = Math.floor(arguments.length / 2) * 2;
  var nextFn = null;
  var newNextFn = null;
  var fnCall;
  var fnCallback;
  var errorCallback = arguments[max]; // the callback to call in case of an error on the chain
  var makeNewCallback = function(fnCallback, nextFn, ctx) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      args.push(ctx);
      var newctx = fnCallback.apply(fnCallback, args);
      if (newctx === false) {
        errorCallback();
      } else if (nextFn) { // Chain after returning from the callback
        nextFn(newctx);
      }
    };
  };
  for (var i = max - 1; i >= 0; i-=2) { // from last to first, step 2
    fnCallback = arguments[i]; // Initial callback
    fnCall = arguments[i - 1];
    /*jshint loopfunc:true*/
    newNextFn = function(fnCall, fnCallback, nextFn) {
      return function(ctx) {
        fnCall(makeNewCallback(fnCallback, nextFn, ctx), ctx);
      };
    }(fnCall, fnCallback, nextFn); // The final function to run, with arguments binded.
    nextFn = newNextFn;
  }
  nextFn({}); // Trigger the first call, that will chain the others
}

function findMovie(db, id, callback) {
  chainCall(
    function(callback, ctx) {
      db.get('SELECT * FROM Movie WHERE id=$id', { $id: id }, callback);
    },
    function(err, movie, ctx) {
      var json;
      if (movie && movie.length) {
        json = {
          id: movie.id,
          title: movie.title,
          origTitle: movie.title_orig,
          rlzYear: movie.rlz_year,
          length: movie.length,
          countries: null,
          directors: null,
          producers: null,
          cast: null,
          synopsys: movie.synopsys,
          format: movie.format,
          tags: null,
          languages: null,
          subtitles: null,
          region: movie.region,
          serie: movie.serie,
          volume: movie.volume,
          numberOfDisks: movie.number_of_disks
        };
        return {movieId: movie.id, json: json};
      } else {
        return false;
      }
    },
    function(callback, ctx) {
      db.all('SELECT code FROM MovieCountry WHERE movie_id=$id', { $id: ctx.movieId }, callback);
    },
    function(err, countries, ctx) {
      if (countries && countries.length) {
        ctx.json.countries = countries.map(function (country) {
          return country.code;
        });
      }
      return ctx;
    },
    function(callback, ctx) {
      db.all("SELECT * FROM Personne WHERE role='director' AND movie_id=$id", { $id: ctx.movieId }, callback);
    },
    function(err, directors, ctx) {
      if (directors && directors.length) {
        ctx.json.directors = directors.map(function (director) {
          return director.firstname + ' ' + director.lastname;
        });
      }
      return ctx;
    },
    function(callback, ctx) {
      db.all("SELECT * FROM Personne WHERE role='producer' AND movie_id=$id", { $id: ctx.movieId }, callback);
    },
    function(err, producers, ctx) {
      if (producers && producers.length) {
        ctx.json.producers = producers.map(function (producer) {
          return producer.firstname + ' ' + producer.lastname;
        });
      }
      return ctx;
    },
    function(callback, ctx) {
      db.all("SELECT mc.character, p.firstname, p.lastname FROM MovieCast mc, Personne p WHERE mc.movie_id=$id AND mc.actor_id = p.id", { $id: ctx.movieId }, callback);
    },
    function(err, actors, ctx) {
      if (actors && actors.length) {
        ctx.json.cast = actors.map(function (actor) {
          return {actor: actor.firstname + ' ' + actor.lastname, character: actor.character};
        });
      }
      return ctx;
    },
    function(callback, ctx) {
      db.all("SELECT tag FROM Tag WHERE movie_id=$id", { $id: ctx.movieId }, callback);
    },
    function(err, tags, ctx) {
      if (tags && tags.length) {
        ctx.json.tags = tags.map(function (tag) {
          return tag.tag;
        });
      }
      return ctx;
    },
    function(callback, ctx) {
      db.all("SELECT l.* FROM Language l, MovieLang ml WHERE ml.movie_id=$id AND ml.code = l.code", { $id: ctx.movieId }, callback);
    },
    function(err, langs, ctx) {
      if (langs && langs.length) {
        ctx.json.languages = langs;
      }
      return ctx;
    },
    function(callback, ctx) {
      db.all("SELECT l.* FROM Language l, MovieSub ms WHERE ms.movie_id=$id AND ms.code = l.code", { $id: ctx.movieId }, callback);
    },
    function(err, langs, ctx) {
      if (langs && langs.length) {
        ctx.json.subtitles = langs;
      }
      callback(ctx.json);
      return ctx;
    },
    function () {
      callback(null);
    }
  );
}

exports.selectDb = selectDb;
exports.deleteDb = deleteDb;
exports.findMovie = findMovie;
