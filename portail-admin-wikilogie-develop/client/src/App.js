import React, { Component } from 'react';
import './App.css';
import AppNavBar from './component/appnavbar.js';
import Main from './component/main.js';
import Footer from './component/footer'
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  };


  render() {
    return (
      <div>
        <AppNavBar />
        <Main />
        <Footer/>
      </div>
    );
  }
}


export default App;
