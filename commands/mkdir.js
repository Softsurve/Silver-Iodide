import Command from "/core/AgI.js";
import Types from "/core/Types.js";

class mkdir extends Command {
    constructor(agiSys) {
        super();
        this.agi = agiSys;
        this.appName = "ls";
        this.version = "0.0.1";
        this.consoleDiv = 0;
        this.form = "usage:<br>list <i>path</i><br>";
        this.currentLine = "<i>directory</i>";
        this.appName = "mkdir";
    }

    main(arg)
    {
        this.agi.write(arg[1], Types.WriteFlags.CREATEDIR, "1", 0, 0);
    }
}

export default mkdir;