/**
 * @file List of documents owned or shared with user. 
 */

import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500} from 'material-ui/styles/colors';
import Typography from '@material-ui/core/Typography';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class DocumentList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: []
        }
    };

    componentDidMount() {
        fetch('http://localhost:3000/documentList', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
        }).then(res => res.json()).then(result => this.setState({list: result}))
    };    

    openDocument(item) {
        this.props.redirect('Document', item)
    };

    onChange(e) {
        e.preventDefault()
        this.setState({joinDocId: e.target.value})
    };

    join(e) {
        fetch('http://localhost:3000/joinDocument?id=' + this.state.joinDocId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
        }).then(res => {
            this.setState({joinDocId: ''})
            this.componentDidMount()
        })
    };

    render() {
        return(
            <div className='register'><br />
                <Typography variant='title' gutterBottom>Files</Typography><br />
                <TextField value={this.state.joinDocId} onChange={e => this.onChange(e)} hintText='Shareable ID' /><br />
                <RaisedButton label='Join' onMouseDown={e => this.join(e)} /><br />
                <List>
                    {this.state.list.map(item => 
                    <ListItem
                    leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
                    primaryText = {item.title}
                    secondaryText = {'Created at ' + item.timeOfCreation}
                    onMouseDown={e => this.openDocument(item)}
                    />)}
                </List>
            </div>
        )
    }
}