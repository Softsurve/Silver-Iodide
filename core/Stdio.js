
class Stdio {
    constructor(divId) {
        this.buffer = "";
        this.currentLine = "";
        this.consoleDiv = document.getElementById(divId);
    }

    ClearIO() {
        this.buffer = "";
    }

    printf(string) {
        this.buffer = this.buffer + string;
            
        if(this.consoleDiv !== 0) {
            this.consoleDiv.innerHTML = this.buffer;
        }
    }

    Redraw() {
        if(this.consoleDiv !== 0) {
            this.buffer = this.buffer.slice(0, this.buffer.length -1);
            this.consoleDiv.innerHTML = this.buffer;
        }
    }
}

export default Stdio;