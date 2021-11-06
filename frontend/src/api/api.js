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

export const SearchProducts = async (token, search) => {
    const { data } = await client.get(`/product?search=${search}`,
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
