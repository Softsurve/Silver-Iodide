import Command from "/core/AgI.js";

class fsdump extends Command {
    constructor(agiSys) {
        super();
        this.agi = agiSys;
        this.appName = "fsdump";
        this.version = "0.0.1";     
        this.consoleDiv = 0;
        this.form = "<i>filename</i>";
        this.currentLine = "";
    }
    
    main(arg) {
        var dumpNode = 0;
        
        if(arg === "")
            dumpNode = this.agi.root;
        else
            dumpNode = this.agi.walk(arg[1]);

        this.agi.printf(dumpNode+"<br>");
        this.agi.printf("Name: "+dumpNode.Name+"<br>");
        this.agi.printf("Type: "+dumpNode.Type+"<br>");
        this.agi.printf("prev: "+dumpNode.prev+"<br>");
        this.agi.printf("next: "+dumpNode.next+"<br>");
        this.agi.printf("Data: "+dumpNode.Data+"<br>");
        this.agi.printf("Meta: "+dumpNode.meta+"<br>");
        this.agi.printf("Watchers: "+dumpNode.watchers+"<br>");

        if(arg[1] != "/")
        this.agi.printf("Parent: "+dumpNode.Parent.Name+"<br>");
    }
}

export default fsdump;