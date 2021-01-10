import React, { useState } from "react"
import { Card, Button, Alert, Container } from "react-bootstrap"
import { useAuth } from "../firebase/AuthContext"
import { Link } from "react-router-dom"
import MainMenu from "./MainMenu"

export default function Dashboard() {
  const [error, setError] = useState("")
  const [loggedIn, setLoggedIn] = useState(true)
  const { currentUser, logout } = useAuth()

  async function handleLogout() {
    setError("")

    try {
      await logout()
    } catch {
      setError("Failed to log out")
    }

    setLoggedIn(false)
  }

  return (
    <Container>
      <MainMenu role='user' />
      <img className="honey-img" src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/honey-clipart-realistic.png?alt=media&token=53885089-d838-4ea6-938e-fdcde84e762c" alt="honey" />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "30vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          {
            (loggedIn === true) ?
            dashboard() :
            logoutCompleteMessage()
          }
        </div>
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
            <strong>Email:</strong> {currentUser?.email}
            <Link to="/update-profile" className="btn btn-warning w-100 mt-3">
              Izmeni profil
            </Link>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Button variant="link" onClick={handleLogout}>
            Odjavi se
          </Button>
        </div>
      </>
    )
  }

  function logoutCompleteMessage() {
    return (
      <p>
        Odjava je uspešno završena.
      </p>
    )
  }
}
