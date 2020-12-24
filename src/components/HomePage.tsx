import React from 'react';
import { Container } from 'react-bootstrap';
import MainMenu from './MainMenu';


class HomePage extends React.Component {

  render() {
    return(
      <Container>
        <MainMenu role='user' />

        <div>
          Home page
        </div>
      </Container>
    )
  }
}

export default HomePage;