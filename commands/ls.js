import Command from "/core/AgI.js";

class ls  extends Command {
      constructor(agiSys) {
            super();

            this.agi = agiSys;
            this.appName = "ls";
            this.version = "0.0.1";
            this.consoleDiv = 0;
            this.form = "usage:<br>list <i>path</i><br>";
            this.currentLine = "<i>directory</i>";;
      }

      main(arg) {
            if(arg === null | arg === undefined | arg.length < 2)
            {
                  this.agiSys.Printf(this.form);
                  return;
            }

            var buffer = this.agi.read(arg[1],0,0,0);
            
            var count = 0;

            if( buffer != null && buffer.Type === 1){ 
                  if(buffer.GetDirList().length === 0)
                        this.agi.Printf("Empty Diretory<br>");

                  while(count < buffer.GetDirList().length) {
                        if(buffer.GetDirList()[count].GetName() !== "") {	
                              if(buffer.GetDirList()[count].Type === 1)
                                    this.agi.Printf("<b style=\"color:blue\">");
                              else if(buffer.GetDirList()[count].GetType() === 2 || buffer.GetDirList()[count].GetType() === 3)
                                    this.agi.Printf("<b style=\"color:cyan\">");                   
                              else if(buffer.GetDirList()[count].GetType() === 4)
                                    this.agi.Printf("<b style=\"color:red\">");  
                              else if(buffer.GetDirList()[count].GetType() === 5 || buffer.GetDirList()[count].GetType() === 6)
                                    this.agi.Printf("<b style=\"color:green\">");                         
                                    this.agi.Printf(buffer.GetDirList()[count].GetName());
                                    this.agi.Printf("</b><br>");
                        }
                        count++;
                  }
            }
            else
                  this.agi.Printf("File "+arg[1]+" is not a directory<br>");
      }
}

export default ls;