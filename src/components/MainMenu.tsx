import React from 'react';
import { Nav } from 'react-bootstrap';
import { HashRouter, Link } from 'react-router-dom';

interface MainMenuProperties {
  role: 'user' | 'administrator';
}

export default class MainMenu extends React.Component<MainMenuProperties> {
  render() {
    switch (this.props.role) {
      case 'user' : return( 
        <>
          {this.getUserMenu()}
        </>
      );
      case 'administrator' : return(
        <>
        {this.getAdministratorMenu()}
        </>
      );
    }

  }

  getUserMenu() {
    return(
      <Nav variant="pills" className="bg-secondary">
        <HashRouter>
          <Link to='/' className="nav-link text-warning">
          Početna
          </Link>
          <Link to='/contact/' className="nav-link text-warning">
          Kontakt
          </Link>
          <Link to='/' className="nav-link text-warning">
          Moje porudžbine
          </Link>
          {/*<Cart />*/}
          <Link to='/administrator/dashboard/' className="nav-link text-warning">
          Admin
          </Link>
        </HashRouter>
      </Nav>
    )
  }

  getAdministratorMenu() {
    return(
      <Nav variant="pills" className="bg-secondary">
        <HashRouter>
          <Link to='/' className="nav-link text-warning">
          Početna (korisnik)
          </Link>
          <Link to='/administrator/dashboard/' className="nav-link text-warning">
          Početna (admin)
          </Link>
          <Link to='/administrator/dashboard/category' className="nav-link text-warning">
          Kategorije
          </Link>
          <Link to='/administrator/dashboard/article' className="nav-link text-warning">
          Artikli
          </Link>
          <Link to='/administrator/dashboard/order' className="nav-link text-warning">
          Porudžbine
          </Link>
        </HashRouter>
      </Nav>
    )
  }
}