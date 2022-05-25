interface content {
    src: string;
    tag:string,
    text:string
    id: string,
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2); 
}

function setCaret(lineId) {
    var el = document.getElementById(lineId)
    var range = document.createRange()
    var sel = window.getSelection()
    range.setStart(el.lastChild, 0)
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
}

const keyMap = {enter: 13, backSpace:8, arrowUp: 38, arrowDown: 40, ctrl: 17, tab: 9};
var dLnTry = 0;
var lastInput;
var lastSelect;

class gcEditor {
    element: HTMLElement
    content: string[]
    menu: HTMLElement;

    constructor ({editor, menu, content}) {
        this.element = document.getElementById(editor),
        this.menu = document.getElementById(menu)
        this.content = content;
        this.onkeyup = this.onkeyup.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.menuClickHandle = this.menuClickHandle.bind(this);

        return this
    }

    init() {

        if (this.element == null)
            throw Error("'editor' params do not exist")
        if (this.element.tagName !== "DIV")
            throw Error("'editor' params must be an ID of a 'Div' element !")
    
        if(this.content == undefined) {
            this.createLine(this.element.firstChild);
        } else {

            this.content.map((line) => {
                
                    if ((<content><unknown>line).tag === "IMG") {
                        var img = document.createElement("img");
                            img.src = (<content><unknown>line).src;
                            img.className = "line"
                            img.id = (<content><unknown>line).id;
                            img.contentEditable = "true"
                        this.element.appendChild(img)
                    } else {
                        var ln = document.createElement((<content><unknown>line).tag);
                            ln.innerHTML = (<content><unknown>line).text;
                            ln.className = "line"
                            ln.id = (<content><unknown>line).id;
                            ln.contentEditable = "true"
                        this.element.appendChild(ln)
                    }
                    
            })


        }

        document.addEventListener('keyup', this.onkeyup);
        document.addEventListener('click', this.onClick);
        document.addEventListener('keydown', this.onKeyDown);
        


        if (this.menu == null)
            throw Error("'menu' params do not exist")
        if (this.menu.tagName !== "DIV")
            throw Error("'menu' params must be an ID of a 'Div' element !")

        var menuEle = document.createElement("div")
        menuEle.className = "menu"
        menuEle.innerHTML = "<ul><li id='title'>Heading</li><li id='paragraph'>Normal</li><li id='picture'>Pic</li></ul><ul><li>button</li></ul>";
        menuEle.addEventListener('click', this.menuClickHandle)
        this.menu.replaceWith(menuEle)

    }

    createLine(child) {
        
        var ln = document.createElement('p');
            ln.id = uid();
            ln.className = "line";
            ln.contentEditable = "true";
            ln.innerText = "\n"
            this.element.insertBefore(ln, child);
            setCaret(ln.id)
        return ln
    }

        


    deleteLine(ln) {
        try {
            setCaret(ln.previousElementSibling.id)
        } catch (error) {
            setCaret(this.element.firstElementChild.id)
        }
        ln.remove();
    }

    onClick(event) {
        //setCaret(event.target)
        if (event.target.id === this.element.id) {
            setCaret(event.target.childNodes[0].id);
        }

        if (event.target.className === "line") {
            lastSelect = event.target.id;
        }
    }

    onKeyDown (event) {

        switch(event.keyCode) {
            case keyMap.tab:
                event.preventDefault();
                break;
            case keyMap.enter:
                event.preventDefault();
                this.createLine(event.target.nextElementSibling);
                break;
            case keyMap.arrowUp:
                event.preventDefault();
                if (event.target.previousElementSibling){
                    setCaret(event.target.previousElementSibling.id);
                }
                break;
            case keyMap.arrowDown:
                event.preventDefault();
                if (event.target.nextElementSibling){
                    setCaret(event.target.nextElementSibling.id);
                }
                break;
            case keyMap.backSpace:
                var ln = document.getElementById(event.target.id);
                if (ln === null) {
                    if (lastSelect) {
                        var notALine = document.getElementById(lastSelect)
                        if (notALine.tagName === "IMG") {
                            if (notALine.previousElementSibling) {
                                this.deleteLine(notALine);
                            } else {
                                this.createLine(notALine);
                                this.deleteLine(notALine)
                            }
                        }
                        
                    }
                } else {
                    if (ln.innerText === ''){
                        if (ln.previousElementSibling) {
                            this.deleteLine(ln)
                        }
                    }
                }
                break
            default:
                break
        }

    }

    menuClickHandle(event) {
        switch(event.target.id){
            case 'title':
                var selected = document.getElementById(lastSelect);
                var heading =  document.createElement('h1');
                heading.className = "line";
                heading.id = selected.id;
                heading.innerHTML = selected.innerHTML;
                heading.contentEditable = "true"
                selected.replaceWith(heading)
                break;
            case 'paragraph':
                var selected = document.getElementById(lastSelect);
                var paragraph =  document.createElement('p');
                paragraph.className = "line";
                paragraph.id = selected.id;
                paragraph.innerHTML = selected.innerHTML;
                paragraph.contentEditable = "true"
                selected.replaceWith(paragraph)
                break;
            case 'picture':
                var selected = document.getElementById(lastSelect);
                var input =  document.createElement('input');
                input.className = "line";
                input.id = selected.id;
                input.type = "file"
                input.addEventListener('change', (event) => {

                    var file = (<HTMLInputElement>event.target).files[0];
                    var blob = URL.createObjectURL(file);
                    var img = document.createElement('img');
                        img.className = "line";
                        img.id = selected.id;
                        img.src = blob;
                        img.contentEditable = "true"
                    input.replaceWith(img)
                })
                selected.replaceWith(input)
                break;
            default:
                break;
        }
    } 

    onkeyup(event) {
        
    }

    getContent() {
        return this.element.children;
    }

    setContent(content) {
        this.content = content
    }

}

module.exports = gcEditor;