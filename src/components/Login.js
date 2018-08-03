/**
 * @file Login page.
 */

import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Typography from '@material-ui/core/Typography';

export default class Login extends React.Component {
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

    onLogin(e) {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then(res => {
            switch(res.status) {
                case 200:
                    this.props.setLogin(true)
                    this.props.redirect('DocumentList')
                    break
                default:
                    console.log(res.status) 
            }
        }).catch(err => console.log(err))
    };

    render() {
        return(
            <div className='register'><br />
                <Typography variant="title" gutterBottom>Login</Typography>
                <TextField hintText="Username" onChange={e => this.onUsernameChange(e)} /><br />
                <TextField hintText="Password" type="password" onChange={e => this.onPasswordChange(e)} /><br />
                <RaisedButton label='Login' onMouseDown={e => this.onLogin(e)} primary={true} /><br />
                <a onMouseDown={e => this.props.redirect('Register')} href='./Register'>
                    <Typography variant='caption' gutterBottom>Don't have an account? Register.</Typography>
                </a>
            </div>
        )
    };
}
