import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ArticleType from '../types/ArticleType';
import AddToCartInput from './AddToCartInput';

interface SingleArticlePreviewProperties {
  article: ArticleType,
}

export default class SingleArticlePreview extends React.Component<SingleArticlePreviewProperties> {

  render() {
    return (
      <Col lg="4" md="6" sm="6" xs="12">
        <Card className="mb-3">
          <Card.Header>
            <div className="article-picture">
              <img alt={ this.props.article.name }
                 src={ this.props.article.imageUrl }
                 className="w-100" />
            </div>
          </Card.Header>
          <Card.Body>
            <Card.Title as="p">
              <strong>{ this.props.article.name }</strong>
            </Card.Title>
            <Card.Text>
              { this.props.article.excerpt }
            </Card.Text>
            <Card.Text>
              Cena: { Number(this.props.article.price).toFixed(2) } RSD
            </Card.Text>

            <AddToCartInput article={ this.props.article } />
            
            <Link to={ `/article/${ this.props.article.articleId }` }
                  className="btn btn-warning btn-block btn-sm">
              Detaljnije
            </Link>
          </Card.Body>
        </Card>
      </Col>
    )
  }
}