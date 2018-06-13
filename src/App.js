import React, { Component } from 'react';
import './App.css';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import ConvertForm from './Components/Form'

class App extends Component {
  render() {
      return (
          <Paper className='container'>
              <AppBar position="static" color="default" >
                <h3>Crypto-currency converter</h3>
              </AppBar>
              <ConvertForm/>
          </Paper>
        );
    }
}

export default App;
