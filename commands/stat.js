import Command from "/core/AgI.js";

class stat extends Command {
    constructor(agiSys) {
        super();
        this.agi = agiSys;
        this.appName = "stat";
        this.version = "0.0.1";    
        this.consoleDiv = 0;
        this.form = "usage:<br>stat <i>path</i><br>";
        this.currentLine = "";
    }

    main(args)
    {
        if(args == null)
        {
            printf(stat.form);
            return;
        }
        
        printf( vfs.stat(args) );
    }
}

export default stat;