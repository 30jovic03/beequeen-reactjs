import React from 'react';
import { Container, Card, Col, Row, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import CategoryType from '../types/CategoryType';
import ArticleType from '../types/ArticleType';
import { Link } from 'react-router-dom';
import SingleArticlePreview from './SingleArticlePreview';
import MainMenu from './MainMenu';
import { projectFirestore } from '../firebase/config';
import ArticleFeatureType from '../types/ArticleFeatureType';

interface CategoryPageProperties {
  match: {
    params: {
      cId: number;
    }
  }
}

interface CategoryPageState {
  isUserLoggedIn: boolean;
  category?: CategoryType;
  subcategories?: CategoryType[];
  articles?: ArticleType[];
  message: string;
  filters: {
    keywords: string;
    priceMinimum: number;
    priceMaximum: number;
    order: "name asc" | "name desc" | "price asc" | "price desc";
    selectedFeatures: {
      featureId: string;
      value: string;
    }[];
  };
  features: {
    articleFeatureId: string;
    featureId: string;
    name: string;
    values: string[];
  }[];
}

interface FeatureBaseType {
  articleFeatureId?: string;
  featureId?: string;
  name?: string;
  values: string[];
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
  state: CategoryPageState;

  constructor(props: Readonly<CategoryPageProperties>) {
    super(props);

    this.state = {
      isUserLoggedIn: true,
      message: '',
      filters: {
        keywords: '',
        priceMinimum: 0.01,
        priceMaximum: 100000,
        order: "price asc",
        selectedFeatures: [],
      },
      features: [],
    };
  }

  private setFeatures(features: ArticleFeatureType[]) {
    const newState = Object.assign(this.state, {
      features: features,
    });

    this.setState(newState);
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

  private setCategoryData(category: CategoryType) {
    const newState = Object.assign(this.state, {
      category: category,
    });

    this.setState(newState);
  }

  private setSubcategories(subcategories: CategoryType[]) {
    const newState = Object.assign(this.state, {
      subcategories: subcategories,
    });

    this.setState(newState);
  }

  private setArticles(articles: ArticleType[]) {
    const newState = Object.assign(this.state, {
      articles: articles,
    });

    this.setState(newState);
  }

  render() {
    return (
      <Container>
        <MainMenu role='user' />

        <Card className="bg-secondary">
          <Card.Header className="bg-warning">
            <Card.Title>
            <FontAwesomeIcon icon={ faListAlt } /> { this.state.category?.name }
            </Card.Title>
          </Card.Header>
          <Card.Body>
            { this.printOptionalMessage() }
            { this.showContent() }
          </Card.Body>
        </Card>
      </Container>
    );
  }

  private printFilters() {
    return(
      <>
        <Form.Group className="text-light">
          <Form.Label htmlFor="keywords">Naziv proizvoda:</Form.Label>
          <Form.Control type="text" id="keywords" 
                        value={ this.state.filters.keywords } 
                        onChange={ (e) => this.filterKeywordsChanged(e as any) } 
                        />
        </Form.Group>

        <Form.Group className="text-light">
          <Row>
            <Col xs="12" sm="6">
              <Form.Label htmlFor="priceMin">Min cena:</Form.Label>
              <Form.Control type="number" id="priceMin"
                            step="0.01" min="0.01" max="99999.99"
                            value={ this.state.filters.priceMinimum }
                            onChange={ (e) => this.filterPriceMinChanged(e as any) } />
            </Col>
            <Col xs="12" sm="6">
             <Form.Label htmlFor="priceMax">Max cena:</Form.Label>
              <Form.Control type="number" id="priceMax"
                            step="0.01" min="0.02" max="100000"
                            value={ this.state.filters.priceMaximum }
                            onChange={ (e) => this.filterPriceMaxChanged(e as any) } />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Form.Control as="select" id="sortOrder"
                        value={ this.state.filters.order } 
                        onChange={ (e) => this.filterOrderChanged(e as any) } >
            <option value="name asc">Sortiraj po nazivu A-Z</option>
            <option value="name desc">Sortiraj po nazivu Z-A</option>
            <option value="price asc">Sortiraj po ceni - rastuće</option>
            <option value="price desc">Sortiraj po ceni - opadajuće</option>
          </Form.Control>
        </Form.Group>

        { this.state.features.map(this.printFeatureFilterComponent, this) }

        <Form.Group>
          <Button variant="warning" block onClick={ () => this.applyFilters() }>
            <FontAwesomeIcon icon={ faSearch } /> Pretraži
          </Button>
        </Form.Group>
      </>
    );
  }

  private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>) {
    this.setNewFilter(Object.assign(this.state.filters, {
      keywords: event.target.value,
    }));
  }

  private filterPriceMinChanged(event: React.ChangeEvent<HTMLInputElement>) {
    this.setNewFilter(Object.assign(this.state.filters, {
      priceMinimum: Number(event.target.value),
    }));
  }

  private filterPriceMaxChanged(event: React.ChangeEvent<HTMLInputElement>) {
    this.setNewFilter(Object.assign(this.state.filters, {
      priceMaximum: Number(event.target.value),
    }));
  }

  private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setNewFilter(Object.assign(this.state.filters, {
      order: event.target.value,
    }));
  }

  private applyFilters() {
    this.getCategoryData();
  }

  private setNewFilter(newFilter: any) {
    this.setState(Object.assign(this.state, {
      filter: newFilter,
    }));
  }

  private printFeatureFilterComponent(feature: {
    featureId: string; name: string; values: string[]; }) {
    return (
      <Form.Group className="text-light">
        <Form.Label><strong>{ feature.name }</strong></Form.Label>
        { feature.values.map(value => this.printFeatureFilterCheckBox(feature, value), this) }
      </Form.Group>
    );
  }

  private printFeatureFilterCheckBox(feature: any, value: string) {
    return (
      <Form.Check type="checkbox" label={ value } 
                  value={ value } 
                  data-feature-id={ feature.featureId }
                  onChange={ (event: any) => this.featureFilterChanged(event as any) }
                  />
    )
  }

  private featureFilterChanged(event :React.ChangeEvent<HTMLInputElement>) {
    const featureId = String(event.target.dataset.featureId);
    const value = event.target.value;

    (event.target.checked) ? 
      this.addFeatureFilterValue(featureId, value) : 
      this.removeFeatureFilterValue(featureId, value)
  }

  private addFeatureFilterValue(featureId: string, value: string) {
    const newSelectedFeatures = [ ...this.state.filters.selectedFeatures ];

    newSelectedFeatures.push({
      featureId: featureId,
      value: value,
    });

    this.setSelectedFeatures(newSelectedFeatures);
  }

  private removeFeatureFilterValue(featureId: string, value: string) {
    const newSelectedFeatures = this.state.filters.selectedFeatures.filter(record => {
      return !(record.featureId === featureId && record.value === value);
    });

    this.setSelectedFeatures(newSelectedFeatures);
  }

  private setSelectedFeatures(newSelectedFeatures: any) {
    this.setState(Object.assign(this.state, {
      filters: Object.assign(this.state.filters, {
        selectedFeatures: newSelectedFeatures,
      })
    }));
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

  private showContent() {
    if (this.state.subcategories?.length === 0) {
      return (
        <Row>
          <Col xs="12" md="4" lg="3">
            { this.printFilters() }
          </Col>
          <Col xs="12" md="8" lg="9">
            { this.showArticles() }
          </Col>
        </Row>
      );
    }

    return (
      this.showSubcategories()
    )
  }

  private showSubcategories() {
    return (
      <ul id="grid" className="clear">
        { this.state.subcategories?.map(this.singleCategory) }
      </ul>
    );
  }

  private singleCategory(category: CategoryType) {
    return (
      <li>
        <Link to={ `/category/${ category.categoryId }` }>
          <div className="hexagon">
            <img src={ category.imageUrl } alt={ category.name } />
            <p>{ category.name }</p>
          </div>
        </Link>
      </li>
    );
  }

  private showArticles() {
    if (this.state.articles?.length === 0) {
      return (
        <div>U ovoj kategoriji trenutno nema ni jedan proizvod.</div>
      );
    }

    return (
      <Row>
        { this.state.articles?.map(this.singleArticle) }
      </Row>
    );
  }

  private singleArticle(article: ArticleType) {
    return (
      <SingleArticlePreview article={article} />
    );
  }

  componentDidMount() {
    this.getCategoryData();
  }
  componentDidUpdate(oldProperties: CategoryPageProperties) {
    if (oldProperties.match.params.cId === this.props.match.params.cId) {
      return;
    }

    this.getCategoryData();
  }

  private getCategoryData() {
    projectFirestore.collection("categories").doc(String(this.props.match.params.cId)).get().then((doc) => {
        const categoryData: CategoryType = {
          categoryId: doc.id,
          name: doc.data()?.name
        };

      this.setCategoryData(categoryData);
    });

    projectFirestore.collection("categories").where("parentCategoryId", "==", this.props.match.params.cId).get().then((querySnapshot) => {
      let documents: CategoryType[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), categoryId: doc.id});
      });

      this.setSubcategories(documents);
    });
    
    //const orderParts = this.state.filters.order.split(' ');
    //const orderBy = orderParts[0];
    //const orderDirection = orderParts[1].toUpperCase();

    const featureFilters: any[] = [];

    for (const item of this.state.filters.selectedFeatures) {
      let found = false;
      let foundRef = null;

      for (const featureFilter of featureFilters) {
        if (featureFilter.featureId === item.featureId) {
          found = true;
          foundRef = featureFilter;
          break;
        }
      }

      if (!found) {
        featureFilters.push({
          featureId: item.featureId,
          values: [ item.value ],
        });
      } else {
        foundRef.values.push(item.value);
      }
    }

    projectFirestore.collection("articles").where("categoryId", "==", this.props.match.params.cId).get().then((querySnapshot) => {
      let documents: ArticleType[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), articleId: doc.id});
      });

      this.setArticles(documents);
    });

    {/*api('api/article/search/', 'post', {
      categoryId: Number(this.props.match.params.cId),
      keywords: this.state.filters.keywords,
      priceMin: this.state.filters.priceMinimum,
      priceMax: this.state.filters.priceMaximum,
      features: featureFilters,
      orderBy: orderBy,
      orderDirection: orderDirection,
    })
    .then((res: ApiResponse) => {
      if (res.status === 'login') {
        return this.setLogginState(false);
      }

      if (res.status === 'error') {
        return this.setMessage('Request error. Please try to refresh the page.');
      }

      if (res.data.statusCode === 0) {
        this.setMessage('');
        this.setArticles([ ]);
        return;
      }

      const articles: ArticleType[] =
      res.data.map((article: ArticleDto) => {
        const object: ArticleType = {
          articleId: article.articleId,
          name: article.name,
          excerpt: article.excerpt,
          description: article.description,
          imageUrl: '',
          price: 0,
        };

        if (article.photos && article.photos.length > 0) {
          object.imageUrl = article.photos[article.photos.length-1].imagePath;
        }

        if (article.articlePrices && article.articlePrices.length > 0) {
          object.price = article.articlePrices[article.articlePrices.length-1].price;
        }

        return object;
      });

      this.setArticles(articles);
    });*/}

    this.getFeatures();
  };

  getFeatures() {
    projectFirestore.collection("articleFeatures").where("categoryId", "==", this.props.match.params.cId).get().then((querySnapshot) => {
      let documents: ArticleFeatureType[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(),
        articleFeatureId: doc.id});
      });
      
      let features: FeatureBaseType[] = [];
      documents.map(doc => {
        if (features.length === 0) {
          if (doc.value) {
            features.push({
              articleFeatureId: doc.articleFeatureId,
              featureId: doc.featureId,
              name: doc.name,
              values: [doc.value]
            })
          }
        } else {
          let feature = features.find(feature => feature.featureId === doc.featureId);
          if (!feature) {
            if (doc.value) {
              features.push({
                articleFeatureId: doc.articleFeatureId,
                featureId: doc.featureId,
                name: doc.name,
                values: [doc.value]
              })
            }
          } else {
            let value = feature.values.find(value => value === doc.value)
            if (!value) {
              if (doc.value) {
                feature.values.push(doc.value);
              }
            }
          }
        }
      })
      
      this.setFeatures(features);
    });
  }
}