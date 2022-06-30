import React, { useEffect } from 'react';
import Gceditor from "./index"

const load = () => {

    const test = new Gceditor({
        editor: "gc-editor",
        menu: "gc-menu"
    })

    test.init();
}

export default function EditorPage() {

  useEffect(() =>  {
    load()
  }, [])

  return (
    <div>
        <div id="gc-menu"></div>
        <div className="editor" id="gc-editor"></div>
    </div>
  )
}

