import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import MainMenu from './MainMenu'

export default function About() {
  return (
    <Container>
      <MainMenu role='user' />
      <Container className="home-page bg-secondary text-light text-justify">
        <img className="honey-img" src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/honey-clipart-realistic.png?alt=media&token=53885089-d838-4ea6-938e-fdcde84e762c" alt="honey" />
        <div>
          <Row>
            <Col md="6">
              <Form style={{ border: "3px solid #ffc107", marginBottom: "15px", padding: "10px"}}>
                <h2 className="text-center">Pišite nam</h2>
                <Row>
                  <Col md="6">
                    <Form.Group id="name">
                      <Form.Label>Ime:</Form.Label>
                      <Form.Control type="text"/>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group id="email">
                      <Form.Label>Email:</Form.Label>
                      <Form.Control type="email"/>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group id="message">
                  <Form.Label>Poruka:</Form.Label>
                  <Form.Control as="textarea" rows={3}/>
                </Form.Group>
                <Button variant="warning" className="w-100">
                  Pošalji
                </Button>
              </Form>
            </Col>
            <Col md="6">
              <div style={{ border: "3px solid #ffc107", marginBottom: "15px", padding: "7px"}}>
                <h2 style={{ marginLeft: "23%" }}>Kontakt info</h2>
                <div style={{ marginLeft: "23%" }}>
                  <h5>Adresa:</h5>
                  <p>Neka adresa bb<br/>
                  11111 Neki grad<br/>
                  Srbija</p>
                  <h5>Telefon:</h5>
                  <p>123/456-789</p>
                  <h5>Email:</h5>
                  <p>beequeen@beequeen.com</p>
                </div>
              </div>
            </Col>
          </Row>
          
          <img className="contact-img" src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/businessman.jpg?alt=media&token=9b4344ea-3354-4357-bfcf-9b80151cd9b2" alt="businessman"/>
        </div>
      </Container>
    </Container>
  )
}
