import React, {useState, useEffect} from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import { GetMe } from './api/api';
import Login from './components/accounts/Login';
import Register from './components/accounts/Register';
import Cart from './components/cart/Cart';
import UserAccount from './components/accounts/UserAccount';
import Homepage from './components/home/Homepage';
import NavBar from './components/extras/NavBar';
import Product from './components/products/Product';
import Order from './components/orders/Order';
import PastOrders from './components/orders/PastOrders';
import ProductList from './components/search/ProductList';
import SellerProducts from './components/products/SellerProducts';
import FulfillOrder from './components/orders/FulfillOrder';
import 'antd/dist/antd.css';
import './App.css';

function App() {

	const [auth, setAuth] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		GetMe(localStorage.getItem('token'))
			.then(res => {
                // Just using localStorage instead of context
				localStorage.setItem('id', res.id);
				localStorage.setItem('isSeller', res.isSeller);
				setAuth(true);
				setLoading(false);
			})
			.catch(err => {
				setLoading(false);
			});
	}, [])

	if(loading) {
		return (
			<div style = {{width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				loading dot dot dot
			</div>
		)
	}

	return (
		<Router>
			<Route path='/(home|cart|user|product|order|search|products|orders|fulfill)' component={NavBar} />
			<Switch>
				<Redirect exact from='/' to='/home' />
				<Route exact path='/login' component={() => <Login setAuth={setAuth}/>} />
				<Route exact path='/register' component={() => <Register setAuth={setAuth}/>} />
				<ProtectedRoute exact auth={auth} path='/home' component={Homepage} />
				<ProtectedRoute exact auth={auth} path='/order/:id' component={Order} />
				<ProtectedRoute exact auth={auth} path='/orders' component={PastOrders} />
				<ProtectedRoute exact auth={auth} path='/cart' component={Cart} />
				<ProtectedRoute exact auth={auth} path='/fulfill' component={FulfillOrder} />
				<ProtectedRoute exact auth={auth} path='/user/:id' component={UserAccount} />
				<ProtectedRoute exact auth={auth} path='/product/:id' component = {Product} />
				<ProtectedRoute exact auth={auth} path='/products' component={SellerProducts} />
				<ProtectedRoute exact auth={auth} path='/search' component={ProductList} />
				<Redirect from='*' to='/home' />
			</Switch>
		</Router>
	);
}

export default App;