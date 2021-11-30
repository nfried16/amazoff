import axios from 'axios';

const baseURL = 'http://' + (process.env.REACT_APP_API_URL || 'localhost') + ':5000';
console.log(baseURL);
const client = axios.create({
    timeout: 10000,
    baseURL: baseURL
});

const printOutput = true;

/* ---------- AUTHENTICATION ---------- */
export const GetMe = async (token) => {
    const { data } = await client.get('/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
};

export const Login = async (email, password) => {
    const { data } = await client.post('/login', {
        email: email,
        password: password
    });
    printOutput && console.log(data);
    return data;
};

export const Register = async (email, password, firstName, lastName, address, isSeller) => {
    const { data } = await client.post('/register', {
        email: email,
        first_name: firstName,
        last_name: lastName,
        address: address,
        password: password,
        is_seller: isSeller
    });
    printOutput && console.log(data);
    return data;
};

/* ---------- USERS ---------- */
export const GetUser = async (token, id) => {
    const { data } = await client.get(`/user/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const EditUser = async (token, user) => {
	const { data } = await client.patch("/user",
		user,
		{
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
	printOutput && console.log(data);
	return data;
};

/* ---------- PRODUCTS ---------- */
export const GetProductById = async (token, id) => {
    const { data } = await client.get(`/product/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const GetProductsBySeller = async (token, id) => {
    const { data } = await client.get(`/products/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const GetSellers = async (token, id) => {
    const { data } = await client.get(`/product/${id}/sellers`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const CreateProduct = async (token, formData) => {
    const { data } = await client.post(`/product`, 
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const EditProduct = async (token, formData, productId) => {
    const { data } = await client.patch(`/product/${productId}`, 
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const EditSellerProduct = async (token, formData, productId) => {
    const { data } = await client.patch(`/product/seller/${productId}`, 
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const StartSelling = async (token, formData, productId) => {
    const { data } = await client.post(`/product/${productId}`, 
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const SearchProducts = async (token, search, page, category, sort) => {
    let params = `/product?search=${search}&page=${page}`;
    if(category) {
        params += `&category=${category}`;
    }
    if(sort) {
        params += `&sort=${sort}`;
    }
    console.log(params)
    const { data } = await client.get(params,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const GetCategories = async (token) => {
    const { data } = await client.get(`/categories`, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }   
        }
    );
    printOutput && console.log(data);
    return data;
}

/* ---------- Cart ---------- */
export const GetCart = async (token) => {
    const { data } = await client.get(`/cart`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const AddToCart = async (token, sellerProduct) => {
    const { data } = await client.post(`/cart`, 
        sellerProduct,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const RemoveFromCart = async (token, product_id, seller_id) => {
    const { data } = await client.delete(`/cart/${product_id}/${seller_id}`, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const EditCartItem = async (token, product_id, seller_id, amount) => {
    const { data } = await client.patch(`/cart/${product_id}/${seller_id}`, 
        {
            amount: amount
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const Order = async (token) => {
    const { data } = await client.post(`/cart/order`, null, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const GetOrders = async (token) => {
    const { data } = await client.get(`/orders`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const GetSellerOrders = async (token) => {
    const { data } = await client.get(`/orders/seller`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const GetOrder = async (token, id) => {
    const { data } = await client.get(`/order/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const Fulfill = async (token, order_id, product_id) => {
    const { data } = await client.post(`/order/fulfill`, 
        {
            order_id: order_id,
            product_id: product_id
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

/* ---------- Reviews ---------- */
export const GetSellerReviews = async (token, id) => {
    const { data } = await client.get(`/reviews/seller/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const GetProductReviews = async (token, id) => {
    const { data } = await client.get(`/reviews/product/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const CanReviewSeller = async (token, id) => {
    const { data } = await client.get(`/review/validate/seller/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const CanReviewProduct = async (token, id) => {
    const { data } = await client.get(`/review/validate/product/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const CreateSellerReview = async (token, sellerId, title, rating, description) => {
    const { data } = await client.post(`/review/seller/${sellerId}`, 
        {
            title: title,
            rating: rating,
            description: description
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const CreateProductReview = async (token, productId, title, rating, description) => {
    const { data } = await client.post(`/review/product/${productId}`, 
        {
            title: title,
            rating: rating,
            description: description
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const EditSellerReview = async (token, sellerId, title, rating, description) => {
    const { data } = await client.patch(`/review/seller/${sellerId}`, 
        {
            title: title,
            rating: rating,
            description: description
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const EditProductReview = async (token, productId, title, rating, description) => {
    const { data } = await client.patch(`/review/product/${productId}`, 
        {
            title: title,
            rating: rating,
            description: description
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    printOutput && console.log(data);
    return data;
}

export const DeleteSellerReview = async (token, sellerId) => {
    const { data } = await client.delete(`/review/seller/${sellerId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}

export const DeleteProductReview = async (token, productId) => {
    const { data } = await client.delete(`/review/product/${productId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    printOutput && console.log(data);
    return data;
}