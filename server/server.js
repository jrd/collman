// vim:et:sta:sw=2:sts=2:ts=2:tw=0:
var express = require('express');
var app = express();
app.get('/', function(req, res) {
  res.send('CollMan');
});
app.get('/test', function(req, res) {
  res.send('ça marche');
});
app.get(/^\/bonjour\/(.+)$/, function(req, res) {
  res.send('Bonjour ' + req.params[0] + ' !');
});
app.get('/bonsoir/:name', function(req, res) {
  res.send('Bonsoir ' + req.params.name + ' !');
});
app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
});
app.use('/contenu', express.static(__dirname));
app.listen(3000);
console.log('http://localhost:3000');
