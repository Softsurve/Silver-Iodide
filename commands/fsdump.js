var fsdump = {};

fsdump.appName = "fsdump";
fsdump.version = "0.0.1";

fsdump.consoleDiv = 0;
fsdump.form = "<i>filename</i>";;
fsdump.currentLine = "";

fsdump.main = function(arg)
{
        var dumpNode = 0;
        
        if(arg === "")
            dumpNode = rootfs;
        else
            dumpNode = agi.walk(arg[1]);
    
    
    
        console.printf(dumpNode+"<br>");
        console.printf("Name: "+dumpNode.Name+"<br>");
        console.printf("Type: "+dumpNode.Type+"<br>");
        console.printf("prev: "+dumpNode.prev+"<br>");
        console.printf("next: "+dumpNode.next+"<br>");
        console.printf("Data: "+dumpNode.Data+"<br>");
        console.printf("Meta: "+dumpNode.meta+"<br>");
        console.printf("Watchers: "+dumpNode.watchers+"<br>");
        if(arg[1] != "/")
            console.printf("Parent: "+dumpNode.Parent.Name+"<br>");
};

fsdump.exec = fsdump.main;

export default fsdump;