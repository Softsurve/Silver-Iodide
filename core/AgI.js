import Types        from "/core/Types.js";
import FileSystem   from "/core/FileSystem.js";
import FileNode     from "/core/FileNode.js";
import Stdio        from "/core/Stdio.js";

class AgI extends FileSystem {
    constructor() {
        super();
        this.stdio = new Stdio("cmd");
        this.root = new FileNode("/", Types.FileTypes.Directory);

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

    KeyDown(keyCode) {
        this.Stdio.input(keyCode);
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

    Printf(line)
    {
        this.stdio.Printf(line);
    }

    Shutdown() {
        return 0;
    }
}

export default AgI;