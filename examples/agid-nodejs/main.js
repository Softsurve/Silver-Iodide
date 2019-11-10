const http = require('http');
var url = require('url');
var agi = require('../../');
var Types = require("../../core/types.js");
var agiFs = agi();
var timefs = require('../timefs/timefs');

const hostname = '127.0.0.1';
const port = 3000;

agiFs.Write("/mnt", Types.WriteFlags.CREATEDIR, Types.FileTypes.Directory, 0, 0);
agiFs.Write("/test", Types.WriteFlags.CREATEDIR, Types.FileTypes.Directory, 0, 0);
agiFs.Write("/mnt/test", Types.WriteFlags.CREATEDIR, Types.FileTypes.Directory, 0, 0);
agiFs.Write("/mnt/test/ing", Types.WriteFlags.CREATEDIR, Types.FileTypes.Directory, 0, 0);
//agiFs.Mount(timefs, "/dev", null);
agiFs.Write("/mnt/hello.txt", Types.WriteFlags.CREATEDATAFILE, "arg[2]", 0, 0);

const server = http.createServer((request, response) => {
    request.on('error', (err) => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });
    response.on('error', (err) => {
      console.error(err);
    });

    if (request.method === 'POST' && request.url === '/echo') {
      request.pipe(response);
    } else if (request.method === 'GET' ) {
      var fileNode = agiFs.Read(request.url);

    if(fileNode != null && fileNode != Types.ReadErrors.FILENOTFOUND){
       response.statusCode = 200;
       response.write(fileNode.ToJson());
      }else {
        response.statusCode = 404;
      }

      response.end();
    } else {
      response.statusCode = 404;
      response.end();
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
