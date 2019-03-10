class shell {
    constructor(ioSystem){
        this.appName = "shell";
        this.version = "0.0.1";
        this.consoleBanner = "AgI Console. ver"+this.consoleVersion+"<br>";
        this.consoleWelcome = "Type \"help\" for commands";    
        this.currentDirectory = "/";
        this.consoleDiv = 0;
        this.form = "";
        this.running = 0;
        this.stdio = ioSystem;//.Stdio;
        this.currentLine = "";//this.stdio.currentLine;
        this.cmdList = [];
        this.stdio.printf = this.stdio.Printf;
        this.printf = this.stdio.Printf;
        ioSystem.Printf(this.consoleBanner+"<br>"+this.consoleWelcome+"<br>");
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
            this.stdio.Printf("$ ");
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
        this.stdio.Printf("<br>");

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
                        this.stdio.printf(this.cmdList[count].appName+"  <br>");
                        this.stdio.printf(this.cmdList[count].form+"<br>");
                        
                        break;
                    }
                    else
                        count++;
                }       
            }
        }
        else if(cmdParts[0] === "cls" || cmdParts[0] === "clear")
        {
            this.stdio.ClearIO("stdOut");
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
                };
                count++;
            }
       
            this.stdio.printf("Command not found<br>");
        }
    }

    LoadCommand(command) {
        this.cmdList[this.cmdList.length] = command;
    }

    main(args) {
        this.running = 1;
        this.stdio.Printf(" $ " );
    }
}
export default shell