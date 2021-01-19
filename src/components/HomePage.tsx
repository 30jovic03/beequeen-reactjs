import React from 'react';
import { Container } from 'react-bootstrap';
import CategoryType from '../types/CategoryType';
import { Link } from 'react-router-dom';
import { auth, projectFirestore } from '../firebase/config';
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
        
        <Container className="bg-secondary home-page">
          <img className="honey-img" src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/honey-clipart-realistic.png?alt=media&token=53885089-d838-4ea6-938e-fdcde84e762c" alt="honey" />
          <ul id="grid" className="clear">
            { this.state.categories.map(this.singleCategory) }
          </ul>
        </Container>
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
