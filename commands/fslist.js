var fslist = {};

fslist.appName = "fslist";
fslist.version = "0.0.1";

fslist.consoleDiv = 0;
fslist.form = "";;
fslist.currentLine = "";

fslist.main = function(arg)
{
    var counter = 0;
    
    //parse list of available filesystems for the one we've been asked to mount
    while(counter < vfsList.length ) { 
        console.printf(vfsList[counter].Name+"<br>");
        counter++;
    }
};

fslist.exec = fsdump.main;

export default fslist;