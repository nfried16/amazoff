import React from 'react';
import {Link} from 'react-router-dom';

const Product = props => {
    return (
        <div>
            <center>
                PRODUCT
            </center>
            <center>
                <Link to="/cart">ADD TO CART</Link>
            </center>
        </div>
    );
}

export default Product;