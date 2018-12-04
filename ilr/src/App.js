import React, { Component } from 'react';
import './App.css';
import Channels from './Channels';
import Authentication from './Authentication'

//const proxy = "https://whispering-meadow-89645.herokuapp.com/";
const url = "http://localhost:9001/channels";


class App extends Component {
  render(){
    return (
    <div>
      <Authentication />
      <Channels />
    </div>
    );
  }
}

export default App;

