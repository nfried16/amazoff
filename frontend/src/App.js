import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from 'react-router-dom';
import Cart from './components/cart/Cart';
import './App.css';

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<center>
						Home
					</center>
				</Route>
				<Route path="/cart">
					<Cart />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
