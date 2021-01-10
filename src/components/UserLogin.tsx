import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../firebase/AuthContext"
import { Link } from "react-router-dom"
import MainMenu from "./MainMenu"

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loginComplete, setLoginComplete] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    if (emailRef.current && passwordRef.current) {

      try {
        setError("")
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
      } catch {
        setError("Failed to log in")
      }
  
      setLoading(false)
      setLoginComplete(true)
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
          {
            (loginComplete === false) ?
            loginForm() :
            loginCompleteMessage()
          }
        </div>
      </Container>
    </Container>
  )

  function loginForm() {
    return (
      <>
        <Card>
          <Card.Header style={{ border: "3px solid #6c757d"}} className="bg-warning">
            <Card.Title className="text-center">Prijava korisnika</Card.Title>
          </Card.Header>
          <Card.Body className="bg-secondary text-light">
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Lozinka</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <Button variant="warning" disabled={loading} className="w-100" type="submit">
                Prijavi se
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link className="text-warning" to="/forgot-password">Zaboravili ste lozinku?</Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Nemate nalog? <Link to="/login">Registruj se</Link>
        </div>
      </>
    )
  }

  function loginCompleteMessage() {
    return (
      <p>
        Prijava je uspešno završena.<br/>
        Sada možete kupovati proizvode.
      </p>
    )
  }
}
