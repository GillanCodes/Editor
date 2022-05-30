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
    range.setStart(el.lastChild, (<any>el.lastChild).length)
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)

    lastSelect = el.id
}
const menuHtml =    "<ul> \
                        <li id='title'>Heading</li> \
                        <li id='paragraph'>Normal</li> \
                        <li id='picture'>Pic</li> \
                    </ul> \
                    <ul> \
                        <li id='bold'>Bold</li> \
                        <li id='italic'>Italic</li> \
                        <li id='underline'>Underline</li> \
                    </ul> \
                    <ul>  \
                        <li id='list'>List</li> \
                        <li id='code_block'>Code</li> \
                    </ul> \
                    <ul> \
                        <li id='text_left'>Left</li> \
                        <li id='text_center'>Center</li> \
                        <li id='text_right'>Right</li> \
                    </ul>";

const keyMap = {enter: 13, backSpace:8, arrowUp: 38, arrowDown: 40, ctrl: 17, shift: 16, tab: 9};
var dLnTry = 0;
var lastInput;
var lastSelect;
var lastText;

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
                            ln.contentEditable = "true";
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
        menuEle.innerHTML = menuHtml;
        menuEle.addEventListener('click', this.menuClickHandle)
        this.menu.replaceWith(menuEle)

    }

    createLine(child) {
        
        var ln = document.createElement('p');
            ln.id = uid();
            ln.className = "line";
            ln.contentEditable = "true";
            ln.innerText = '\n';
            this.element.insertBefore(ln, child);
            setCaret(ln.id)
        return ln
    }

    deleteLine(ln) {
        try {
            setCaret(ln.previousElementSibling.id)
        } catch (error) {
            setCaret(this.element.firstElementChild.id);
        }
        ln.remove();
    }

    onClick(event) { //Click Event
        if (event.target.id === this.element.id) {
            setCaret(event.target.childNodes[0].id);
        }

        if (event.target.className === "line") {
            lastSelect = event.target.id;
        }              
    }

    onKeyDown (event) {

        console.log(lastInput)

        switch(event.keyCode) {
            case keyMap.tab:
                event.preventDefault();
                break;
            case keyMap.enter:
                if (event.target.tagName === 'UL') {
                    event.preventDefault();
                    var listChild = document.createElement('li');
                        listChild.className = "line";
                        listChild.id = uid();
                        listChild.contentEditable = "true"
                        listChild.innerText = "\n"
                    event.target.appendChild(listChild);
                    setCaret(listChild.id)
                } else if (event.target.tagName === "PRE") {
                    if (lastInput === keyMap.shift) {
                        event.preventDefault();
                        this.createLine(event.target.nextElementSibling);
                    }
                } else {
                    event.preventDefault();
                    this.createLine(event.target.nextElementSibling);
                }
                
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
                    event.preventDefault();
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
                    if (ln.tagName == "UL" || ln.tagName == "PRE") {
                        if (ln.innerText === '\n') {
                            event.preventDefault();
                            this.deleteLine(ln)
                            this.createLine(this.element.firstChild)
                        }
                    } else if (ln.innerText === '\n'){
                        if (ln.previousElementSibling) {
                            event.preventDefault();
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
                input.type = "file";
                var label = document.createElement('label');
                    label.htmlFor = selected.id;
                    label.className = "UploadButton";
                    label.innerText = "+"
                input.addEventListener('change', (event) => {
                    var file = (<HTMLInputElement>event.target).files[0];
                    var blob = URL.createObjectURL(file);
                    var img = document.createElement('img');
                        img.className = "line";
                        img.id = selected.id;
                        img.src = blob;
                        img.contentEditable = "true"
                    divImage.replaceWith(img)
                })

                var divImage = document.createElement('div');
                    divImage.className = "line";
                    divImage.appendChild(label);
                    divImage.appendChild(input);

                selected.replaceWith(divImage)
                break;
            case 'list' :
                var selected = document.getElementById(lastSelect);
                var list =  document.createElement('ul');
                    list.className = "line";
                    list.id = selected.id;
                    list.contentEditable = "true";
                var listChild = document.createElement('li');
                    listChild.className = "line";
                    listChild.id = selected.id;
                    listChild.contentEditable = "true";
                    listChild.innerText = '\n';
                setCaret(listChild.id)
                list.appendChild(listChild);
                selected.replaceWith(list);
                break;
            case "code_block":
                var selected = document.getElementById(lastSelect);
                var block = document.createElement('pre')
                    block.className = "line code";
                    block.id = lastSelect;
                    block.contentEditable = "true";
                    block.innerText = selected.innerText;
                selected.replaceWith(block)
            case 'text_left':
                var selected = document.getElementById(lastSelect);
                selected.style.textAlign = "left"
                break;
            case 'text_center':
                var selected = document.getElementById(lastSelect);
                selected.style.textAlign = "center"
                break;
            case 'text_right':
                var selected = document.getElementById(lastSelect);
                selected.style.textAlign = "right"
                break;
            default:
                break;
        }
    } 

    onkeyup(event) {
        lastInput = event.keyCode
    }

    getContent() {
        return this.element.children;
    }

    setContent(content) {
        this.content = content
    }

}

module.exports = gcEditor;