/**
 * @file Individual document/editor.
 */

import React from 'react';
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import ColorPicker, { colorPickerPlugin } from 'draft-js-color-picker';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import io from 'socket.io-client';
import Typography from '@material-ui/core/Typography';

const socket = io('http://localhost:3000');

const styleMap = {
    'UPPERCASE': {
        textTransform: 'uppercase'
    },
    'LOWERCASE': {
        textTransform: 'lowercase'
    }
};

const presetColors = [
    '#ff00aa',
    '#F5A623',
    '#F8E71C',
    '#8B572A',
    '#7ED321',
    '#417505',
    '#BD10E0',
    '#9013FE',
    '#4A90E2',
    '#50E3C2',
    '#B8E986',
    '#000000',
    '#4A4A4A',
    '#9B9B9B',
    '#FFFFFF',
];

export default class Document extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState: EditorState.createEmpty(),
            dropDownValue: 1,
            shareMode: false
        }
        this.onChange = (editorState) => {
            socket.emit('syncDocument', {
                docId: this.props.options._id,
                raw: convertToRaw(editorState.getCurrentContent())
            })
            this.setState({ editorState }, () => {
                socket.emit('syncDocument', {
                    docId: props.options._id,
                    rawState: convertToRaw(editorState.getCurrentContent())
                })
            });
        };
        if(!props.options.content) this.state.editorState = EditorState.createEmpty()
        else this.state.editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(props.options.content)))
        this.getEditorState = () => this.state.editorState
        this.picker = colorPickerPlugin(this.onChange, this.getEditorState)
        this.remoteStateChange = this.remoteStateChange.bind(this)
    };

    toggleInlineStyle(e, inlineStyle) {
        e.preventDefault()
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
    };

    toggleBlockType(e, blockType) {
        e.preventDefault()
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
    };

    toggleDropDown(e, value) {
        e.preventDefault()
        this.setState({dropDownValue: value})
    };

    componentDidMount() {
        socket.emit('openDocument', {docId: this.props.options._id})
        socket.on('syncDocument', this.remoteStateChange)
        fetch(`http://localhost:3000/document/${this.props.options._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        }).then(res => res.json()).then(document =>  {
                if(document.content.trim()) this.remoteStateChange(JSON.parse(document.content))
            })
    };

    componentWillUnmount() {
        socket.emit('closeDocument', {docId: this.props.options._id})
        socket.off('syncDocument', this.remoteStateChange)
    };

    onSave(e) {
        fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                newContent: convertToRaw(this.state.editorState.getCurrentContent()),
                id: this.props.options._id
            })
        })
    };

    setShareMode(b) {
        this.setState({shareMode: b})
    };

    remoteStateChange(content) {
        if(!content) return
        this.setState({editorState: EditorState.createWithContent(convertFromRaw(content))});
    };

    render() {
        const { editorState } = this.state
        return (
            <div>
                <Toolbar>
                    <ToolbarGroup>
                        <IconButton iconClassName='material-icons' onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}>format_bold</IconButton>
                        <IconButton iconClassName='material-icons' onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}>format_italic</IconButton>
                        <IconButton iconClassName='material-icons' onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}>format_underlined</IconButton>
                        <IconButton iconClassName='material-icons' onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}>strikethrough_s</IconButton>
                        <IconButton iconClassName='material-icons' onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>format_size</IconButton>
                        <IconButton iconClassName='material-icons' onMouseDown={(e) => this.toggleBlockType(e, 'unordered-list-item')}>format_list_bulleted</IconButton>
                        <IconButton iconClassName='material-icons' onMouseDown={(e) => this.toggleBlockType(e, 'ordered-list-item')}>format_list_numbered</IconButton>
                        <ColorPicker toggleColor={color => this.picker.addColor(color)}
                            presetColors={presetColors} color={this.picker.currentColor(this.state.editorState)} />
                        <DropDownMenu value={this.state.dropDownValue} onChange={this.toggleDropDown.bind(this)} >
                            <MenuItem value={1} primaryText='h1' onMouseDown={(e) => this.toggleBlockType(e, 'header-one')}/>
                            <MenuItem value={2} primaryText='h2' onMouseDown={(e) => this.toggleBlockType(e, 'header-two')}/>
                            <MenuItem value={3} primaryText='h3' onMouseDown={(e) => this.toggleBlockType(e, 'header-three')}/>
                            <MenuItem value={4} primaryText='h4' onMouseDown={(e) => this.toggleBlockType(e, 'header-four')}/>
                            <MenuItem value={5} primaryText='h5' onMouseDown={(e) => this.toggleBlockType(e, 'header-five')}/>
                            <MenuItem value={6} primaryText='h6' onMouseDown={(e) => this.toggleBlockType(e, 'header-six')}/>
                        </DropDownMenu>
                        <IconButton iconClassName='material-icons' onMouseDown={(e) => this.toggleBlockType(e, 'blockquote')}>format_quote</IconButton>
                        <IconButton iconClassName='material-icons' onMouseDown={(e) => this.toggleBlockType(e, 'code-block')}>code</IconButton>
                        <ToolbarSeparator />
                        <RaisedButton label='Save' onMouseDown={e => this.onSave(e)} primary={true} />
                        <RaisedButton label='Share' onMouseDown={e => this.setShareMode(true)} />
                    </ToolbarGroup>
                </Toolbar>
                {this.state.shareMode ?
                    <Toolbar>
                        <Typography variant='body2' gutterBottom>{this.props.options._id}</Typography>
                    </Toolbar>
                     : null}
                <div className='editor'>
                    <Editor editorState={editorState}
                        ref='editor'
                        onChange={this.onChange}
                        customStyleMap={styleMap}
                        customStyleFn={this.picker.customStyleFn}
                    />
                </div>
            </div>
        )
    };
}
