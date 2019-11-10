'use strict';

exports = module.exports = init;

function init() {
    return new TimeFs();
}

var Types = require("../../core/types.js");
var FileSystem = require("../../core/filesystem.js");
var FileNode = require("../../core/filenode.js");

class TimeFs extends FileSystem.FileSystem {
    constructor () {
        super();
        this.root = new FileNode.FileNode("/", Types.FileTypes.Directory);
    }
    
    Error(error) {}
    
    Flush() {
        this.stdio.clearIO();
    }
    
    Read(path) {
        return new FileNode.FileNode("time", Types.FileTypes.Text);

/*
        var retFile = new FileNode("time", Types.FileTypes.Text);
        retFile.PutData(new Date().toString());
        return retFile;
        */
    }
}

module.exports = TimeFs;