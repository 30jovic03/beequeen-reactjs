import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryType from '../types/CategoryType';
import { Link } from 'react-router-dom';
import { projectFirestore } from '../firebase/config';
import MainMenu from './MainMenu';

interface HomePageState {
  categories: CategoryType[];
}

class HomePage extends React.Component {
  state: HomePageState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    this.getCategories();
  }

  private getCategories() {
    projectFirestore.collection("categories").where("parentCategoryId", "==", "").get().then((querySnapshot) => {
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

  render() {
    return (
      <Container>
        <MainMenu role='user' />

        <Card>
          <Card.Header className="bg-warning">
            <Card.Title>
              <FontAwesomeIcon icon={ faListAlt } /> Kategorije proizvoda
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <ul id="grid" className="clear">
              { this.state.categories.map(this.singleCategory) }
            </ul>
          </Card.Body>
        </Card>
      </Container>
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
}

export default HomePage;
