import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Dropdown, Navbar } from 'react-bootstrap';
import { HashRouter, Link, Redirect } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import Cart from './Cart';

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
      <Navbar collapseOnSelect expand="lg" className="nav-bar d-flex bg-secondary">
        <HashRouter>
          <Link to='/' className="nav-home nav-link">
          Početna
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" className="bg-warning" />
          <Navbar.Collapse id="responsive-navbar-nav">
          <Dropdown>
            <Dropdown.Toggle variant="secondary" className="nav-link secondary text-warning">
            Proizvodi
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-secondary">
              <>
              { dropdownMenu() }
              </>
            </Dropdown.Menu>
          </Dropdown>
          <Link to='/about' className="nav-link text-warning">
          O nama
          </Link>
          <Link to='/contact' className="nav-link text-warning">
          Kontakt
          </Link>
          <Link to='/my-page' className="mr-auto nav-link text-warning">
          Moj profil
          </Link>
          <Cart />
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
                <Link to='/login' className="btn btn-outline-warning w-100 mb-2">Prijavi se</Link>
                <Link to='/signup' className="btn btn-outline-warning w-100">Registruj se</Link></>
              }
            </Dropdown.Menu>
          </Dropdown>
          <Link to='/admin-login' className="nav-link text-warning">
          Admin
          </Link>
          </Navbar.Collapse>
          
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

  function dropdownMenu() {
    return(
      <>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" className="nav-link secondary text-warning">
          Pčelinji proizvodi
          </Dropdown.Toggle>
          <Dropdown.Menu className="ml-5 bg-secondary">
            <Link to='/login' className="nav-link secondary text-warning mb-1">Med</Link>
            <Link to='/login' className="nav-link secondary text-warning mb-1">Ostali proizvodi</Link>
          </Dropdown.Menu>
        </Dropdown>
        <Link to='/category/1Q7Td0Fn6WquVDHWLc6F' className="nav-link secondary text-warning mb-1">Košnice</Link>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" className="nav-link secondary text-warning">
          Oprema za košnice
          </Dropdown.Toggle>
          <Dropdown.Menu className="ml-5 bg-secondary">
            <Link to='/' className="nav-link secondary text-warning mb-1">Razmaci i nosači ramova</Link>
            <Link to='/' className="nav-link secondary text-warning mb-1">Češljevi i regulatori leta</Link>
            <Link to='/' className="nav-link secondary text-warning mb-1">Hranilice i pojila</Link>
            <Link to='/' className="nav-link secondary text-warning mb-1">Matične rešetke</Link>
            <Link to='/' className="nav-link secondary text-warning mb-1">Sakupljači polena, propolisa i perge</Link>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" className="nav-link secondary text-warning">
          Pčelarski alat
          </Dropdown.Toggle>
          <Dropdown.Menu className="ml-5 bg-secondary">
            <Link to='/' className="nav-link secondary text-warning mb-1">Pčelarski noževi i klešta</Link>
            <Link to='/' className="nav-link secondary text-warning mb-1">Dimilice</Link>
            <Link to='/' className="nav-link secondary text-warning mb-1">Četke za pčele</Link>
            <Link to='/' className="nav-link secondary text-warning mb-1">Bežalice</Link>
            <Link to='/' className="nav-link secondary text-warning mb-1">Pribor za ožičavanje ramova</Link>
          </Dropdown.Menu>
        </Dropdown>
        <Link to='/' className="nav-link secondary text-warning mb-1">Zaštitna oprema</Link>
        <Link to='/' className="nav-link secondary text-warning mb-1">Oprema za vrcanje</Link>
        <Link to='/' className="nav-link secondary text-warning mb-1">Matice i rojevi</Link>
        <Link to='/' className="nav-link secondary text-warning mb-1">Satne osnove</Link>
        <Link to='/' className="nav-link secondary text-warning mb-1">Ostalo</Link>
      </>
    )
  }
}

export default MainMenu;