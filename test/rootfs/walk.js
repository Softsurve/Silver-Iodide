'use strict';
var agi = require('../../');
var Types = require("../../core/types.js");
var agiFs = agi();


agiFs.Write("/mnt", Types.WriteFlags.CREATEDIR, Types.FileTypes.Directory, 0, 0);
agiFs.Write("/mnt/test", Types.WriteFlags.CREATEDIR, Types.FileTypes.Directory, 0, 0);
agiFs.Write("/mnt/test/ing", Types.WriteFlags.CREATEDIR, Types.FileTypes.Directory, 0, 0);
agiFs.Write("/mnt/test/ing/test", Types.WriteFlags.CREATEDIR, Types.FileTypes.Directory, 0, 0);
agiFs.Write("/mnt/test/ing/test/mnt", Types.WriteFlags.CREATEDIR, Types.FileTypes.Directory, 0, 0);
agiFs.Write("/mnt/test/again", Types.WriteFlags.CREATEDIR, Types.FileTypes.Directory, 0, 0);

var readMnt = agiFs.Read("/mnt");
console.log(readMnt);

var readMntTest = agiFs.Read("/mnt/test");
console.log(readMntTest);

var readMntTestIng = agiFs.Read("/mnt/test/ing");
console.log(readMntTestIng);

var readMntTestIng = agiFs.Read("/mnt/test/ing/test");
console.log(readMntTestIng);


var readMntTestIng = agiFs.Read("/mnt/test/ing/test/mnt");
console.log(readMntTestIng);

var readMntTestIng = agiFs.Read("/mnt/test/again");
console.log(readMntTestIng);

