import Command from "/core/AgI.js";
import Types from "/core/Types.js";

class write extends Command {
    constructor(agiSys) {
        super();
        write.appName = "write";
        write.version = "0.0.1";

        write.consoleDiv = 0;
        write.form = "<i>new filename</i> <i>new file contents</i>";
        write.currentLine = "";
    }
    main(arg, line) {
        //var args = line.split(" ");
        //var path = "";
        //var fileData=0;

        //agi.write(arg[1],2,arg[2]);
        this.agi.write(arg[1], Types.WriteFlags.CREATEDATAFILE, arg[2], 0, 0);
    }
}
export default write;
