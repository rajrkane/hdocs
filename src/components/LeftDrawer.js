/**
 * @file Handles display of drawer on left side of window, user navigation between different pages, creation of new documents, and logging out.
 *  Reads login status to govern which menu items to display.
 */

import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

export default class LeftDrawer extends React.Component {
    constructor(props) {
        super(props)
    };

    onLogout(e) {
        fetch('http://localhost:3000/logout', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            switch(res.status) {
                case 200:
                    this.props.setLogin(false)
                    this.props.redirect('Login')
                    break
                default:
                    console.log(res.status)
            }
        }).catch(err => console.log(err))
    };

    newDocument(e) {
        this.props.redirect('DocumentPrompt', (t) => {
            fetch('http://localhost:3000/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    title: t
                })
            }).then(res => res.json()).then(res => {
                console.log('Res: ', res)
                this.props.redirect('Document', res.doc)
                }).catch(err => console.log(err))
        })
    };

    render() {
        return(
            <Drawer open={this.props.open} >
                {this.props.loggedIn ? 
                    <div>
                    <MenuItem onMouseDown={e => {this.props.toggle(e); this.newDocument(e)}}>New Document</MenuItem>
                    <MenuItem onMouseDown={e => {this.props.toggle(e); this.props.redirect('DocumentList')}}>Document List</MenuItem>
                    <RaisedButton style={{display: 'flex', alignItems: 'center'}} label='Logout' onMouseDown={e => this.onLogout(e)} primary={true} />
                    </div>
                    :     
                    <div>        
                    <MenuItem onMouseDown={e => {this.props.toggle(e); this.props.redirect('Register')}}>Register</MenuItem>
                    <MenuItem onMouseDown={e => {this.props.toggle(e); this.props.redirect('Login')}} >Login</MenuItem>
                    </div>
                }
            </Drawer>
        )
    };
}