import React, { useEffect, useState } from "react";
import { Container, Card, Table, Modal, Button, Tabs, Tab } from "react-bootstrap";
import MainMenu from "./MainMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import CartType from "../types/CartType";
import OrderType from "../types/OrderType";
import { useAuth } from "../firebase/AuthContext";
import { projectFirestore } from "../firebase/config";

export default function AdministratorDashboardOrder() {
  const { currentUser } = useAuth()
  const [orders, setOrders] = useState<OrderType[] | null>(null)
  const [cartVisible, setCartVisible] = useState(false)
  const [cart, setCart] = useState<CartType | null>(null)

  useEffect(() => {
    if (currentUser?.email === "admin@beequeen.com") {
      getOrders();
    }
  }, [currentUser])

  function getOrders() {
    projectFirestore.collection("orders").get().then((querySnapshot) => {
      let documents: any[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), orderId: doc.id});
      });
      
      setOrders(documents);
    })
  }

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

  function changeStatus(orderId: string, newStatus: "rejected" | "accepted" | "shipped" | "pending") {
    projectFirestore.collection("orders").doc(orderId).update({status: newStatus})
    
    getOrders();
  }

  function setAndShowCart(cartId: string) {
    getCart(cartId);
    setCartVisible(true);
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

  function printStatusChangeButtons(order: OrderType) {
    if (order.status === 'pending') {
      return (
        <>
          <Button type="button" variant="primary" size="sm" className="mr-1"
                  onClick={ () => changeStatus(order.orderId, 'accepted') }>Accept</Button>
          <Button type="button" variant="danger" size="sm"
                  onClick={ () => changeStatus(order.orderId, 'rejected') }>Reject</Button>
        </>
      );
    }

    if (order.status === 'accepted') {
      return (
        <>
          <Button type="button" variant="primary" size="sm" className="mr-1"
                  onClick={ () => changeStatus(order.orderId, 'shipped') }>Ship</Button>
          <Button type="button" variant="warning" size="sm"
                  onClick={ () => changeStatus(order.orderId, 'pending') }>Return to pending</Button>
        </>
      );
    }

    if (order.status === 'shipped') {
      return (
        <>

        </>
      );
    }

    if (order.status === 'rejected') {
      return (
        <>
          <Button type="button" variant="warning" size="sm"
                  onClick={ () => changeStatus(order.orderId, 'pending') }>Return to pending</Button>
        </>
      );
    }
  }

  function renderOrders(withStatus: "rejected" | "accepted" | "shipped" | "pending") {
    return (
      <Table hover size="sm" bordered className="text-light">
        <thead>
          <tr>
            <th className="pr-2">Order ID</th>
            <th>Date</th>
            <th className="text-center">Cart</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          { orders?.filter(order => order.status === withStatus).map(order => (
            <tr>
              <td className="pr-2">{ order.orderId }</td>
              <td>{ order.createdAt.toDate().toLocaleString() }</td>
              <td className="text-center">
                <Button size="sm" variant="warning"
                        onClick={ () => setAndShowCart(order.cartId) } >
                  <FontAwesomeIcon icon={ faBoxOpen } />
                </Button>
              </td>
              <td>
                { printStatusChangeButtons(order) }
              </td>
            </tr>
          ) ) }
        </tbody>
      </Table>
    );
  }

  return (
    <Container>
      <MainMenu role='administrator' />

      <Card>
        <Card.Header className="bg-warning">
          <Card.Title>
          <FontAwesomeIcon icon={ faCartArrowDown } /> Orders
          </Card.Title>
        </Card.Header>

        <Card.Body className="bg-secondary">
          <Tabs deafaultActiveKey="pending" id="order-tabs" className="ml-0 mb-0">
            <Tab eventKey="pending" title="Pending">
              { renderOrders("pending") }
            </Tab>
            <Tab eventKey="accepted" title="Accepted">
              { renderOrders("accepted") }
            </Tab>
            <Tab eventKey="shipped" title="Shipped">
              { renderOrders("shipped") }
            </Tab>
            <Tab eventKey="rejected" title="Rejected">
              { renderOrders("rejected") }
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <Modal size="lg" centered show={ cartVisible } onHide={ () => hideCart() }>
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>Order content</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-secondary">
          <Table hover size="sm" className="text-light">
            <thead>
              <tr>
                <th>Category</th>
                <th>Article</th>
                <th className="text-right">Quantity</th>
                <th className="text-right">Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              { cart?.cartArticles.map(item => {

                return (
                  <tr>
                    <td>{ item.categoryName }</td>
                    <td>{ item.articleName }</td>
                    <td className="text-right">{ item.quantity }</td>
                    <td className="text-right">{ Number(item.articlePrice).toFixed(2) } RSD</td>
                    <td className="text-right">{ Number(item.articlePrice * item.quantity).toFixed(2) } RSD</td>
                  </tr>
                )
              } ) }
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-right">
                    <strong>Total:</strong>
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