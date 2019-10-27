import Command from "/core/AgI.js";

class mount extends Command {
    constructor(agiSys) {
        super();
        this.agi = agiSys;
        this.appName = "mount";
        this.version = "0.0.1";
        this.form = "fsType, mountPoint, ";
        this.currentLine = "";
    }

    main(arg) {
        this.mountPoint = "/dev/fault";
        this.fs = "simplefs";
        this.flags = "";
        
        i = 0;
        while(i < arg.length) {
            if(arg[i] === "-p") {
                this.mountPoint = arg[i+1];
                i++;
            }
            else if(arg[i] === "-u") {
                i++;
            }
            else if(arg[i] === "-f") {
            // console.printf("FS= "+arg[i+1]+"<br>");
                this.fs = arg[i+1];
                i++;
            }        
            i++;   
        }
        //console.printf("mount: "+fs+" at: "+mountPoint+"<br>");
        //console.printf(agi.mount(0,fs,mountPoint)+"<br>");
        this.agi.mount(0,this.fs,this.mountPoint);
    }
}

export default mount;