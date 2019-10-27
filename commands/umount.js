import Command from "/core/AgI.js";

class umount extends Command {
    constructor(agiSys) {
        super();
        this.appName = "umount";
        this.version = "0.0.1"; 
        this.form = "mountPoint, ";
        this.currentLine = "";
    }
    
    umount(arg)
    {
        //var mountPoint = "/dev/clock";
        //agi.umount(mountPoint);
    }
}

export default umount;