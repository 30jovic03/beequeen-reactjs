import React from 'react';
import { Container, Card, Table, Button, Modal, ModalBody, Form, Alert, FormGroup, Col, Row } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave, faImage, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ArticleType from '../types/ArticleType';
import CategoryType from '../types/CategoryType';
import { projectFirestore, projectStorage } from '../firebase/config';
import FeatureType from '../types/FeatureType';
import { Link } from 'react-router-dom';
import MainMenu from './MainMenu';

interface AdministratorDashboardArticleState {
  isAdministratorLoggedIn: boolean;
  articles: ArticleType[];
  categories: CategoryType[];
  selectedImg?: {
    name: string;
    image: string;
  };

  addModal: {
    visible: boolean;
    message: string;

    name: string;
    categoryId: string;
    categoryName: string;
    excerpt: string;
    description: string;
    price: number;
    features: {
      use: number;
      featureId: string;
      name: string;
      value: string;
    }[];
  };

  editModal: {
    visible: boolean;
    message: string;

    articleId?: string;
    name: string;
    categoryId: string;
    excerpt: string;
    description: string;
    price: number;
    features: {
      use: number;
      featureId: string;
      name: string;
      value: string;
    }[];
  };
}

interface FeatureBaseType {
  featureId: string;
  name?: string;
  value: string;
  use: number;
}

class AdministratorDashboardArticle extends React.Component {
  state: AdministratorDashboardArticleState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      isAdministratorLoggedIn: true,
      articles: [],
      categories: [],
      selectedImg: {
        name: '',
        image: ''
      },

      addModal: {
        visible: false,
        message: '',
        
        name: '',
        categoryId: '',
        categoryName: '',
        excerpt: '',
        description: '',
        price: 0.01,
        features: [],
      },

      editModal: {
        visible: false,
        message: '',

        name: '',
        categoryId: '',
        excerpt: '',
        description: '',
        price: 0.01,
        features: [],
      }
    };
  }

  private setAddModalVisibleState(newState: boolean) {
    this.setState(Object.assign(this.state, 
      Object.assign(this.state.addModal, {
        visible: newState,
      })
    ));
  }

  private setAddModalStringFieldState(fieldName: string, newValue: string) {
    this.setState(Object.assign(this.state, 
      Object.assign(this.state.addModal, {
        [ fieldName ]: newValue,
      })
    ));
  }

  private setAddModalNumberFieldState(fieldName: string, newValue: any) {
    this.setState(Object.assign(this.state, 
      Object.assign(this.state.addModal, {
        [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
      })
    ));
  }

  private setAddModalFeatureUse(featureId: string, use: boolean) {
    const addFeatures: { featureId: string; use: number; }[] = [...this.state.addModal.features];
    for (const feature of addFeatures) {
      if (feature.featureId === featureId) {
        feature.use = use ? 1 : 0;
        break;
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
        features: addFeatures,
      }),
    ));
  }

  private setAddModalFeatureValue(featureId: string, value: string) {
    const addFeatures: { featureId: string; value: string; }[] = [...this.state.addModal.features];
    for (const feature of addFeatures) {
      if (feature.featureId === featureId) {
        feature.value = value;
        break;
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
        features: addFeatures,
      }),
    ));
  }

  private setEditModalFeatureUse(featureId: string, use: boolean) {
    const editFeatures: { featureId: string; use: number; }[] = [...this.state.editModal.features];
    for (const feature of editFeatures) {
      if (feature.featureId === featureId) {
        feature.use = use ? 1 : 0;
        break;
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
        features: editFeatures,
      }),
    ));
  }

  private setEditModalFeatureValue(featureId: string, value: string) {
    const editFeatures: { featureId: string; value: string; }[] = [...this.state.editModal.features];
    for (const feature of editFeatures) {
      if (feature.featureId === featureId) {
        feature.value = value;
        break;
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
        features: editFeatures,
      }),
    ));
  }

  private setEditModalVisibleState(newState: boolean) {
    this.setState(Object.assign(this.state, 
      Object.assign(this.state.editModal, {
        visible: newState,
      })
    ));
  }

  private setEditModalStringFieldState(fieldName: string, newValue: string) {
    this.setState(Object.assign(this.state, 
      Object.assign(this.state.editModal, {
        [ fieldName ]: newValue,
      })
    ));
  }

  private setEditModalNumberFieldState(fieldName: string, newValue: any) {
    this.setState(Object.assign(this.state, 
      Object.assign(this.state.editModal, {
        [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
      })
    ));
  }

  componentDidMount() {
    this.getCategories();
    this.getArticles();
  }

  private getCategories() {

    projectFirestore.collection("categories").get().then((querySnapshot) => {
      let documents: CategoryType[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), categoryId: doc.id});
      });

      this.putCategoriesInState(documents);
    });
  }

  private putCategoriesInState(data: CategoryType[]) {

    this.setState(Object.assign(this.state, {
      categories: data,
    }));
  }

  private getArticles() {

    projectFirestore.collection("articles").get().then((querySnapshot) => {
      let documents: ArticleType[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), articleId: doc.id});
      });

      this.putArticlesInState(documents);
    });
  }

  private putArticlesInState(data: ArticleType[]) {

    this.setState(Object.assign(this.state, {
      articles: data,
    }));
  }

  private setLogginState(isLoggedIn: boolean) {
    this.setState(Object.assign(this.state, {
      isAdministratorLoggedIn: isLoggedIn,
    }));
  }

  private setSelectedImg(name?: string, img?: string) {
    this.setState(Object.assign(this.state.selectedImg, 
      {
        name: name,
        image: img
      }));
  }

  private addModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setAddModalStringFieldState('categoryId', event.target.value);

    let categoryName = (this.state.categories.find(category => category.categoryId === event.target.value))?.name;
    if (categoryName) {
    this.setAddModalStringFieldState('categoryName', categoryName);
    };

    projectFirestore.collection("features").where("categoryId", "==", event.target.value).get().then((querySnapshot) => {
      let documents: FeatureType[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), featureId: doc.id});
      });
      
      let features: FeatureBaseType[] = [];
      documents.forEach(doc => {
        features.push({
          featureId: doc.featureId, 
          name: doc.name,
          value: '',
          use: 0,
        });
      });

      this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal, {
          features: features,
        }),
      ));
    });
  }

  render() {

    return (
      <Container>
        <MainMenu role='administrator' />

        <Card>
          <Card.Header className="bg-warning">
            <Card.Title>
            <FontAwesomeIcon icon={ faListAlt } /> Artikli
            </Card.Title>
          </Card.Header>

          <Card.Body>

            <Table hover size="sm" bordered>
              <thead>
                <tr>
                  <th colSpan={ 4 }>
                    <Link to="/administrator/dashboard/"
                          className="btn btn-sm btn-warning">
                      <FontAwesomeIcon icon={ faBackward } /> Početna (admin)
                    </Link>
                  </th>
                  <th className="text-center">
                    <Button variant="warning" size="sm"
                            onClick={ () => this.showAddModal() }>
                      <FontAwesomeIcon icon={ faPlus } /> Dodaj artikal
                    </Button>
                  </th>
                </tr>
                <tr>
                  <th className="text-right">ID</th>
                  <th>Ime</th>
                  <th>Kategorija</th>
                  <th className="text-right">Cena</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                { this.state.articles.map(article => (
                  <tr>
                    <td className="text-right">{ article.articleId }</td>
                    <td>{ article.name }</td>
                    <td>{ article.categoryName }</td>
                    <td className="text-right">{ article.price }</td>
                    <td className="text-center">
                      <Button variant="warning" size="sm"
                              onClick={ () => this.setSelectedImg(article.name, article.imageUrl) }>
                        <FontAwesomeIcon icon={ faImage } /> Slika
                      </Button>
                      {' '}
                      <Button variant="warning" size="sm"
                              onClick={ () => this.showEditModal(article) }>
                        <FontAwesomeIcon icon={ faEdit } /> Izmeni
                      </Button>
                    </td>
                  </tr>
                ), this) }
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal size="lg" centered show={ this.state.selectedImg && this.state.selectedImg.image.length > 0 } onHide={ () => this.setSelectedImg('', '') }>
        <Modal.Header closeButton className="bg-warning">
            <Modal.Title>{this.state.selectedImg?.name}</Modal.Title>
          </Modal.Header>
          <ModalBody className="backdrop">
            <img src={this.state.selectedImg?.image} alt="img"/>
          </ModalBody>
        </Modal>

        <Modal size="lg" centered show={ this.state.addModal.visible } onHide={ () => this.setAddModalVisibleState(false) }>
          <Modal.Header closeButton className="bg-warning">
            <Modal.Title>Dodaj novi artikal</Modal.Title>
          </Modal.Header>
          <ModalBody>
            <Form.Group>
              <Form.Label htmlFor="add-categoryId">Kategorija</Form.Label>
              <Form.Control id="add-categoryId" as="select" value={ this.state.addModal.categoryId }
                            onChange={ (e) => this.addModalCategoryChanged(e as any) }>
                { this.state.categories.map(category => (
                  <option value={ category.categoryId }>
                    { category.name }
                  </option>
                )) }
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="add-name">Ime</Form.Label>
              <Form.Control id="add-name" type="text" value={ this.state.addModal.name }
                      onChange={ (e) => this.setAddModalStringFieldState('name', e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="add-excerpt">Kratak opis</Form.Label>
              <Form.Control id="add-excerpt" type="text" value={ this.state.addModal.excerpt }
                      onChange={ (e) => this.setAddModalStringFieldState('excerpt', e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="add-description">Detaljan opis</Form.Label>
              <Form.Control id="add-description" as="textarea" value={ this.state.addModal.description }
                      onChange={ (e) => this.setAddModalStringFieldState('description', e.target.value) }
                      rows={ 10 } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="add-price">Cena</Form.Label>
              <Form.Control id="add-price" type="number" min={0.01} step={0.01} value={ this.state.addModal.price }
                      onChange={ (e) => this.setAddModalNumberFieldState('price', e.target.value) } />
            </Form.Group>

            <div>
              { this.state.addModal.features.map(this.printAddModalFeatureInput, this) }
            </div>

            <Form.Group>
              <Form.Label htmlFor="add-photo">Slika</Form.Label>
              <Form.File id="add-photo" />
            </Form.Group>
            <Form.Group>
              <Button variant="warning" onClick={ () => this.doAddArticle() }>
                <FontAwesomeIcon icon={ faPlus } /> Dodaj artikal
              </Button>
            </Form.Group>

            { this.state.addModal.message ? (
              <Alert variant="danger" value={ this.state.addModal.message } />
            ) : '' }
          </ModalBody>
        </Modal>

        <Modal size="lg" centered show={ this.state.editModal.visible } onHide={ () => this.setEditModalVisibleState(false) }>
          <Modal.Header closeButton className="bg-warning">
            <Modal.Title>Izmeni artikal</Modal.Title>
          </Modal.Header>
          <ModalBody>
            <Form.Group>
              <Form.Label htmlFor="edit-name">Ime</Form.Label>
              <Form.Control id="edit-name" type="text" value={ this.state.editModal.name }
                      onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="edit-excerpt">Kratak opis</Form.Label>
              <Form.Control id="edit-excerpt" type="text" value={ this.state.editModal.excerpt }
                      onChange={ (e) => this.setEditModalStringFieldState('excerpt', e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="edit-description">Detaljan opis</Form.Label>
              <Form.Control id="edit-description" as="textarea" value={ this.state.editModal.description }
                      onChange={ (e) => this.setEditModalStringFieldState('description', e.target.value) }
                      rows={ 10 } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="edit-price">Cena</Form.Label>
              <Form.Control id="edit-price" type="number" min={0.01} step={0.01} value={ this.state.editModal.price }
                      onChange={ (e) => this.setEditModalNumberFieldState('price', e.target.value) } />
            </Form.Group>
            
            <div>
              { this.state.editModal.features.map(this.printEditModalFeatureInput, this) }
            </div>
            
            <Form.Group>
              <Button variant="warning" onClick={ () => this.doEditArticle() }>
                <FontAwesomeIcon icon={ faSave } /> Sačuvaj izmene
              </Button>
            </Form.Group>

            { this.state.editModal.message ? (
              <Alert variant="danger" value={ this.state.editModal.message } />
            ) : '' }
          </ModalBody>
        </Modal>

      </Container>
    );
  }

  private printAddModalFeatureInput(feature: any) {
    return (
      <FormGroup>
        <Row>
          <Col xs="4" sm="1" className="text-center">
            <input type="checkbox" value="1" checked={ feature.use === 1 }
                onChange={ (e) => this.setAddModalFeatureUse(feature.featureId, e.target.checked) } />
          </Col>
          <Col xs="8" sm="3">
            { feature.name }
          </Col>
          <Col xs="12" sm="8">
            <Form.Control type="text" value={ feature.value }
                onChange={ (e) => this.setAddModalFeatureValue(feature.featureId, e.target.value) } />
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private printEditModalFeatureInput(feature: any) {
    return (
      <FormGroup>
        <Row>
          <Col xs="4" sm="1" className="text-center">
            <input type="checkbox" value="1" checked={ feature.use === 1 }
                onChange={ (e) => this.setEditModalFeatureUse(feature.featureId, e.target.checked) } />
          </Col>
          <Col xs="8" sm="3">
            { feature.name }
          </Col>
          <Col xs="12" sm="8">
            <Form.Control type="text" value={ feature.value }
                onChange={ (e) => this.setEditModalFeatureValue(feature.featureId, e.target.value) } />
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private showAddModal() {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
        visible: true,
        message: '',
        name: '',
        categoryId: 1,
        excerpt: '',
        description: '',
        price: 0.01,
        features: [],
      }),
    ));
  }

  private doAddArticle() {
    const types = ['image/png', 'image/jpeg'];
    let filePicker: any = document.getElementById('add-photo');
    const selectedFile = filePicker.files[0];
    let file: any = null;
    
    if (selectedFile && types.includes(selectedFile.type)) {
      file = selectedFile;
      this.setAddModalStringFieldState('message', '');
    } else {
      this.setAddModalStringFieldState('message', 'Please select an image file (png or jpg)!');
      filePicker.value = '';
    }

    const storageRef = projectStorage.ref(file.name);
    const collectionRef = projectFirestore.collection('articles');

    storageRef.put(file).on('state_changed', (snap) => {
      
    }, (err) => {

    }, async () => {
      const url = await storageRef.getDownloadURL();
      const collectionData = {
        categoryId: this.state.addModal.categoryId,
        categoryName: this.state.addModal.categoryName,
        name: this.state.addModal.name,
        excerpt: this.state.addModal.excerpt,
        description: this.state.addModal.description,
        price: this.state.addModal.price,
        features: this.state.addModal.features
            .filter(feature => feature.use === 1)
            .map(feature => ({
              featureId: feature.featureId,
              name: feature.name,
              value: feature.value,
            })),
        imageUrl: url
      };
      await collectionRef.add(collectionData);

      this.setAddModalVisibleState(false);
      this.getArticles();

    });
  }

  private async showEditModal(article: ArticleType) {
    this.setEditModalStringFieldState('name', String(article.name));
    this.setEditModalStringFieldState('articleId', String(article.articleId));
    this.setEditModalStringFieldState('excerpt', String(article.excerpt));
    this.setEditModalStringFieldState('description', String(article.description));
    this.setEditModalNumberFieldState('price', article.price);
    this.setEditModalStringFieldState('message', '');

    if (!article.categoryId) {
      return;
    }
    
    const categoryId: string = article.categoryId;

    let allFeatures: any[] = [];

    projectFirestore.collection("features").where("categoryId", "==", categoryId).get().then((querySnapshot) => {
      let documents: FeatureType[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), featureId: doc.id});
      });
      
      documents.forEach(doc => {
        allFeatures.push({
          featureId: doc.featureId, 
          name: doc.name,
          value: '',
          use: 0,
        });
      });

      if (article.features) {
        for (let apiFeature of allFeatures) {
          for (const articleFeature of article.features) {
            if (articleFeature.featureId === apiFeature.featureId) {
              apiFeature.use = 1;
              apiFeature.value = articleFeature.value;
            }
          }
        }
      }

      this.setState(Object.assign(this.state,
        Object.assign(this.state.editModal, {
          features:allFeatures,
        }),
      ));
      
      this.setEditModalVisibleState(true);
    });
  }

  private doEditArticle() {

    projectFirestore.collection("articles").doc(this.state.editModal.articleId).update({
      "name": this.state.editModal.name,
      "excerpt": this.state.editModal.excerpt,
      "description": this.state.editModal.description,
      "price": this.state.editModal.price,
      "features": this.state.editModal.features
            .filter(feature => feature.use === 1)
            .map(feature => ({
              featureId: feature.featureId,
              name: feature.name,
              value: feature.value,
            })),
    });

    this.setEditModalVisibleState(false);
    this.getArticles();
  }
}

export default AdministratorDashboardArticle;
