function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2); 
}

function setCaret(lineId) {
    var el = document.getElementById(lineId)
    var range = document.createRange()
    var sel = window.getSelection()

    console.log(el.childNodes)
    
    range.setStart(el.childNodes[0], 0)
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
}

const keyMap = {enter: 13, backSpace:8, arrowUp: 38, arrowDown: 40};
var dLnTry = 0;

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
            ln.innerHTML = "New Content"
            this.element.appendChild(ln);
            setCaret(ln.id)
        return ln
    }

    deleteLine(lineId) {
        var ln = document.getElementById(lineId);
        if (ln.innerText === '\n'){
            dLnTry = dLnTry+1
            if (dLnTry == 2) {
                ln.remove();
            }
        } else {
            dLnTry = 0;
        }
        console.log(dLnTry)
    }

    onkeyup(event) {
        console.log(event.keyCode, "-> Key =>", event.key)

        if (event.keyCode != keyMap.backSpace) {
            dLnTry = 0
        }

        switch(event.keyCode) {
            case keyMap.enter:
                this.createLine();
                break;
            case keyMap.backSpace:
                this.deleteLine(event.target.id)
                break
            default:
                break
        }
    }

    getContent() {
        return this.element.childNodes;
    }

    setContent(content) {
        this.content = content
    }

}