import React from 'react';
import {Link} from 'react-router-dom';

const Cart = props => {
    return(
        <div>
            <center>
                CART
            </center>
            {/* show the items in the user's cart*/}
            <center>
                <Link to="/order">CHECK OUT</Link> {/* once clicked, should submit
                the whole cart as an order and run a check on available inventories and balances */}
            </center>
        </div>
    );
}

export default Cart;