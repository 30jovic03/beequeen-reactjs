import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MainMenu from './MainMenu';

const AdministratorDashboard = () => {
  return (
    <Container>
      <MainMenu role='administrator' />

      <Card>
        <Card.Header className="bg-warning">
          <Card.Title>
          <FontAwesomeIcon icon={ faHome } /> Administrator Dashboard
          </Card.Title>
        </Card.Header>

        <Card.Body>
          <ul>
            <li><Link to="/administrator/dashboard/category" className="btn btn-sm btn-warning mr-2">Kategorije</Link></li><br />
            <li><Link to="/administrator/dashboard/article" className="btn btn-sm btn-warning mr-2">Artikli</Link></li><br />
            <li><Link to="/administrator/dashboard/order" className="btn btn-sm btn-warning mr-2">Porudžbine</Link></li><br />
          </ul>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AdministratorDashboard;