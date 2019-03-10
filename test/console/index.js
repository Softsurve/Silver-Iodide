import AgI   from "/core/AgI.js";
import Shell from "/commands/shell.js"
import Cat   from "/commands/cat.js"
import FsDump from "/commands/fsdump.js"
import Login from "/commands/login.js"
import Ls from "/commands/ls.js"
import MkDir from "/commands/mkdir.js"
import Mount from "/commands/mount.js"
import Stat from "/commands/stat.js"
import Write from "/commands/write.js"

var agi = new AgI();
var agiShell = new Shell(agi);

agiShell.LoadCommand(new Cat(agi));
agiShell.LoadCommand(FsDump);
agiShell.LoadCommand(Login);
agiShell.LoadCommand(new Ls(agi));
agiShell.LoadCommand(new MkDir(agi));
agiShell.LoadCommand(Mount);
agiShell.LoadCommand(Stat);
agiShell.LoadCommand(new Write(agi));

agiShell.main();

window.addEventListener('mousedown', function(e) {});

window.addEventListener('keydown', function(e) {
    if(e.keyCode === 8){
        agiShell.KeyDown(e);
        e.preventDefault();
    }
});

window.addEventListener('keypress', function(e) {
    agiShell.KeyPress(e);
    e.preventDefault();
});

window.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
        agiShell.OnClick(e);
        e.preventDefault();
    }
});

window.onerror = function(message, source, line, col, error) {
    var text = error ? error.stack || error : message + ' (at ' + source + ':' + line + ':' + col + ')';
    //agi.Error(text);
};
