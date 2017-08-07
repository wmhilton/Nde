import React from 'react'
import FolderIcon from './FolderIcon.js'
import FileList from './FileList.js'

import './style.css'

export default function Folder ({filename, open, ...props}) {
  // remove excess props to avoid warning, but allow any event handlers like onClick, onDoubleClick, etc through
  let {filepath, root, statedata, FolderComponent, FileComponent, glEventHub, glContainer, ...props2} = props
  return (
    <label {...props2}>
      <a target="#">
        <FolderIcon open={open}/>
        {filename}
      </a>
    </label>
  )
}