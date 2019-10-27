class Command {
    constructor(agiSys){
        this.AppName = "";
        this.Version = "0.0.1";
        this.Form = "<i>filename</i>";
        this.agi = agiSys;
    }

    main(args, line)
    {
    }
}

exports.Command = Command;