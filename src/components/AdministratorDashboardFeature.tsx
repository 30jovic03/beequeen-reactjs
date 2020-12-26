import React from 'react';
import { Container, Card, Table, Button, Modal, ModalBody, Form, Alert } from 'react-bootstrap';
import { faPlus, faEdit, faListUl, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import FeatureType from '../types/FeatureType';
import { projectFirestore } from '../firebase/config';
import CategoryType from '../types/CategoryType';
import MainMenu from './MainMenu';

interface AdministratorDashboardFeatureProperties {
  match: {
    params: {
      cId: number;
    }
  }
}

interface AdministratorDashboardFeatureState {
  isAdministratorLoggedIn: boolean;
  features: FeatureType[];
  thisCategoryName: string;

  addModal: {
    visible: boolean;
    name: string;
    message: string;
  };

  editModal: {
    visible: boolean;
    featureId: string;
    name: string;
    message: string;
  };
}

class AdministratorDashboardFeature extends React.Component<AdministratorDashboardFeatureProperties> {
  state: AdministratorDashboardFeatureState;

  constructor(props: Readonly<AdministratorDashboardFeatureProperties>) {
    super(props);

    this.state = {
      isAdministratorLoggedIn: true,
      features: [],
      thisCategoryName: '',

      addModal: {
        visible: false,
        name: '',
        message: '',
      },

      editModal: {
        visible: false,
        featureId: '',
        name: '',
        message: '',
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

  componentDidMount() {
    this.getFeatures();
    this.getCategoryName();
  }
  componentDidUpdate(oldProps: any) {
    if (this.props.match.params.cId === oldProps.match.params.cId) {
      return;
    }

    this.getFeatures();
  }

  private getFeatures() {

    projectFirestore.collection("features").where("categoryId", "==", this.props.match.params.cId).get().then((querySnapshot) => {
      let documents: FeatureType[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), featureId: doc.id});
      });

      this.putFeaturesInState(documents);
    });
  }

  private putFeaturesInState(data: FeatureType[]) {

    const newState = Object.assign(this.state, {
      features: data,
    });

    this.setState(newState);
  }

  private getCategoryName() {

    projectFirestore.collection("categories").get().then((querySnapshot) => {
      let documents: CategoryType[] = [];
      querySnapshot.forEach(doc => {
        documents.push({...doc.data(), categoryId: doc.id});
      });

      const category = documents.find(doc => doc.categoryId === String(this.props.match.params.cId))
      const categoryName = category?.name
      
      this.setState(Object.assign(this.state, {
        thisCategoryName: categoryName,
      }));
    });
  }

  private setLogginState(isLoggedIn: boolean) {
    this.setState(Object.assign(this.state, {
      isAdministratorLoggedIn: isLoggedIn,
    }));
  }

  render() {

    return (
      <Container>
        <MainMenu role='administrator' />

        <Card className="bg-secondary">
          <Card.Header className="bg-warning">
            <Card.Title>
            <FontAwesomeIcon icon={ faListUl } /> Osobine kategorije "{ this.state.thisCategoryName }"
            </Card.Title>
          </Card.Header>

          <Card.Body>

            <Table hover size="sm" className="text-light" bordered>
              <thead>
                <tr>
                  <th colSpan={ 2 }>
                    <Link to="/administrator/dashboard/category/"
                          className="btn btn-sm btn-warning">
                      <FontAwesomeIcon icon={ faBackward } /> Nazad na 'Kategorije'
                    </Link>
                  </th>
                  <th className="text-center">
                    <Button variant="warning" size="sm"
                            onClick={ () => this.showAddModal() }>
                      <FontAwesomeIcon icon={ faPlus } /> Dodaj osobinu
                    </Button>
                  </th>
                </tr>
                <tr>
                  <th className="text-right">ID</th>
                  <th>Ime</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                { this.state.features.map(feature => (
                  <tr>
                    <td className="text-right">{ feature.featureId }</td>
                    <td>{ feature.name }</td>
                    <td className="text-center">
                      <Button variant="warning" size="sm"
                              onClick={ () => this.showEditModal(feature) }>
                        <FontAwesomeIcon icon={ faEdit } /> Izmeni
                      </Button>
                    </td>
                  </tr>
                ), this) }
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal size="lg" centered show={ this.state.addModal.visible } onHide={ () => this.setAddModalVisibleState(false) }>
          <Modal.Header closeButton  className="bg-warning">
            <Modal.Title>Dodaj novu osobinu</Modal.Title>
          </Modal.Header>
          <ModalBody className="bg-secondary text-light">
            <Form.Group>
              <Form.Label htmlFor="name">Ime</Form.Label>
              <Form.Control id="name" type="text" value={ this.state.addModal.name }
                      onChange={ (e) => this.setAddModalStringFieldState('name', e.target.value) } />
            </Form.Group>
            { this.state.addModal.message ? (
              <Alert variant="danger" value={ this.state.addModal.message } />
            ) : '' }
            <Form.Group>
              <Button variant="warning" onClick={ () => this.doAddFeature() }>
                <FontAwesomeIcon icon={ faPlus } /> Dodaj osobinu
              </Button>
            </Form.Group>
          </ModalBody>
        </Modal>

        <Modal size="lg" centered show={ this.state.editModal.visible } onHide={ () => this.setEditModalVisibleState(false) }>
          <Modal.Header closeButton className="bg-warning">
            <Modal.Title>Izmeni osobinu</Modal.Title>
          </Modal.Header>
          <ModalBody className="bg-secondary text-light">
            <Form.Group>
              <Form.Label htmlFor="name">Ime</Form.Label>
              <Form.Control id="name" type="text" value={ this.state.editModal.name }
                      onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value) } />
            </Form.Group>
            { this.state.editModal.message ? (
              <Alert variant="danger" value={ this.state.editModal.message } />
            ) : '' }
            <Form.Group>
              <Button variant="warning" onClick={ () => this.doEditFeature() }>
                <FontAwesomeIcon icon={ faEdit } /> Sačuvaj izmene
              </Button>
            </Form.Group>
          </ModalBody>
        </Modal>
      </Container>
    );
  }

  private showAddModal() {
    this.setAddModalStringFieldState('name', '');
    this.setAddModalStringFieldState('message', '');
    this.setAddModalVisibleState(true);
  }

  private doAddFeature() {
    const data = {
      name: this.state.addModal.name,
      categoryId: this.props.match.params.cId
    };

    projectFirestore.collection("features").add(data);

    this.setAddModalVisibleState(false);
    this.getFeatures();
    
  }

  private showEditModal(feature: FeatureType) {
    this.setEditModalStringFieldState('name', String(feature.name));
    this.setEditModalStringFieldState('featureId', String(feature.featureId));
    this.setEditModalStringFieldState('message', '');
    this.setEditModalVisibleState(true);
  }

  private doEditFeature() {

    projectFirestore.collection("features").doc(this.state.editModal.featureId).update({
      "name": this.state.editModal.name
    });

    this.setEditModalVisibleState(false);
    this.getFeatures();
    
  }
}

export default AdministratorDashboardFeature;
