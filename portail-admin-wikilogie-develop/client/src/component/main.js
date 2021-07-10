import Fields from './Fields';
import Users from './Users';
import UserFields from './UserFields';
import Quizz from './Quizz';
import Follows from './Follows';
import ArticlesToVerify from './ArticlesToVerify';
import Accueil from './accueil';
import { BrowserRouter as Router,Switch, Route } from 'react-router-dom';

const Main = () => (
    <Router>
      <Switch>
        <Route path='/Fields' component={Fields} />
        <Route path='/Users' component={Users} />
        <Route path='/UserFields' component={UserFields} />
        <Route path='/Quizz' component={Quizz} />
        <Route path='/Follows' component={Follows} />
        <Route path='/ArticlesToVerify' component={ArticlesToVerify} />
        <Route path='/Accueil' component={Accueil} />
        <Route path='/' component={Accueil} />
      </Switch>
    </Router>
  )
  
  export default Main;
