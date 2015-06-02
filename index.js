'use strict';

var http = require('http'),
  url    = require('url'),
  fs     = require('fs'),
  path   = require('path'),
  render = require('./render');
 
http.createServer(function(req, res) {
  
  var filepath = __dirname,

    pathname = url.parse(req.url, true).pathname,

    relPath = pathname === '/' ? '/index' : pathname,

    extension = path.extname(pathname);

  // treat all extensionless requests as html
  // re-route html requests to views folder  
  if (extension === '') {
    extension = '.html';
    filepath += '/views' + relPath + '.html';
  } else if (extension === '.html') {
    filepath += '/views' + relPath;
  } else {
    filepath += relPath;
  }

  console.log('request: ' + filepath);
  
  fs.exists(filepath, function(exists) {

    var mime, response;

    if (exists) {

      mime = {
        '.js': 'text/javascript; charset=UTF-8',
        '.json': 'application/json; charset=UTF-8',
        '.txt': 'text/plain; charset=UTF-8',
        '.html': 'text/html; charset=UTF-8',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.jpg': 'image/jpeg'
      };

      res.writeHead(200, {'Content-Type': mime[extension]});

      // View files
      if (extension === '.html') {

        response = render(relPath.replace('.html', ''), filepath);

      // Static files
      } else {

        fs.readFile(filepath, function(err, file) {

          if (err) {
            throw err;
          }

          response = file;

        });
      }

    // 404s
    } else {

      console.log('not found: ' + path);

      res.writeHead(404, {'Content-Type': 'text/plain'});

      response = 'file not found';
    }
    
    res.end(response);

  });

}).listen(1337);

console.log('Server running at http://localhost:1337/');