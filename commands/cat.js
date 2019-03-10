import Command from "/core/AgI.js";

class cat extends Command {
    constructor(agiSys) {
        super();
        this.agi = agiSys;
        this.appName = "cat";
        this.version = "0.0.1";

        this.consoleDiv = 0;
        this.form = "<i>filename</i>";
        this.currentLine = "";
    }

    main(arg) {
        var buffer = this.agi.read(arg[1],0,0,0);

        if(buffer.Type === 2)
            this.agi.Printf(buffer.GetData()+"<br>");
        else
            this.agi.Printf("Not a Character File<br>");
    }
}

export default cat;