import React, { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { HashRouter, Link } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

interface MainMenuProperties {
  role: 'user' | 'administrator';
}

const MainMenu: React.FC<MainMenuProperties> = ({role}) => {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth() as any;

  async function handleLogout() {
    setError("")

    try {
      await logout()
    } catch {
      setError("Failed to log out")
    }
  }
  
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
          <Link to='/my-page' className="nav-link text-warning">
          Moj nalog
          </Link>
          {/*<Cart />*/}
          <Link to='/administrator/dashboard/' className="nav-link text-warning">
          Admin
          </Link>
          <Button variant="secondary" className="nav-link text-warning">
          {currentUser ? currentUser.email : "niste prijavljeni"}
          </Button>
          
          {currentUser ? <Button variant="secondary" onClick={handleLogout} className="nav-link text-warning">Odjavi se</Button> : <Link to='/login' className="nav-link text-warning">Prijavi se</Link>}
          
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