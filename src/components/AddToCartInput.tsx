import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Col, Form, Button, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAuth } from '../firebase/AuthContext';
import { projectFirestore, timestamp } from '../firebase/config';
import ArticleType from '../types/ArticleType';

interface AddToCartInputProperties {
  article: ArticleType,
}

const AddToCartInput: React.FC<AddToCartInputProperties> = ({ article }) => {
  const { currentUser } = useAuth()
  const [quantity, setQuantity] = useState(1)

  function quantityChange(event: React.ChangeEvent<HTMLInputElement>) {
      setQuantity(Number(event.target.value))
  }

  function addToCart() {
    let unorderedCart: any;
    const event = new CustomEvent('cart.update');

    projectFirestore.collection("carts").where("ordered", "==", false).get().then((querySnapshot) => {
      let documents: any[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), cartId: doc.id});
      });

      unorderedCart = documents[0];

      if (unorderedCart) {
        projectFirestore.collection("cartArticles").where("cartId", "==", unorderedCart.cartId).get().then((querySnapshot) => {
          let docs: any[] = [];
          querySnapshot.forEach(doc => {
            docs.push({...doc.data(), cartArticleId: doc.id});
          });
          let cartArticle = docs.find(art => art.articleId === article.articleId);
          if (cartArticle) {
            const newQuantity = cartArticle.quantity + quantity;
            projectFirestore.collection("cartArticles").doc(cartArticle.cartArticleId).update({
              "quantity": newQuantity,
            })

            window.dispatchEvent(event);
          } else {
            projectFirestore.collection("cartArticles").add({
              cartId: unorderedCart.cartId,
              articleId: article.articleId,
              quantity: quantity,
              articleName: article.name,
              categoryId: article.categoryId,
              categoryName: article.categoryName,
              articlePrice: article.price
            })

            window.dispatchEvent(event);
          }
        })
      } else {
        const createdAt = timestamp();
        projectFirestore.collection("carts").add({
          userId: currentUser?.uid,
          createdAt: createdAt,
          ordered: false
        }).then((docRef) => {
          projectFirestore.collection("cartArticles").add({
            cartId: docRef.id,
            articleId: article.articleId,
            quantity: quantity,
            articleName: article.name,
            categoryId: article.categoryId,
            categoryName: article.categoryName,
            articlePrice: article.price
          })

          window.dispatchEvent(event);
        });
      }
    });
  }

  const MessageButton = () => (
    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Morate biti prijavljeni da biste ovaj proizvod dodali u korpu.</Tooltip>}>
      <span className="d-inline-block" style={{ width: '100%' }}>
        <Button disabled block variant="warning" style={{ pointerEvents: 'none' }}>
          <FontAwesomeIcon icon={ faCartArrowDown } />
        </Button>
      </span>
    </OverlayTrigger>
  );
  
  return (
    <Form.Group>
      <Row>
        <Col xs="6">
          <Form.Control type="number" min="1" step="1" value={ quantity } 
                        onChange={ (e) => quantityChange(e as any) } />
        </Col>
        <Col xs="6">
          {
            currentUser ?
            <Button variant="warning" block
                  onClick={ () => addToCart() }>
              <FontAwesomeIcon icon={ faCartArrowDown } />
            </Button> :
            <MessageButton />
          }
        </Col>
      </Row>
    </Form.Group>
  )
}

export default AddToCartInput