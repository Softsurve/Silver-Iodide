'use strict';

function init(){
    return new Stdio();
}

class Stdio {
    constructor(divId) {
        this.buffer = "";
        this.currentLine = "";
    }

    ClearIO() {
        this.buffer = "";
    }

    Printf(string) {
        this.buffer = this.buffer + string;
    }

    redraw() {
        if(this.consoleDiv !== 0) {
            this.buffer = this.buffer.slice(0, this.buffer.length -1);
            this.consoleDiv.innerHTML = this.buffer;
        }
    }
}

exports.Stdio = Stdio;