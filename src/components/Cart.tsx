import React, { useEffect, useState } from 'react';
import CartType from '../types/CartType';
import { Nav, Modal, Button, Table, Form, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../firebase/AuthContext';
import { projectFirestore, timestamp } from '../firebase/config';

export default function Cart() {
  const { currentUser } = useAuth()
  const [count, setCount] = useState(0)
  const [cart, setCart] = useState<CartType | null>(null)
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [cartMenuColor, setCartMenuColor] = useState('#ffbb00')

  useEffect(() => {
    if (currentUser) {
      updateCart();
    }
  }, [currentUser, updateCart])

  if (currentUser) {
    window.addEventListener("cart.update", () => updateCart());
  } else {
    window.removeEventListener("cart.update", () => updateCart());
  }

  function updateCart() {
    let unorderedCart: any; 
    projectFirestore.collection("carts").where("userId", "==", currentUser?.uid).where("ordered", "==", false).get().then((querySnapshot) => {
      let documents: any[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), cartId: doc.id, cartArticles: []});
      });
      unorderedCart = documents[0];

      if (unorderedCart) {
        projectFirestore.collection("cartArticles").where("cartId", "==", unorderedCart.cartId).get().then((querySnapshot) => {
          let docs: any[] = [];
          querySnapshot.forEach(doc => {
            docs.push({...doc.data(), cartArticleId: doc.id});
          });
  
          unorderedCart.cartArticles = docs;
          
          setCart(unorderedCart);
          setCount(unorderedCart.cartArticles.length);
          
          setCartMenuColor('#FF0000');
          setTimeout(() => setCartMenuColor('#ffbb00'), 2000);
        })
      }
    })
  }

  function calculateSum(): number {
    let sum: number = 0;

    if (!cart) {
      return sum;
    }

    for (const item of cart?.cartArticles) {
      sum += item.articlePrice * item.quantity;
    }

    return sum;
  }

  const sum = calculateSum();

  function updateQuantity(event: React.ChangeEvent<HTMLInputElement>) {
    const articleId = event.target.dataset.articleId;
    const newQuantity = event.target.value;
    
    let cartArticle = cart?.cartArticles.find(art => art.articleId === articleId);

    projectFirestore.collection("cartArticles").doc(cartArticle?.cartArticleId).update({
      "quantity": newQuantity,
    })

    updateCart();
  }

  function removeFromCart(articleId: string) {
    let cartArticle = cart?.cartArticles.find(art => art.articleId === articleId);

    projectFirestore.collection("cartArticles").doc(cartArticle?.cartArticleId).delete();

    updateCart();
  }

  function makeOrder() {
    if (cart && (cart?.cartArticles.length > 0)) {
      const createdAt = timestamp();
      projectFirestore.collection("orders").add({
        cartId: cart.cartId,
        userId: cart.userId,
        createdAt: createdAt,
        status: "pending"
      }).then(() => {
        projectFirestore.collection("carts").doc(cart?.cartId).update({
          "ordered": true,
        })

        setMessage('Porudžbina je uspešno obavljena. Status Vaše porudžbine možete pratiti na stranici >Moj profil<.');

        setCart(null);
        setCount(0);
      })
    } else {
      setMessage('Korpa je prazna.');
    }
    
  }

  function hideCart() {
    setMessage('');
    setVisible(false);
  }

  const MessageLink = () => (
    <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-disabled">Morate biti prijavljeni da biste pristupili korpi.</Tooltip>}>
      <span className="d-inline-block" style={{ width: '100%' }}>
        <Nav.Link active={ false } 
                  onClick={ () => setVisible(true) }
                  style={ { color: cartMenuColor, pointerEvents: 'none' } }>
          <FontAwesomeIcon icon={ faCartArrowDown } /> ({ count })
        </Nav.Link>
      </span>
    </OverlayTrigger>
  );

  return (
    <>
      <Nav.Item>
        {
          currentUser ?
          <Nav.Link active={ false } 
                    onClick={ () => setVisible(true) }
                    style={ { color: cartMenuColor } }>
            <FontAwesomeIcon icon={ faCartArrowDown } /> ({ count })
          </Nav.Link> :
          <MessageLink />
        }
      </Nav.Item>

      <Modal size="lg" centered show={ visible } onHide={ () => hideCart() }>
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>Vaša korpa</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-secondary text-light">
          <Table hover size="sm" className="bg-secondary text-light">
            <thead>
              <tr>
                <th>Kategorija</th>
                <th>Proizvod</th>
                <th className="text-right">Količina</th>
                <th className="text-right">Cena</th>
                <th className="text-right">Ukupno</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { cart?.cartArticles.map(item => {
                return (
                  <tr>
                    <td>{ item.categoryName }</td>
                    <td>{ item.articleName }</td>
                    <td className="text-right">
                      <Form.Control type="number" step="1" min="1"
                                    value={ item.quantity }
                                    data-article-id={ item.articleId }
                                    onChange={ (e) => updateQuantity(e as any) }
                                    />
                    </td>
                    <td className="text-right">{ Number(item.articlePrice).toFixed(2) } RSD</td>
                    <td className="text-right">{ Number(item.articlePrice * item.quantity).toFixed(2) } RSD</td>
                    <td>
                      <FontAwesomeIcon 
                        icon={ faMinusSquare }
                        onClick={ () => removeFromCart(item.articleId) } />
                    </td>
                  </tr>
                )
              }) }
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-right">
                    <strong>Ukupno:</strong>
                </td>
                <td className="text-right">{ Number(sum).toFixed(2) } RSD</td>
                <td></td>
              </tr>
            </tfoot>
          </Table>

          <Alert variant="success" className={ message ? '' : 'd-none' }>
            { message }
          </Alert>
        </Modal.Body>
        <Modal.Footer className="bg-secondary text-light">
          <Button variant="warning" onClick={ () => makeOrder() }
          disabled={ cart?.cartArticles.length === 0 }>
          Poruči
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}