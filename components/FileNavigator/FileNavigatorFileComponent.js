import React from 'react'
import {File, FileIcon} from 'react-file-browser'
import Octicon from 'react-octicons-modular'
import { ContextMenu, SubMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import fs from 'fs'
import path from 'path'
import pify from 'pify'
import cuid from 'cuid'
import { DragSource } from 'react-dnd'

import ContextMenuFile from './ContextMenuFile'
import StatusIcon from './StatusIcon'

class FileNavigatorFileComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      cuid: cuid()
    }
  }
  doubleclick () {
    EventHub.emit('openFile', this.props.filepath)
  }
  render () {
    let {disableContextMenu, filename, filepath, fileMap, connectDragSource, connectDragPreview, isDragging, connectDropTarget, isDraggingOver, ...passedProps} = this.props
    let file = connectDragSource(connectDragPreview(
      <div>
        <File filename={filename} domProps={{onDoubleClick: this.doubleclick.bind(this)}}>
          &nbsp;<StatusIcon status={fileMap && fileMap[filepath] && fileMap[filepath].gitstatus || 'unmodified'} />
        </File>
      </div>
    ))
    return (
      <ContextMenuFile filepath={filepath} disable={disableContextMenu}>
        {file}
      </ContextMenuFile>
    )
  }
}

const ItemTypes = {
  FILE: 'file',
  FOLDER: 'folder'
}
const fileSource = {
  beginDrag (props) {
    return {
      filename: props.filename,
      filepath: props.filepath
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

export default DragSource(ItemTypes.FILE, fileSource, collect)(
  FileNavigatorFileComponent
)
