var mount = {};

mount.appName = "mount";
mount.version = "0.0.1";

mount.form = "fsType, mountPoint, ";
mount.currentLine = "";

mount.main = function(arg)
{
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
    };
    //console.printf("mount: "+fs+" at: "+mountPoint+"<br>");
   //     console.printf(agi.mount(0,fs,mountPoint)+"<br>");
    agi.mount(0,this.fs,this.mountPoint);
};

mount.exec = mount.main;

export default mount;

