import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../firebase/AuthContext"
import { Link, useHistory } from "react-router-dom"
import MainMenu from "./MainMenu"

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    if (emailRef.current && passwordRef.current) {

      try {
        setError("")
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
        history.push("/")
      } catch {
        setError("Failed to log in")
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
              <div className="w-100 text-center mt-2">
                Nemate nalog? <Link className="text-warning" to="/signup">Registruj se</Link>
              </div>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-3">
            <p>
            Ovo je demo sajt. Ako ne želite da napravite nalog možete se prijaviti pomoću:<br/>
            Email: test@beequeen.com<br/>
            Lozinka: 123456
            </p>
          </div>
        </div>
      </Container>
    </Container>
  )
}
