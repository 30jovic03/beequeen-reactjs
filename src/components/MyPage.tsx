import React, { useState } from "react"
import { Card, Button, Alert, Container, Row, Col } from "react-bootstrap"
import { useAuth } from "../firebase/AuthContext"
import { Link } from "react-router-dom"
import MainMenu from "./MainMenu"
import UserOrders from "./UserOrders"

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()

  async function handleLogout() {
    setError("")

    try {
      await logout()
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <Container>
      <MainMenu role='user' />
      <img className="honey-img" src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/honey-clipart-realistic.png?alt=media&token=53885089-d838-4ea6-938e-fdcde84e762c" alt="honey" />
      <Container>
        {
          currentUser ?
          dashboard() :
          loggedOutMessage()
        }
      </Container>
    </Container>
  )

  function dashboard() {
    return (
      <>
        <Card>
          <Card.Header style={{ border: "3px solid #6c757d"}} className="bg-warning">
            <Card.Title className="text-center">Moj profil</Card.Title>
          </Card.Header>
          <Card.Body className="bg-secondary text-light">
            {error && <Alert variant="danger">{error}</Alert>}
            <Row className="mb-4">
              <Col lg="6" className="mb-2 text-center">
                <strong>Email:</strong> {currentUser?.email}
              </Col>
              <Col lg="3">
                <Link to="/update-profile" className="btn btn-warning w-100 mb-2">
                  Izmeni profil
                </Link>
              </Col>
              <Col lg="3">
                <Button className="w-100" variant="warning" onClick={handleLogout}>
                  Odjavi se
                </Button>
              </Col>
            </Row>
        <UserOrders />
          </Card.Body>
        </Card>
      </>
    )
  }

  function loggedOutMessage() {
    return (
      <div className="text-center mt-2">
        <p className="text-center">
          Niste prijavljeni.
        </p>
        <Link to="/login" className="btn btn-secondary w-25 mt-3">
          Prijavi se
        </Link>
      </div>
    )
  }
}
