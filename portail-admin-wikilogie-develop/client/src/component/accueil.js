import React, { Component } from 'react';
import './accueil.css';
import logo from '../img/logo.png';
import { Button } from '@material-ui/core';


class Accueil extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  

  render() {
    return (
      <div id="content">
        <div className="left">
          <h1>Accès aux tables</h1><br/>
          <Button size="large" variant="outlined" href="/Fields">
            Fields
          </Button><br/>
          <Button size="large" variant="outlined" href="/Users">
            Users
          </Button><br/>
          <Button size="large" variant="outlined" href="/UserFields">
            UserFields
          </Button><br/>
          <Button size="large" variant="outlined" href="/Quizz">
            Quizz
          </Button><br/>
          <Button size="large" variant="outlined" href="/Follows">
            Follows
          </Button><br/>
          <Button size="large" variant="outlined" href="/ArticlesToVerify">
            ArticlesToVerify
          </Button><br/>
        </div>
        <div className="right">
          <img src={logo} width="80%" alt="Chargement logo Wikilogie..."/>
        </div>
    </div>
    );
  }
}


export default Accueil;
