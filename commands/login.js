var login = {};

login.appName = "login";
login.version = "0.0.1";

login.consoleDiv = 0;
login.form = "<i>username</i> <i>password</i> ";
login.currentLine = "";

login.init = function()
{
    consoleDiv = document.getElementById("cmd");
    consoleDiv.innerHTML = "";
    if(loginAttempt < 3)
    {
        stdio.printf(consoleBanner);
        stdio.printf("Username:");
        loginAttempt = loginAttempt + 1;
    }
    else
    {
        stdio.printf("You've struck out");
    }
};

login.step = 0;
login.username = "";
login.password = "";

login.input = function(keyCode)
{
    if(keyCode == 13)
    {
        stdio.buffer = stdio.buffer + "<br>";
        
        if(login.step === 0)
        {
            login.username = stdio.currentLine;
            login.step++;        }
        else if(login.step == 1)
        {
            stdio.printf("Password: ");
            login.step++;
        }
        else
        {
            stdio.printf("Logging on.....");
            login.step = 0;
            agi.login(login.username, login.password);
        }

        stdio.currentLine = "";
        
        return;
    }
    else
    {
        stdio.printf(String.fromCharCode(keyCode) );
        login.password = login.password + String.fromCharCode(keyCode);
        stdio.currentLine = stdio.currentLine + String.fromCharCode(keyCode);
    }
};

login.main = function(args)
{

    if( args[1] != "undefined" || args[2] != "undefined" || args[3] != "undefined") {
        console.printf("login:" +  args[1] + " " + args[2] + " " + args[3] + "<br>");
        agi.login(args[1], args[2], args[3]);
    }
    else
        console.printf(login.form + "<br>");
    
};

login.call = function(user,pass) {
    //agi.mount(0,"xmppfs", "/dev/message",user, pass,0); 
    console.printf("login.call()");
    console.printf(agi.login("#xmpp:softsurve.com:5280", user, pass));
}

login.exec = login.main;

export default login;

