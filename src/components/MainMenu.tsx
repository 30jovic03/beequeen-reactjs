import React from 'react';
import { Button, Nav } from 'react-bootstrap';
import { HashRouter, Link } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

interface MainMenuProperties {
  role: 'user' | 'administrator';
}

const MainMenu: React.FC<MainMenuProperties> = ({role}) => {

  const {currentUser} = useAuth() as any;

  
  switch (role) {
    case 'user' : return( 
      <>
        {getUserMenu()}
      </>
    );
    case 'administrator' : return(
      <>
      {getAdministratorMenu()}
      </>
    );
  }

  

  function getUserMenu() {
    return(
      <Nav variant="pills" className="nav-bar bg-secondary">
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
          <Button variant="secondary" className="nav-link text-warning">
          {currentUser.email}
          </Button>
        </HashRouter>
      </Nav>
    )
  }

  function getAdministratorMenu() {
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

export default MainMenu;