'use strict';

var Types = require("./types.js")
var FileSystem = require("./filesystem.js")
var FileNode = require("./filenode.js")
var Stdio = require("./stdio.js")

exports = module.exports = init;

function init() {
    return new agi();
}

class agi extends FileSystem.FileSystem {
    constructor () {
        super();
        this.stdio = new Stdio.Stdio("cmd");
        this.root = new FileNode.FileNode("/", Types.FileTypes.Directory);
    }

    Login(channel, username, password) {  
        var channelArray = channel.split(":");
    
        switch(channelArray[0]){
            case "#xmpp":
                this.mount(0,"xmppfs","/local/dev/xmpp",channelArray[1]+":"+channelArray[2]+":"+username+":"+password);
            break;
            default:
                return null;
        }
    }
    
    Error(error) {}
    
    Flush() {
        this.stdio.clearIO();
    }
    
    Mount(mode, fileSystem, mountPoint, args) {
        var workPath = "/";
        var aNode;
        var pathArray = mountPoint.split('/');
        var counter = 0;
    
        while (counter <= pathArray.length - 2)
        {
            if (workPath === "/")
                workPath = workPath + pathArray[counter];
            else
                workPath = workPath + '/' + pathArray[counter];
            counter++;
        }
    
        aNode = this.walk(workPath);
    
        if (aNode !== null && aNode.GetType() === Types.FileTypes.Directory )
        {           
            aNode.AddChild(new fileSystem());
    
            this.touched(aNode);
    
            return;
        }
        else {
            this.Error("Mount failed");
            return null;
        }
    }

    Printf(line) {
        this.stdio.Printf(line);
    }
}

exports.agi = {};