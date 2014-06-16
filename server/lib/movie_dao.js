require('./common');
var Class = require('./classes').Class;
var dao = require('./dao');
var P = require('promised-io/promise');
var promiseme = require('./promise').promiseme;
var promiseEach = require('./promise').promiseEach;

var MovieDao = Class(dao.AbstractDao, function(__super__, __parent__) {
  return {
    __init__: function(dbName) {
      __super__('movie', dbName);
    },
    getMainTableName: function() {
      return 'Movie';
    },
    createDbSchema: function() {
      var dbRun = promiseme(this.getDb().run, this.getDb());
      return P.all([
        dbRun('CREATE TABLE Country (code TEXT PRIMARY KEY, name TEXT)'),
        dbRun('CREATE TABLE Movie (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, title_orig TEXT, rlz_year INTEGER, length INTEGER, synopsys TEXT, format TEXT, region TEXT, serie TEXT, volume INTEGER, number_of_disks INTEGER)'),
        dbRun('CREATE TABLE MovieCountry (code TEXT REFERENCES Country(code) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)'),
        dbRun('CREATE TABLE Personne (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE, firstname TEXT, lastname TEXT)'),
        dbRun('CREATE TABLE MovieCast (id INTEGER PRIMARY KEY AUTOINCREMENT, character TEXT, actor_id INTEGER REFERENCES Personne(id) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)'),
        dbRun('CREATE TABLE Tag (tag TEXT, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE, PRIMARY KEY(tag, movie_id))'),
        dbRun('CREATE TABLE Language (code TEXT PRIMARY KEY, name TEXT)'),
        dbRun('CREATE TABLE MovieLang (code TEXT REFERENCES Language(code) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)'),
        dbRun('CREATE TABLE MovieSub (code TEXT REFERENCES Language(code) ON DELETE CASCADE, movie_id INTEGER REFERENCES Movie(id) ON DELETE CASCADE)')
      ]);
    },
    findById: function(id) {
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
      var dbGet = promiseme(this.getDb().get, this.getDb());
      var dbAll = promiseme(this.getDb().all, this.getDb());
      var fnError = function(err) {
        error = true;
        jsonPromise.reject("Error for findById[movie]: " + err.message);
      };
      P.all([
        dbGet("SELECT * FROM Movie WHERE id=$id", { $id: id }).then(
          function(ctx) {
            var movie = ctx[1];
            if (!error && movie) {
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
          }, fnError),
        dbAll("SELECT c.code, c.name FROM MovieCountry mc, Country c WHERE mc.movie_id=$id and mc.code = c.code", { $id: id }).then(
          function(ctx) {
            var countries = ctx[1];
            if (!error && countries && countries.length) {
              json.countries = countries.map(function (country) {
                return {'code': country.code, 'name': country.name};
              });
            }
          }, fnError),
        dbAll("SELECT * FROM Personne WHERE role='director' AND movie_id=$id", { $id: id }).then(
          function(ctx) {
            var directors = ctx[1];
            if (!error && directors && directors.length) {
              json.directors = directors.map(function (director) {
                return {'firstname': director.firstname, 'lastname': director.lastname};
              });
            }
          }, fnError),
        dbAll("SELECT * FROM Personne WHERE role='producer' AND movie_id=$id", { $id: id }).then(
          function(ctx) {
            var producers = ctx[1];
            if (!error && producers && producers.length) {
              json.producers = producers.map(function (producer) {
                return {'firstname': producer.firstname, 'lastname': producer.lastname};
              });
            }
          }, fnError),
        dbAll("SELECT mc.character, p.firstname, p.lastname FROM MovieCast mc, Personne p WHERE mc.movie_id=$id AND mc.actor_id = p.id", { $id: id }).then(
          function(ctx) {
            var actors = ctx[1];
            if (!error && actors && actors.length) {
              json.cast = actors.map(function (actor) {
                return {actor: {'firstname': actor.firstname, 'lastname': actor.lastname}, character: actor.character};
              });
            }
          }, fnError),
        dbAll("SELECT tag FROM Tag WHERE movie_id=$id", { $id: id }).then(
          function(ctx) {
            var tags = ctx[1];
            if (!error && tags && tags.length) {
              json.tags = tags.map(function (tag) {
                return tag.tag;
              });
            }
          }, fnError),
        dbAll("SELECT l.* FROM Language l, MovieLang ml WHERE ml.movie_id=$id AND ml.code = l.code", { $id: id }).then(
          function(ctx) {
            var langs = ctx[1];
            if (!error && langs && langs.length) {
              json.languages = langs;
            }
          }, fnError),
        dbAll("SELECT l.* FROM Language l, MovieSub ms WHERE ms.movie_id=$id AND ms.code = l.code", { $id: id }).then(
          function(ctx) {
            var langs = ctx[1];
            if (!error && langs && langs.length) {
              json.subtitles = langs;
            }
          }, fnError)
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
    },
    findAll: function() {
      var jsonPromise = P.Deferred();
      var json = {
        name: null,
        totalSize: null,
        data: []
      };
      var error = false;
      var dbEach = promiseEach(this.getDb().each, this.getDb());
      var dbAll = promiseme(this.getDb().all, this.getDb());
      var dbName = this.getDbName();
      var fnError = function(err) {
        error = true;
        jsonPromise.reject("Error for findAll[movie]: " + err.message);
      };
      dbEach("SELECT * FROM Movie ORDER BY title, id", function(err, movie, fnIterationDone) {
        if (!error && movie) {
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
              }, fnError),
            dbAll("SELECT tag FROM Tag WHERE movie_id=$id", { $id: movie.id }).then(
              function(ctx) {
                var tags = ctx[1];
                if (!error && tags && tags.length) {
                  jsonMovie.tags = tags.map(function (tag) {
                    return tag.tag;
                  });
                }
              }, fnError),
            dbAll("SELECT l.* FROM Language l, MovieLang ml WHERE ml.movie_id=$id AND ml.code = l.code", { $id: movie.id }).then(
              function(ctx) {
                var langs = ctx[1];
                if (!error && langs && langs.length) {
                  jsonMovie.languages = langs;
                }
              }, fnError),
            dbAll("SELECT l.* FROM Language l, MovieSub ms WHERE ms.movie_id=$id AND ms.code = l.code", { $id: movie.id }).then(
              function(ctx) {
                var langs = ctx[1];
                if (!error && langs && langs.length) {
                  jsonMovie.subtitles = langs;
                }
              }, fnError)
          ]).then(
            function(array) {
              json.data.push(jsonMovie);
              fnIterationDone();
            }, fnError
          );
        }
      }).then(
        function(nb) {
          if (!error) {
            json.totalSize = nb;
            json.name = dbName;
            jsonPromise.resolve(json);
          } else {
            jsonPromise.reject(error);
          }
        }, fnError);
      return jsonPromise.promise;
    },
    saveOrUpdate: function(movie) {
      var isUpdate = movie.id && true;
      var prePromise = P.Deferred();
      var idPromise = P.Deferred();
      var error = false;
      var dbRun = promiseme(this.getDb().run, this.getDb());
      var fnThenNop = function(ctx) {};
      var fnError = function(err) {
        error = true;
        idPromise.reject("Error for saveOrUpdate[movie]: " + err.message);
      };
      var insertOrUpdateSql;
      var insertOrUpdateParams;
      if (isUpdate) {
        var id = movie.id;
        console.log("Update mode : id = " + id);
        P.all([
          dbRun("DELETE FROM MovieCountry WHERE movie_id=$id", { $id: id }).then(fnThenNop, fnError),
          dbRun("DELETE FROM Personne WHERE movie_id=$id", { $id: id }).then(fnThenNop, fnError),
          dbRun("DELETE FROM MovieCast WHERE movie_id=$id", { $id: id }).then(fnThenNop, fnError),
          dbRun("DELETE FROM Tag WHERE movie_id=$id", { $id: id }).then(fnThenNop, fnError),
          dbRun("DELETE FROM MovieLang WHERE movie_id=$id", { $id: id }).then(fnThenNop, fnError),
          dbRun("DELETE FROM MovieSub WHERE movie_id=$id", { $id: id }).then(fnThenNop, fnError)
        ]).then(
          function(array) {
            prePromise.resolve(true);
          }, function(err) {
            prePromise.reject(err.message);
          }
        );
        insertOrUpdateSql = "UPDATE Movie SET title=$title, title_orig=$titleOrig, rlz_year=$rlzYear, length=$length, synopsys=$synopsys, format=$format, region=$region, serie=$serie, volume=$volume, number_of_disks=$numberOfDisks where id=$id";
        insertOrUpdateParams = {
          $id : id,
          $title : movie.title,
          $titleOrig : movie.origTitle || null,
          $rlzYear : movie.rlzYear || null,
          $length : movie.length || null,
          $synopsys : movie.synopsys || null,
          $format : movie.format || null,
          $region : movie.region || null,
          $serie : movie.serie || null,
          $volume : movie.volume || null,
          $numberOfDisks : movie.numberOfDisks || 1
        };
      } else {
        console.log("Create mode");
        insertOrUpdateSql = "INSERT INTO Movie(title, title_orig, rlz_year, length, synopsys, format, region, serie, volume, number_of_disks) VALUES($title, $titleOrig, $rlzYear, $length, $synopsys, $format, $region, $serie, $volume, $numberOfDisks)";
        insertOrUpdateParams = {
          $title : movie.title,
          $titleOrig : movie.origTitle || null,
          $rlzYear : movie.rlzYear || null,
          $length : movie.length || null,
          $synopsys : movie.synopsys || null,
          $format : movie.format || null,
          $region : movie.region || null,
          $serie : movie.serie || null,
          $volume : movie.volume || null,
          $numberOfDisks : movie.numberOfDisks || 1
        };
        prePromise.resolve(true);
      }
      prePromise.promise.then(function(val) {
        console.log("pre finished, now do the insert or update\n" + insertOrUpdateSql);
        console.log(insertOrUpdateParams);
        dbRun(insertOrUpdateSql, insertOrUpdateParams).then(
          function(ctx) {
            var self = ctx[ctx.length - 1];
            var newId;
            if (isUpdate) {
              newId = movie.id;
            } else {
              newId = self.lastID;
            }
            var insertCountryList = [];
            var insertDirectorList = [];
            var insertProducerList = [];
            var insertCastList = [];
            var insertTagList = [];
            var insertLangList = [];
            var insertSubList = [];
            if (movie.countries) {
              movie.countries.forEach(function(country) {
                insertCountryList.push(dbRun("INSERT INTO MovieCountry(code, movie_id) VALUES($country, $id)", { $country: country, $id: newId }));
              });
            }
            if (movie.directors) {
              movie.directors.forEach(function(director) {
                insertDirectorList.push(dbRun("INSERT INTO Personne(role, movie_id, firstname, lastname) VALUES('director', $id, $fn, $ln)", { $fn: director.firstname, $ln: director.lastname, $id: newId }));
              });
            }
            if (movie.producers) {
              movie.producers.forEach(function(producer) {
                insertProducerList.push(dbRun("INSERT INTO Personne(role, movie_id, firstname, lastname) VALUES('producer', $id, $fn, $ln)", { $fn: producer.firstname, $ln: producer.lastname, $id: newId }));
              });
            }
            if (movie.cast) {
              movie.cast.forEach(function(actor) {
                insertCastList.push(dbRun("INSERT INTO Personne(role, movie_id, firstname, lastname) VALUES('actor', $id, $fn, $ln)", { $fn: actor.firstname, $ln: actor.lastname, $id: newId }).then(function(ctx) {
                  var self = ctx[ctx.length - 1];
                  var pId = self.lastID;
                  var deferred = P.Deferred();
                  dbRun("INSERT INTO MovieCast(character, actor_id, movie_id) VALUES($char, $pId, $id)", { $char: actor.character, $pId: pId, $id: newId }).then(function(ctx) { deferred.resolve(true); }, function(err) { deferred.reject(err); });
                  return deferred.promise;
                }, fnError));
              });
            }
            if (movie.tags) {
              movie.tags.forEach(function(tag) {
                insertTagList.push(dbRun("INSERT INTO Tag(tag, movie_id) VALUES($tag, $id)", { $tag: tag, $id: newId }));
              });
            }
            if (movie.languages) {
              movie.languages.forEach(function(lang) {
                insertLangList.push(dbRun("INSERT INTO MovieLang(code, movie_id) VALUES($code, $id)", { $code: lang, $id: newId }));
              });
            }
            if (movie.subtitles) {
              movie.subtitles.forEach(function(sub) {
                insertSubList.push(dbRun("INSERT INTO MovieSub(code, movie_id) VALUES($code, $id)", { $code: sub, $id: newId }));
              });
            }
            P.all([].concat(insertCountryList, insertDirectorList, insertProducerList, insertCastList, insertTagList, insertLangList, insertSubList)).then(
              function(array) {
                console.log("saveOrUpdate, newID = " + newId);
                idPromise.resolve(newId);
              }, function(err) {
                idPromise.reject(err.message);
              }
            );
          }, fnError);
      });
      return idPromise.promise;
    }
  };
});

module.exports = dao.exportDaoFunctions(MovieDao);
