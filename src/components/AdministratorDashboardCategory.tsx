import React from 'react';
import { Container, Card, Table, Button, Modal, ModalBody, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faListUl, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import CategoryType from '../types/CategoryType';
import { projectFirestore, projectStorage } from '../firebase/config';
import MainMenu from './MainMenu';

interface AdministratorDashboardCategoryState {
  isAdministratorLoggedIn: boolean;
  categories: CategoryType[];

  addModal: {
    visible: boolean;
    name: string;
    parentCategoryId: string;
    message: string;
  };

  editModal: {
    categoryId?: string;
    visible: boolean;
    name: string;
    parentCategoryId: string;
    message: string;
  };
}

class AdministratorDashboardCategory extends React.Component {
  state: AdministratorDashboardCategoryState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      isAdministratorLoggedIn: true,
      categories: [],

      addModal: {
        visible: false,
        name: '',
        parentCategoryId: '',
        message: '',
      },

      editModal: {
        visible: false,
        name: '',
        parentCategoryId: '',
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
    this.getCategories();
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

  private setLogginState(isLoggedIn: boolean) {
    this.setState(Object.assign(this.state, {
      isAdministratorLoggedIn: isLoggedIn,
    }));
  }

  render() {
    return (
      <Container>
        <MainMenu role='administrator' />

        <Card>
          <Card.Header className="bg-warning">
            <Card.Title>
            <FontAwesomeIcon icon={ faListAlt } /> Kategorije
            </Card.Title>
          </Card.Header>

          <Card.Body>

            <Table hover size="sm" bordered>
              <thead>
                <tr>
                <th colSpan={ 3 }>
                    <Link to="/administrator/dashboard/"
                          className="btn btn-sm btn-warning">
                      <FontAwesomeIcon icon={ faBackward } /> Back to dashboard
                    </Link>
                  </th>
                  <th className="text-center">
                    <Button variant="warning" size="sm"
                            onClick={ () => this.showAddModal() }>
                      <FontAwesomeIcon icon={ faPlus } /> Add
                    </Button>
                  </th>
                </tr>
                <tr>
                  <th className="text-right">ID</th>
                  <th>Name</th>
                  <th className="text-right">Parent ID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                { this.state.categories.map(category => (
                  <tr>
                    <td className="text-right">{ category.categoryId }</td>
                    <td>{ category.name }</td>
                    <td className="text-right">{ category.parentCategoryId }</td>
                    <td className="text-center">
                      <Link to={ "/administrator/dashboard/feature/" + category.categoryId }
                            className="btn btn-sm btn-warning mr-2">
                        <FontAwesomeIcon icon={ faListUl } /> Features
                      </Link>

                      <Button variant="warning" size="sm"
                              onClick={ () => this.showEditModal(category) }>
                        <FontAwesomeIcon icon={ faEdit } /> Edit
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
            <Modal.Title>Add new category</Modal.Title>
          </Modal.Header>
          <ModalBody>
            <Form.Group>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control id="name" type="text" value={ this.state.addModal.name }
                      onChange={ (e) => this.setAddModalStringFieldState('name', e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="add-photo">Article photo</Form.Label>
              <Form.File id="add-photo" />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="parentCategoryId">Parent category</Form.Label>
              <Form.Control id="parentCategoryId" as="select" value={ this.state.addModal.parentCategoryId }
                            onChange={ (e) => this.setAddModalStringFieldState('parentCategoryId', e.target.value) }>
                <option value="null">No parent category</option>
                { this.state.categories.map(category => (
                  <option value={ category.categoryId }>
                    { category.name }
                  </option>
                )) }
              </Form.Control>
            </Form.Group>
            { this.state.addModal.message ? (
              <Alert variant="danger" value={ this.state.addModal.message } />
            ) : '' }
            <Form.Group>
              <Button variant="warning" onClick={ () => this.doAddCategory() }>
                <FontAwesomeIcon icon={ faPlus } /> Add new category
              </Button>
            </Form.Group>
          </ModalBody>
        </Modal>

        <Modal size="lg" centered show={ this.state.editModal.visible } onHide={ () => this.setEditModalVisibleState(false) }>
          <Modal.Header closeButton  className="bg-warning">
            <Modal.Title>Edit category</Modal.Title>
          </Modal.Header>
          <ModalBody>
            <Form.Group>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control id="name" type="text" value={ this.state.editModal.name }
                      onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value) } />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="parentCategoryId">Parent category</Form.Label>
              <Form.Control id="parentCategoryId" as="select" value={ this.state.editModal.parentCategoryId }
                            onChange={ (e) => this.setEditModalStringFieldState('parentCategoryId', e.target.value) }>
                <option value="null">No parent category</option>
                { this.state.categories
                      .filter(category => category.categoryId !== this.state.editModal.categoryId)
                      .map(category => (
                  <option value={ category.categoryId }>
                    { category.name }
                  </option>
                )) }
              </Form.Control>
            </Form.Group>
            { this.state.editModal.message ? (
              <Alert variant="danger" value={ this.state.editModal.message } />
            ) : '' }
            <Form.Group>
              <Button variant="warning" onClick={ () => this.doEditCategory() }>
                <FontAwesomeIcon icon={ faEdit } /> Edit category
              </Button>
            </Form.Group>
          </ModalBody>
        </Modal>
      </Container>
    );
  }

  private showAddModal() {
    this.setAddModalStringFieldState('name', '');
    this.setAddModalStringFieldState('imagePath', '');
    this.setAddModalStringFieldState('parentCategoryId', '');
    this.setAddModalStringFieldState('message', '');
    this.setAddModalVisibleState(true);
  }

  private doAddCategory() {
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
    const collectionRef = projectFirestore.collection('categories');

    storageRef.put(file).on('state_changed', (snap) => {
      
    }, (err) => {

    }, async () => {
      const url = await storageRef.getDownloadURL();
      const collectionData = {
        name: this.state.addModal.name,
        parentCategoryId: this.state.addModal.parentCategoryId,
        imageUrl: url
      };
      await collectionRef.add(collectionData);

      this.setAddModalVisibleState(false);
      this.getCategories();
    });
  }

  private showEditModal(category: CategoryType) {
    this.setEditModalStringFieldState('name', String(category.name));
    this.setEditModalStringFieldState('parentCategoryId', String(category.parentCategoryId));
    this.setEditModalStringFieldState('categoryId', String(category.categoryId));
    this.setEditModalStringFieldState('message', '');
    this.setEditModalVisibleState(true);
  }

  private doEditCategory() {
    projectFirestore.collection("categories").doc(this.state.editModal.categoryId).update({
      name: this.state.editModal.name,
      parentCategoryId: this.state.editModal.parentCategoryId,
    });

    this.setEditModalVisibleState(false);
    this.getCategories();
    
  }
}

export default AdministratorDashboardCategory;
