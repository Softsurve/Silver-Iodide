'use strict';

var Types = require("./types.js");
var FileSystem = require("./filesystem.js");
var FileNode = require("./filenode.js");
var Stdio = require("./stdio.js");
var Command = require("./command.js");
var Channel = require("./channel.js");

exports = module.exports = init;

module.Command = Command;
module.Channel = Channel;

class test extends Command.Command {

}

function init() {
    return new agi();
}

class agi extends FileSystem.FileSystem {
    constructor () {
        super();
        this.stdio = new Stdio.Stdio("cmd");
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

    Printf(line) {
        this.stdio.Printf(line);
    }
}
