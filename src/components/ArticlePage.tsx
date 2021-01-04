import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import MainMenu from './MainMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import ArticleType from '../types/ArticleType';
import { projectFirestore } from '../firebase/config';
import ArticleFeatureType from '../types/ArticleFeatureType';
//import AddToCartInput from '../AddToCartInput/AddToCartInput';

interface ArticlePageProperties {
  match: {
    params: {
      aId: number;
    }
  }
}

interface ArticlePageState {
  isUserLoggedIn: boolean;
  message: string;
  article?: ArticleType;
}

export default class ArticlePage extends React.Component<ArticlePageProperties> {
  state: ArticlePageState;

  constructor(props: Readonly<ArticlePageProperties>) {
    super(props);

    this.state = {
      isUserLoggedIn: true,
      message: '',
    }
  }

  private setLogginState(isLoggedIn: boolean) {
    const newState = Object.assign(this.state, {
      isUserLoggedIn: isLoggedIn,
    });

    this.setState(newState);
  }

  private setMessage(message: string) {
    const newState = Object.assign(this.state, {
      message: message,
    });

    this.setState(newState);
  }

  private setArticleData(article: ArticleType | undefined) {
    const newState = Object.assign(this.state, {
      article: article,
    });

    this.setState(newState);
  }

  componentDidMount() {
    this.getArticleData();
  }
  componentDidUpdate(oldProperties: ArticlePageProperties) {
    if (oldProperties.match.params.aId === this.props.match.params.aId) {
      return;
    }

    this.getArticleData();
  }

  getArticleData() {
    let article: ArticleType = {};
    projectFirestore.collection("articles").doc(String(this.props.match.params.aId)).get().then(doc => {
      if (doc.exists) {
        article = {
          ...doc.data(),
          articleId: doc.id,
          features: []
        }
      }

      projectFirestore.collection("articleFeatures").get().then((querySnapshot) => {
        let features: ArticleFeatureType[] = [];
        querySnapshot.forEach(feature => {
          features.push({...feature.data(),articleFeatureId: feature.id});
        });

        for (const feature of features) {
          if (article.articleId === feature.articleId) {
            article.features?.push(feature)
          }
        }
        
        
        this.setArticleData(article);
      });
    });
  }

  private printOptionalMessage() {
    if (this.state.message === '') {
      return;
    }

    return (
      <Card.Text>
        { this.state.message }
      </Card.Text>
    )
  }

  render() {
    return(
      <Container>
        <MainMenu role='user' />
        
        <Card className="bg-secondary">
          <Card.Header className="bg-warning">
            <Card.Title>
            <FontAwesomeIcon icon={ faBoxOpen } /> {
                this.state.article ?
                this.state.article?.name :
                'Article not found.'
              }
            </Card.Title>
          </Card.Header>
          
          <Card.Body className="text-light">

            { this.printOptionalMessage() }
            
            {
              this.state.article ?
                ( this.renderArticleData(this.state.article) ) :
              ''
            }
            
          </Card.Body>
        </Card>
      </Container>
    )
  }

  renderArticleData(article: ArticleType) {
    return (
      <Row>
        <Col xs="12" lg="8">
          <div className="excerpt">
            { article.excerpt }
          </div>
          <hr />
          <div className="description">
            { article.description }
          </div>
          <hr />
          <b>Karakteristike:</b><br />
          <ul>
            { this.state.article?.features?.map(feature => (
              <li>
                { feature.name }: { feature.value }
              </li>
            ), this) }
          </ul>
        </Col>
        <Col xs="12" lg="4">
          <Row>
            <Col xs="12" className="mb-3">
              <img alt={ 'Image - ' + article.imageUrl }
                    src={ article.imageUrl }
                    className="w-100" />
            </Col>
          </Row>
          <Row>
            <Col xs="12" className="text-center mb-3">
              <b>
                Cena: { Number(article.price).toFixed(2) + ' RSD' }
              </b>
            </Col>
          </Row>
          <Row>
            <Col xs="12" className="mt-3">
              {/*<AddToCartInput article={ article } />*/}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}