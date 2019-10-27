import Command from "/core/AgI.js";

class login extends Command {
    constructor(agiSys) {
        super();
        this.agi = agiSys;
        this.appName = "login";
        this.version = "0.0.1";
        
        this.consoleDiv = 0;
        this.form = "<i>username</i> <i>password</i> ";
        this.currentLine = "";
        this.step = 0;
        this.username = "";
        this.password = "";
    }

    login(username, password, url) {
        this.consoleDiv = document.getElementById("cmd");
        this.consoleDiv.innerHTML = "";

        if(this.loginAttempt < 3)
        {
            this.agi.stdio.printf(consoleBanner);
            this.agi.stdio.printf("Username:");
            this.loginAttempt = this.loginAttempt + 1;
        }
        else
        {
            this.agi.printf("You've struck out");
        }
    }

    input(keyCode) {
        if(keyCode == 13)
        {
            this.agi.stdio.buffer = stdio.buffer + "<br>";
            
            if(this.step === 0)
            {
                this.username = stdio.currentLine;
                this.step++;        }
            else if(this.step == 1)
            {
                this.agi.printf("Password: ");
                this.step++;
            }
            else
            {
                this.agi.printf("Logging on.....");
                this.step = 0;
                agi.login(login.username, login.password);
            }
    
            this.agi.stdio.currentLine = "";
            
            return;
        }
        else
        {
            this.agi.printf(String.fromCharCode(keyCode) );
            this.password = login.password + String.fromCharCode(keyCode);
            this.agi.stdio.currentLine = stdio.currentLine + String.fromCharCode(keyCode);
        }
    }
    
    main(args)
    {
        if( args[1] != "undefined" || args[2] != "undefined" || args[3] != "undefined") {
            this.agi.printf("login:" +  args[1] + " " + args[2] + " " + args[3] + "<br>");
            agi.login(args[1], args[2], args[3]);
        }
        else
            this.agi.printf(login.form + "<br>");
        
    }
    
    call(user,pass) {
        //agi.mount(0,"xmppfs", "/dev/message",user, pass,0); 
        this.agi.printf("login.call()");
        this.agi.printf(agi.login("#xmpp:softsurve.com:5280", user, pass));
    }
}

export default login;