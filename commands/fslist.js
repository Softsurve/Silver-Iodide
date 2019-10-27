import Command from "/core/AgI.js";

class fslist extends Command {
    constructor(agiSys) {
        super();
        this.agi = agiSys;
        this.appName = "fslist";
        this.version = "0.0.1";    
        this.consoleDiv = 0;
        this.form = "";
        this.currentLine = "";
    }

    main(arg)
    {
        var counter = 0;
        
        //parse list of available filesystems for the one we've been asked to mount
        while(counter < vfsList.length ) { 
            this.agi.printf(vfsList[counter].Name+"<br>");
            counter++;
        }
    }
}

export default fslist;