function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2); 
}

function setCaret(lineId) {
    var el = document.getElementById(lineId)
    var range = document.createRange()
    var sel = window.getSelection()

    console.log(el.childNodes)
    console.log(el.innerText.length)
    range.setStart(el.childNodes[0], 0)
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
}

const keyMap = {enter: 13, backSpace:8, arrowUp: 38, arrowDown: 40, ctrl: 17};
var dLnTry = 0;
var lastInput;

class gcEditor {
    element: Element
    content: string[]

    constructor ({editor, content}) {
        this.element = document.getElementById(editor),
        this.content = content;
        this.onkeyup = this.onkeyup.bind(this);
    }

    init() {

        if (this.element == null)
            throw Error("'editor' params do not exist")
        if (this.element.tagName !== "DIV")
            throw Error("'editor' params must be an ID of a 'Div' element !")
    
        if(this.content == undefined) {
            this.createLine();
        }

        document.addEventListener('keyup', this.onkeyup)
        

    }

    createLine() {
        var ln = document.createElement('p');
            ln.id = uid();
            ln.className = "line";
            ln.contentEditable = "true";
            ln.innerText = "\n"
            this.element.appendChild(ln);
            setCaret(ln.id)
        return ln
    }

    deleteLine(ln) {

        setCaret(ln.previousElementSibling.id)
        ln.remove();
        
    }

    onkeyup(event) {
        event.preventDefault();
        console.log(event.keyCode, "-> Key =>", event.key)

        if (event.keyCode != keyMap.backSpace) {
            dLnTry = 0
        }


        console.log(lastInput, event.keyCode)
        //ctrl + d
        if (lastInput == keyMap.ctrl && event.keyCode == 68) {
           this.deleteLine(document.getElementById(event.target.id))
        }

        switch(event.keyCode) {
            case keyMap.enter:
                event.preventDefault();
                this.createLine();
                break;
            case keyMap.backSpace:
                var ln = document.getElementById(event.target.id);
                if (ln.innerText === '\n'){
                    dLnTry = dLnTry+1
                    if (dLnTry == 2) {
                        if (ln.previousElementSibling) {
                            this.deleteLine(ln)
                        }
                        dLnTry = 0              
                    }
                } else {
                    dLnTry = 0;
                }
                // this.deleteLine(event.target.id)
                break
            default:
                break
        }

        lastInput = event.keyCode;
    }

    getContent() {
        return this.element.childNodes;
    }

    setContent(content) {
        this.content = content
    }

}