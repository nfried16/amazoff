import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import Cart from './components/cart/Cart';
import UserAccount from './components/accounts/UserAccount';
import Homepage from './components/home/Homepage';
import NavBar from './components/extras/NavBar';
import Product from './components/products/Product';
import Order from './components/orders/Order';
import ProductList from './components/search/ProductList';
import './App.css';

function App() {
	return (
		<Router>
			<Route exact path='/(home|cart|user|product|order|search)' component={NavBar} />
			<Switch>
				<Redirect exact from='/' to='/home' />
				<Route exact path='/home' component = {Homepage}/>
				<Route exact path='/order' component={Order} />
				<Route exact path="/cart" component = {Cart}/>
				<Route exact path="/user" component = {UserAccount}/>
				<Route exact path="/product" component={Product} />
				<Route exact path="/search" component={ProductList} />
				<Redirect from="*" to="/home" />
			</Switch>
		</Router>
	);
}

export default App;