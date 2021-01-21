import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../firebase/AuthContext"
import { Link } from "react-router-dom"
import MainMenu from "./MainMenu"

export default function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null)
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    if (emailRef.current) {
      try {
        setMessage("")
        setError("")
        setLoading(true)
        await resetPassword(emailRef.current.value)
        setMessage("Mejl je poslat. Proverite vašu poštu za dalja uputstva.")
      } catch {
        setError("Failed to reset password")
      }
  
      setLoading(false)
    }
  }

  return (
    <Container>
      <MainMenu role='user' />
      <img className="honey-img" src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/honey-clipart-realistic.png?alt=media&token=53885089-d838-4ea6-938e-fdcde84e762c" alt="honey" />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Header style={{ border: "3px solid #6c757d"}} className="bg-warning">
              <Card.Title className="text-center">Reset lozinke</Card.Title>
            </Card.Header>
            <Card.Body className="bg-secondary text-light">
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit" variant="warning">
                  Resetuj lozinku
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
          <Link to="/login">Prijavi se</Link><br/>
            Nemate nalog? <Link to="/signup">Registruj se</Link>
          </div>
        </div>
      </Container>
    </Container>
  )
}
