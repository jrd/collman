// vim:et:sta:sw=2:sts=2:ts=2:tw=0:
var express = require('express');
var app = express();
app.get('/', function(req, res) {
  res.send('CollMan');
});
app.listen(3000);
