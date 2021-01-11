import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Dropdown, Navbar } from 'react-bootstrap';
import { HashRouter, Link, Redirect } from 'react-router-dom';
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

  if (error.length > 0) {
    console.log(error);
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
      <Navbar expand="lg" className="nav-bar d-flex bg-secondary">
        <HashRouter>
          <Link to='/' className="nav-link text-warning">
          Početna
          </Link>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" className="nav-link secondary text-warning">
            Proizvodi
            </Dropdown.Toggle>
          </Dropdown>
          <Link to='/about' className="nav-link text-warning">
          O nama
          </Link>
          <Link to='/contact' className="nav-link text-warning">
          Kontakt
          </Link>
          <Link to='/my-page' className="mr-auto nav-link text-warning">
          Moj nalog
          </Link>
          {/*<Cart />*/}
          <Dropdown>
            <Dropdown.Toggle variant="secondary" className="nav-link secondary text-warning">
              {currentUser ? 
              <>{currentUser.email} <FontAwesomeIcon icon={ faUser }/></> 
              :
               <>Prijava korisnika <FontAwesomeIcon icon={ faUser }/></> }
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-secondary">
              {currentUser ? 
                <Button onClick={handleLogout} variant="outline-warning" className="w-100">Odjavi se</Button> 
                : <>
                <Link to='/login' className="btn btn-outline-warning w-100">Prijavi se</Link>
                <Link to='/signup' className="btn btn-outline-warning w-100 mt-2">Registruj se</Link></>
              }
            </Dropdown.Menu>
          </Dropdown>
          <Link to='/admin-login' className="nav-link text-warning">
          Admin
          </Link>
        </HashRouter>
      </Navbar>
    )
  }

  function getAdministratorMenu() {
    if (currentUser?.email === "admin@beequeen.com") {
      return (
        <Navbar expand="lg" className="nav-bar d-flex bg-secondary">
          <HashRouter>
            <Link to='/administrator/dashboard/' className="nav-link text-warning">
            Početna
            </Link>
            <Link to='/administrator/dashboard/category' className="nav-link text-warning">
            Kategorije
            </Link>
            <Link to='/administrator/dashboard/article' className="nav-link text-warning">
            Artikli
            </Link>
            <Link to='/administrator/dashboard/order' className="nav-link mr-auto text-warning">
            Porudžbine
            </Link>
            <Button onClick={handleLogout} variant="outline-warning" className="nav-link">Odjavi se</Button>
          </HashRouter>
        </Navbar>
      );
    }

    return(
      <Redirect to="/" />
    )
  }
}

export default MainMenu;