/**
 * @file Handles setting title of a new document.
 */

import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class DocumentPrompt extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
        }
    };

    onSubmit(e) {
        this.props.options(this.state.title)
    };

    render() {
        return(
            <div className='register'>
                <TextField hintText="Title" value={this.state.title} onChange={e => this.setState({title: e.target.value})} />
                <RaisedButton onMouseDown={e => this.onSubmit(e)} label='Create document' primary={true} />
            </div>
        )
    };
}
