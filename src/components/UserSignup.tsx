import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../firebase/AuthContext"
import { Link } from "react-router-dom"
import MainMenu from "./MainMenu"

export default function UserSignup() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)
  const { signup } = useAuth() as any
  const [error, setError] = useState("")
  const [signupComplete, setSignupComplete] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    if (emailRef.current && passwordRef.current && passwordConfirmRef.current) {

      if (passwordRef.current.value.length < 6) {
        return setError("Password should be at least 6 characters")
      }

      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match")
      }
      
      try {
        setError("")
        setLoading(true)
        await signup(emailRef.current.value, passwordRef.current.value)
      } catch {
        setError("Failed to create an account")
      }
  
      setLoading(false)
      setSignupComplete(true)
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
            (signupComplete === false) ?
            signupForm() :
            signupCompleteMessage()
          }
        </div>
      </Container>
    </Container>
  )

  function signupForm() {
    return (
      <>
        <Card>
          <Card.Header style={{ border: "3px solid #6c757d"}} className="bg-warning">
            <Card.Title className="text-center">Registracija</Card.Title>
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
              <Form.Group id="password-confirm">
                <Form.Label>Potvrda lozinke</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <Button variant="warning" disabled={loading} className="w-100" type="submit">
                Registruj nalog
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Već imate nalog? <Link to="/login">Uloguj se</Link>
        </div>
      </>
    )
  }

  function signupCompleteMessage() {
    return (
      <p>
        Registracija je uspešno završena
      </p>
    )
  }
}
