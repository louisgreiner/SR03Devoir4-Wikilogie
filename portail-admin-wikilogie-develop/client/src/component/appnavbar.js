import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import logo from './../img/logo2.png'

class AppNavBar extends Component {
  constructor(props){
    super(props);
    this.state={
      myArray: {"Fields":"/Fields",
                "Users":"/Users",
                "UserFields":"/UserFields",
                "Quizz":"/Quizz",
                "Follows":"/Follows",
                "ArticlesToVerify":"/ArticlesToVerify"
      },
    }
  }

  isSameUrl(titre,link){
    let url = window.location.href;
    url = "/" + url.split("/").pop();
    if(link===url){
      return (<Nav.Link key={titre} className="navLink active" href={link}>{titre}</Nav.Link>);
    }
    else{
      return (<Nav.Link key={titre} className="navLink" href={link}>{titre}</Nav.Link>);
    }
  }


  render() {
    console.log = console.warn = console.error = () => {};
    return (
      <Navbar bg="light" expand="lg" sticky="top">
          <Navbar.Brand href="/Accueil"><img src={logo} /></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="mr-auto">
              {Object.entries(this.state.myArray).map(([titre,link]) =>  {
                  return(this.isSameUrl(titre,link))
                }
              )
            }
            </Nav>
            <Nav>
              <Button id="disconnect" variant="dark">D&#233;connexion</Button>
            </Nav>
          </Navbar.Collapse>
          <script src="/scripts/appnavbar_script.js"></script>
      </Navbar>
    );
  }
}

export default AppNavBar;
