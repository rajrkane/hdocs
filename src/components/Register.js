/**
 * @file Register page.
 */

import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Typography from '@material-ui/core/Typography';

export default class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
    };

    onUsernameChange(e) {
        this.setState({username: e.target.value})
    };

    onPasswordChange(e) {
        this.setState({password: e.target.value})
    };

    onRegister(e) {
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })  
        }).then(res => {
            switch(res.status) {
                case 200:
                    this.props.redirect('Login')
                    break 
                default: 
                    console.log(res.status)
           }
        }).catch(err => console.log(err))
    };

    render() {
        return(
            <div className='register'> <br />
                <Typography variant="title" gutterBottom>Register</Typography>
                <TextField onChange={e => this.onUsernameChange(e)} hintText="Username"/><br />
                <TextField onChange={e => this.onPasswordChange(e)} type="password" hintText="Password"/><br />
                <RaisedButton onMouseDown={e => this.onRegister(e)} label='Register' primary={true} /><br />
                <a onMouseDown={e => this.props.redirect('Login')} href='./Login'>
                    <Typography variant='caption' gutterBottom>Already have an account? Log in.</Typography>
                </a>
            </div>
        )
    };
}