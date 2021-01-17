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
  category?: CategoryType;
  subcategories?: CategoryType[];
  articles?: ArticleType[];
  previewArticles?: ArticleType[];
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
    this.applyFilters();
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
    let articles: any[] = [];
    this.state.articles?.map(article => {
        articles.push(article)
      return articles;
    });

    articles = articles.filter(article =>
      article.name.includes(this.state.filters.keywords)
      );
    
    articles = articles.filter(article => 
      this.state.filters.priceMinimum < article.price && article.price < this.state.filters.priceMaximum
    );


    switch(this.state.filters.order) {
      case "name asc":
        articles?.sort(function(a,b) {
          return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
      });
      break;
      case "name desc":
        articles?.sort(function(a,b) {
          return ((a.name > b.name) ? -1 : ((a.name < b.name) ? 1 : 0));
      });
      break;
      case "price asc":
        articles?.sort(function(a, b) {
          return (a.price - b.price);
        });
      break;
      case "price desc":
        articles?.sort(function(a, b) {
          return (b.price - a.price);
        });
      break;
    }

    if (this.state.filters.selectedFeatures.length > 0) {
      let filteredArticles: any[] = [];
      this.state.filters.selectedFeatures.map(feature => {
        articles.map(article => {
          let articleFeature = article.features.find((articleFeature: { featureId: string; value: string; }) => articleFeature.featureId === feature.featureId && articleFeature.value === feature.value);
          if (articleFeature) {
            if (filteredArticles.length === 0) {
              filteredArticles.push(article)
            } else {
              let art = filteredArticles.find(art => art.articleId === article.articleId);
              if (!art) {
                filteredArticles.push(article)
              }
            }
          }
          return article; // for firebase build
        })
        return filteredArticles; //for build
      })
      articles = filteredArticles;
    }

    this.setState(Object.assign(this.state, {
      previewArticles: articles,
    }));
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
        <div>Trenutno nema ni jedan proizvod.</div>
      );
    }

    return (
      <Row>
        { this.state.previewArticles?.map(this.singleArticle) }
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

    projectFirestore.collection("articles").where("categoryId", "==", this.props.match.params.cId).get().then((querySnapshot) => {
      let articles: ArticleType[] = [];
      querySnapshot.forEach(doc => {
        articles.push({
          ...doc.data(),
          articleId: doc.id,
          features: []
        });
      });

      projectFirestore.collection("articleFeatures").get().then((querySnapshot) => {
        let features: ArticleFeatureType[] = [];
        querySnapshot.forEach(feature => {
          features.push({...feature.data(),articleFeatureId: feature.id});
        });

        for (let article of articles) {
          for (const feature of features) {
            if (article.articleId === feature.articleId) {
              article.features?.push(feature)
            }
          }
        }
        
        this.setArticles(articles);
      });
    });

    this.getFeatures();
  };

  private getFeatures() {
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
        return doc;
        //return doc only couse of build
      })
      
      this.setFeatures(features);
    });
  }
}