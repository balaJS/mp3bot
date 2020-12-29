var express = require('express');
var router = express.Router();

// DB setup.
const dbClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/mp3bot';
const client = new dbClient(url, {useUnifiedTopology: true});
const assert = require('assert');

// get files from inserted path.
const fs = require('fs');

function get_list(path = '') {
  if (!path) { return; }
  var files = fs.readdirSync(path);
  var fileList = {
    dir: {},
    files: []
  };
  files.forEach(function(file) {
    if (file.endsWith('.mp3')) {
      fileList.files.push(file);
    } else if (file.search(/\./) === -1) {
      fileList.dir[path + file] = get_list(path + file + '/');
    }
  });
  fileList['title'] = path;
  return fileList;
}

function save(data) {
  client.connect(function(err, client) {
    const db = client.db();
    let source = db.collection('source', {'autoIndexId': true});
    source.insertOne(data);
  });
}

/* Store action done here. */
router.get('/', function(req, res, next) {
  res.render('app', { title: 'MP3BOT', content: 'Search here' });
});

router.post('/store', function(req, res, next) {
  const formData = req.body;
  save(formData);
  console.log(formData.path);
  return res.send(get_list(formData['path']));
});

module.exports = router;
