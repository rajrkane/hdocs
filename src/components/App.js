/**
 * @file Top level React frontend file. Governs the choice of page to display.
 * @author Raj Kane
 */

import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Document from './Document';
import LeftDrawer from './LeftDrawer';
import Appbar from 'material-ui/AppBar';
import { black } from 'material-ui/styles/colors';
import Register from './Register';
import Login from './Login';
import DocumentList from './DocumentList';
import DocumentPrompt from './DocumentPrompt';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 'Register', 
            drawerOpen: false, 
            loggedIn: false,
            options: null
        }
        this.redirect = this.redirect.bind(this)
        this.setLogin = this.setLogin.bind(this)
        this.handleClickAway = this.handleClickAway.bind(this)
    };

    redirect(page, options) {
        this.setState({
            currentPage: page,
            options: options
        })
    };

    toggleDrawer(e) {
        e.preventDefault()
        this.setState({drawerOpen: !this.state.drawerOpen})
    };

    handleClickAway() {
        this.setState({drawerOpen: false})
    };

    setLogin(b) {
        this.setState({loggedIn: b}) 
    };

    render() {
        return(
            <div className='app'>
                <MuiThemeProvider>
                    <div>
                        <ClickAwayListener onClickAway={this.handleClickAway}>
                        <div>
                        <Appbar onLeftIconButtonClick={(e) => this.toggleDrawer(e)} style={{background: black}} title='HDocs' />
                        <LeftDrawer open={this.state.drawerOpen} redirect={this.redirect} toggle={e => this.toggleDrawer(e)} setLogin={this.setLogin} loggedIn={this.state.loggedIn} />
                        {this.state.currentPage === 'Document' ? <Document redirect={this.redirect} options={this.state.options} /> : null}
                        {this.state.currentPage === 'Register' ? <Register redirect={this.redirect}/> : null}      
                        {this.state.currentPage === 'Login' ? <Login redirect={this.redirect} setLogin={this.setLogin}/> : null} 
                        {this.state.currentPage === 'DocumentList' ? <DocumentList redirect={this.redirect}/> : null} 
                        {this.state.currentPage === 'DocumentPrompt' ? <DocumentPrompt redirect={this.redirect} options={this.state.options} /> : null} 
                        </div>
                        </ClickAwayListener>
                    </div>
                </MuiThemeProvider>
            </div>
        )
    };
}
