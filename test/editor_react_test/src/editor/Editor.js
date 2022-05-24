import React, { useEffect } from 'react';
import editor from "./index"

const load = () => {


    const test = new Gceditor({
        editor: "gc-editor",
        menu: "gc-menu"
    })

    test.init();
}

export default function EditorPage() {

  return (
    <div onClick={load}>
        <h1>Click</h1>
        <div id="gc-menu"></div>
        <div className="editor" id="gc-editor"></div>
    </div>
  )
}

