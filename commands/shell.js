class shell {
    constructor(agiSys){
        this.agi = agiSys;
        this.appName = "shell";
        this.version = "0.0.1";
        this.consoleBanner = "AgI Console. ver"+this.version+"<br>";
        this.consoleWelcome = "Type \"help\" for commands";    
        this.currentDirectory = "/";
        this.consoleDiv = 0;
        this.form = "";
        this.running = 0;
        this.stdio = agiSys.stdio;
        this.currentLine = "";
        this.cmdList = [];
        this.stdio.printf = this.stdio.Printf;
        this.printf = this.stdio.Printf;
    }

    KeyDown(event) {
        if(event.keyCode === 8){
            this.currentLine = this.currentLine.slice(0, this.currentLine.length -1);
            this.stdio.Redraw();
        }
    }

    KeyPress(event) {
        var keyCode = event.keyCode;

        if(keyCode === 13)
        {
            this.cmd(this.currentLine);
            this.agi.stdio.Printf("$ ");
            this.currentLine = "";
            return;
        }
        else if(keyCode === 8) {
 
            this.currentLine = this.currentLine.substring(0, shell.currentLine.length-1);
            this.stdio.Printf(this.buffer);
            return;
        }
        else
        {
            this.stdio.Printf(String.fromCharCode(keyCode) );
            this.currentLine = this.currentLine + String.fromCharCode(keyCode);
        }
    }

    cmd(line) {
        this.stdio.printf("<br>");

        var cmdParts = line.split(" ");
        
        if(cmdParts[0] === "help")
        {
            if(cmdParts.length === 1)
            {
                this.stdio.Printf("Available commands:<br>");
                var count = 0;
                while(count < this.cmdList.length)
                {
                    this.stdio.Printf(this.cmdList[count].appName+"<br>");
                    count++;
                }
            }
            else
            {              
                while(count < this.cmdList.length)
                {
                    if(this.cmdList[count].appName === this.cmdParts[1])
                    {
                        this.agi.Printf(this.cmdList[count].appName+"  <br>");
                        this.agi.Printf(this.cmdList[count].form+"<br>");
                        
                        break;
                    }
                    else
                        count++;
                }       
            }
        }
        else if(cmdParts[0] === "cls" || cmdParts[0] === "clear")
        {
            this.agi.Flush();//stdio.clearIO("stdOut");
            return;
        }
        else
        {
            count = 0;

            while(count < this.cmdList.length)
            {   
                if(this.cmdList[count].appName === cmdParts[0])
                {
                    this.cmdList[count].main(cmdParts,line);
                    return;
                }
                count++;
            }
       
            this.agi.printf("Command not found<br>");
        }
    }

    LoadCommand(command) {
        this.cmdList[this.cmdList.length] = command;
    }

    main(args) {
        this.agi.Printf(this.consoleBanner+"<br>"+this.consoleWelcome+"<br>");
        this.running = 1;
        this.agi.Printf(" $ " );
    }
}
export default shell