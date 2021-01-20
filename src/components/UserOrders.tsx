import React, { useEffect, useState } from 'react';
import OrderType from '../types/OrderType';
import { Container, Card, Table, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import CartType from '../types/CartType';
import { useAuth } from '../firebase/AuthContext';
import { projectFirestore } from '../firebase/config';

export default function UserOrders() {
  const { currentUser } = useAuth()
  const [orders, setOrders] = useState<OrderType[] | null>(null)
  const [cartVisible, setCartVisible] = useState(false)
  const [cart, setCart] = useState<CartType | null>(null)

  useEffect(() => {
    if (currentUser) {
      projectFirestore.collection("orders").where("userId", "==", currentUser?.uid).get().then((querySnapshot) => {
        let documents: any[] = [];
        querySnapshot.forEach(doc => {
          documents.push({...doc.data(), orderId: doc.id});
        });
        
        setOrders(documents);
      })
    }
  }, [currentUser])

  function getCart(cartId: string) {
    projectFirestore.collection("carts").doc(cartId).get().then((doc) => {
      let document: any = {...doc.data(), cartId: doc.id};

      projectFirestore.collection("cartArticles").where("cartId", "==", document.cartId).get().then((querySnapshot) => {
        let docs: any[] = [];
        querySnapshot.forEach(doc => {
          docs.push({...doc.data(), cartArticleId: doc.id});
        });

        document.cartArticles = docs;
        setCart(document);
      })
    })
  }

  function hideCart() {
    setCart(null);
    setCartVisible(false);
  }

  function calculateSum(): number {
    let sum: number = 0;

    if (!cart) {
      return sum;
    } else {
      for (const item of cart?.cartArticles) {
        sum += item.articlePrice * item.quantity;
      }
    }

    return sum;
  }

  const sum = calculateSum();

  if (!currentUser) {
    return (
      <></>
    );
  } else {
    return (
      <Container>
        <Card>
          <Card.Header className="bg-warning">
            <Card.Title className="text-dark">
            <FontAwesomeIcon icon={ faBox } /> Moje porudžbine
            </Card.Title>
          </Card.Header>

          <Card.Body className="bg-secondary">

            <Table hover size="sm" className="text-light">
              <thead>
                <tr>
                  <th>Vreme porudžbine</th>
                  <th>Status</th>
                  <th className="text-center">Sadržaj porudžbine</th>
                </tr>
              </thead>
              <tbody>
                { orders?.map(printOrderRow) }
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal size="lg" centered show={ cartVisible } onHide={ () => hideCart() }>
          <Modal.Header closeButton className="bg-warning">
            <Modal.Title>Sadržaj vaše porudžbine</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-secondary">
            <Table hover size="sm" className="text-light">
              <thead>
                <tr>
                  <th>Kategorija</th>
                  <th>Proizvod</th>
                  <th className="text-right">Količina</th>
                  <th className="text-right">Cena</th>
                  <th className="text-right">Ukupno</th>
                </tr>
              </thead>
              <tbody>
                { cart?.cartArticles.map(item => {
                  const articlePrice = item.articlePrice;

                  return (
                    <tr>
                      <td>{ item.categoryName }</td>
                      <td>{ item.articleName }</td>
                      <td className="text-right">{ item.quantity }</td>
                      <td className="text-right">{ Number(articlePrice).toFixed(2) } RSD</td>
                      <td className="text-right">{ Number(articlePrice * item.quantity).toFixed(2) } RSD</td>
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
          </Modal.Body>
        </Modal>
      </Container>
    );
  }

  function printOrderRow(order: OrderType) {
    console.log(order.createdAt.toDate());
    return (
      <tr>
        <td>{ order.createdAt.toDate().toLocaleString() }</td>
        <td>{ order.status }</td>
        <td className="text-center">
          <Button size="sm" variant="warning"
                  onClick={ () => setAndShowCart(order.cartId) } >
            <FontAwesomeIcon icon={ faBoxOpen } />
          </Button>
        </td>
      </tr>
    )
  }

  function setAndShowCart(cartId: string) {
    getCart(cartId);
    setCartVisible(true);
  }
}