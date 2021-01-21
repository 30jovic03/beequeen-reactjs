import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../firebase/AuthContext"
import { Link, useHistory } from "react-router-dom"
import MainMenu from "./MainMenu"

export default function UpdateProfile() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)
  const { currentUser, updatePassword, updateEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    
    if (currentUser && emailRef.current && passwordRef.current && passwordConfirmRef.current) {

      if (0 < passwordRef.current.value.length && passwordRef.current.value.length < 6) {
        return setError("Password should be at least 6 characters")
      }

      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match")
      }

      const promises = []
      setLoading(true)
      setError("")

      if (emailRef.current.value !== currentUser.email) {
        promises.push(updateEmail(emailRef.current.value))
      }
      if (passwordRef.current.value) {
        promises.push(updatePassword(passwordRef.current.value))
      }

      Promise.all(promises)
      .then(() => {
        history.push("/my-page")
      })
      .catch(() => {
        setError("Failed to update account")
      })
      .finally(() => {
        setLoading(false)
      })
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
              <Card.Title className="text-center">Izmeni profil</Card.Title>
            </Card.Header>
            <Card.Body className="bg-secondary text-light">
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    required
                    defaultValue={currentUser?.email ? currentUser.email : ''}
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Lozinka</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Label>Potvrda lozinke</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Button disabled={loading} className="w-100" variant="warning" type="submit">
                  Sačuvaj izmene
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <Link to="/my-page">Odustani</Link>
          </div>
        </div>
      </Container>
    </Container>
  )
}
