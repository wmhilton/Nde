import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import SplitterLayout from 'react-splitter-layout'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'

import {FileIcon} from 'react-file-browser'

import { activateTab, closeTab, moveTab, newTab, undo, redo } from './store.js'

import TryComponent from './TryCatchHOC.js'
import FileNavigator from './FileNavigator/FileNavigator.js'
import FileEditor from './FileEditor/index.js'
import FileViewer from './FileViewer/index.js'

const TryFileNavigator = TryComponent(FileNavigator)
const TryFileEditor = TryComponent(FileEditor)
const TryFileViewer = FileViewer // TryComponent(FileViewer)

const activeTabStyle = {color: 'white', background: '#1e1e1e', border: '1px solid', borderBottom: 'none', borderTopLeftRadius: '10px'}
const inactiveTabStyle = {color: '#6d6d6d', background: '#000000', border: '1px solid', borderBottom: 'none', borderTopLeftRadius: '10px'}

const Tab = ({currentIndex: index, filepath, active, onTabClick, onTabClose}) => {
  if (active) {
    return <li style={{
      display: 'inline-block',
      padding: '5px',
      whiteSpace: 'nowrap',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      ...activeTabStyle
    }}
    title={filepath}
    onClick={() => onTabClick({index, filepath})}>
      <i className="fa fa-window-close" onClick={(e) => { e.stopPropagation(); onTabClose({filepath}) }}></i>
      {' ' + path.basename(filepath)}
    </li>
  } else {
    return <li style={{
      display: 'inline-block',
      padding: '5px',
      whiteSpace: 'nowrap',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      ...inactiveTabStyle
    }}
    title={filepath}
    onClick={() => onTabClick({index, filepath})}>
      <FileIcon style={{verticalAlign: 'unset'}} filename={filepath} />
      {path.basename(filepath)}
    </li>
  }
}

const SortableTab = SortableElement(Tab)

const TabList = ({items, onTabClick, onTabClose}) => (
  <ul style={{display: 'block', padding: 0, margin: 0, lineHeight: 0, color: '#4078c0', background: 'black', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'}}>
    {
      items.map(
        (item, index) =>
          <SortableTab key={`item-${index}`}
            index={index}
            currentIndex={index}
            filepath={item.filepath}
            active={item.active}
            onTabClick={onTabClick}
            onTabClose={onTabClose}
          />
      )
    }
  </ul>
)
const SortableTabList = SortableContainer(TabList)

const mapStateToProps = (state) => {
  return {
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    activeFilepath: state.present.activeFilepath,
    openFiles: state.present.openFiles.map(x => ({...x, active: x.filepath === state.present.activeFilepath}))
  }
}
const mapDispatchToProps = (dispatch) => ({
  onTabReorder ({oldIndex, newIndex}) {
    dispatch(moveTab(oldIndex, newIndex))
  },
  onTabClick ({filepath}) {
    dispatch(activateTab(filepath))
  },
  onTabClose ({filepath}) {
    dispatch(closeTab(filepath))
  },
  onTabOpen (filepath) {
    dispatch(newTab(filepath))
  },
  onUndo () {
    dispatch(undo())
  },
  onRedo () {
    dispatch(redo())
  }
})

class App extends React.Component {
  componentDidMount () {
    EventHub.on('openFile', this.props.onTabOpen)
  }
  render () {
    return (
      <article>
        <style>{`
      .splitter-layout .layout-pane {
        overflow: unset;
      }`}
        </style>
        <SplitterLayout primaryIndex={1} secondaryInitialSize={250}>
          <TryFileNavigator root="/"/>
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <SortableTabList items={this.props.openFiles} axis="x" lockAxis="x" lockToContainerEdges={true} lockOffset="0%" distance={25} onSortEnd={this.props.onTabReorder} onTabClick={this.props.onTabClick} onTabClose={this.props.onTabClose}/>
              <div style={{color: 'white'}}>
                <button title="Undo" disabled={!this.props.canUndo} style={{color: this.props.canUndo ? 'white' : 'grey', background: 'none', border: 'none'}} onClick={this.props.onUndo}><i className="fa fa-fw fa-undo"></i></button>
                <button title="Redo" disabled={!this.props.canRedo} style={{color: this.props.canRedo ? 'white' : 'grey', background: 'none', border: 'none'}} onClick={this.props.onRedo}><i className="fa fa-fw fa-repeat"></i></button>
                <a norel nofollower noopener target="_blank" href="https://github.com/wmhilton/nde/commits/master"><button title="Commits" style={{color: 'white', background: 'none', border: 'none'}}><i className="fa fa-fw fa-github"></i></button></a>
              </div>
            </div>
            <SplitterLayout primaryIndex={1} percentage={true} primaryInitialSize={50} secondaryInitialSize={50}>
              <TryFileEditor filepath={this.props.activeFilepath}/>
              <TryFileViewer filepath={this.props.activeFilepath}/>
            </SplitterLayout>
          </div>
        </SplitterLayout>
      </article>
    )
  }
}

const SmartApp = connect(mapStateToProps, mapDispatchToProps)(App)

export default SmartApp
