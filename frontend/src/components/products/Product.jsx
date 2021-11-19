import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GetProductById, GetProductReviews, GetSellers, CanReviewProduct } from '../../api/api';
import AddToCart from './AddToCart';
import EditProduct from './EditProduct';
import StartSelling from './StartSelling';
import { Table, Select } from 'antd';
import ReviewCard from '../reviews/ReviewCard';
import AddReview from '../reviews/AddReview';

const Product = props => {

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [sellers, setSellers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);

    useEffect(() => {
        setLoading(true);
        getProduct()
            .then(async res => {
                await Promise.all(
                    [
                        getSellers(),
                        getReviews()
                    ]
                );
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            })
    }, [props.match.params.id])

    const isSeller = product && localStorage.getItem('isSeller') === 'true';
    const canSell = isSeller && !sellers.some(seller => seller.id == localStorage.getItem('id'));
    const isCreator = product && product.creator == localStorage.getItem('id');
    const productId = props.match.params.id;

    const getProduct = async () => {
        await GetProductById(localStorage.getItem('token'), productId)
            .then(async res => {
                setProduct(res);
            })
    }

    const getSellers = async () => {
        await GetSellers(localStorage.getItem('token'), productId)
            .then(res => {
                setSellers(res.map(row => {
                    row.key = row.id
                    row.qty = 1; 
                    return row;
                }));
            })
    }

    const getReviews = async () => {
        checkCanReview();
        const revs = await GetProductReviews(localStorage.getItem('token'), productId)
            .then(res => {
                // Move user's reviews to beginning
                res.forEach((rev, i) => {
                    if(rev.user_id == localStorage.getItem('id')){
                        res.splice(i, 1);
                        res.unshift(rev);
                    }
                });
                return res;
            })
            .catch(err => []);
        setReviews(revs);
    }

    const checkCanReview = async () => {
        await CanReviewProduct(localStorage.getItem('token'), productId)
            .then(res => setCanReview(res))
            .catch(err => setCanReview(false));
    }

    const options = Array.from(
        {length: 10}, 
        (_, i) => {
            return {value: i+1}
        }
    )

    const columns = [
        {
            title: 'Seller', key: 'name', dataIndex: 'name',
            render: (text, record) => (
                <div style={{ color: '#007185', cursor: 'pointer' }}
                    onClick={() => props.history.push(`/user/${record.id}`)}
                >
                    {`${record.first_name} ${record.last_name}`}
                </div>
            )
        },
        { title: 'Price', key: 'price', dataIndex: 'price' },
        { title: 'Amount in stock', key: 'amt_in_stock', dataIndex: 'amt_in_stock' },
        { 
            title: 'Qty: ', key: 'qty', dataIndex: 'qty', 
            render: (text, record) => (
                <Select 
                    options={options} 
                    defaultValue={1}
                    onChange = {val => {
                        record.qty = val
                    }}
                />
            ),
        },
        {
            title: 'Add to cart', key: 'add', dataIndex: 'add',
            render: (text, record) => (
                <AddToCart product_id={productId} record={record}/>
            ),
        }
    ];

    const reviewRender = !reviews ? [] : reviews.map(review => (
        review.user_id == localStorage.getItem('id') ?
        <ReviewCard 
            updateReviews={getReviews}
            key = {review.user_id+'-'+review.product_id}
            {...review}
        /> :
        <ReviewCard 
            key = {review.user_id+'-'+review.product_id}
            {...review}
        />
    ))
    
    return (
        <div style = {{marginTop: '10vh', width: '100%', display: 'flex', justifyContent: 'center'}}>
            {
                loading ? 'loading dot dot dot' : (
                    !product ? (
                        'Product does not exist'
                    ) : (
                        <div style = {{width: '75%', display: 'flex', display: 'flex', flexDirection: 'column', marginBottom: '10vh'}}>
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center'}}>
                                <div style={{ width: '47.5%', display: 'flex', height: '30vh', justifyContent: 'center', alignItems: 'center', background: '#EAEDED', borderRadius: '5px'}}>
                                    <img src={`data:image/jpeg;base64,${product.image}`} style = {{maxWidth: '95%', maxHeight: '95%'}} />
                                </div>
                                <div style = {{width: '5%'}}>
                                </div>
                                <div style={{ width: '47.5%', height: '100%', background: '#EAEDED', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', padding: '2%', borderRadius: '5px' }}>
                                    <div style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                                        <div>
                                            {product.name}
                                        </div>
                                        {isCreator && (
                                            <div style = {{marginLeft: '3%', display: 'flex', alignItems: 'center'}}>
                                                <EditProduct 
                                                    product={product}
                                                    reloadProduct={getProduct}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ marginTop: '-1%' }}>
                                        {product.category}
                                    </div>
                                    <div style = {{fontSize: '0.8rem', width: '80%', marginTop: '2%'}}>
                                        <b>
                                            {'About this item: '} 
                                        </b> 
                                        {product.description}
                                    </div>
                                </div>
                            </div>
                            <div style = {{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                <div style = {{marginTop: '10vh', marginBottom: '4vh', fontSize: '2rem', display: 'flex', justifyContent: 'center', width: '100%'}}>
                                    <div>
                                        Sellers
                                    </div>
                                    {canSell && (
                                        <div style = {{marginLeft: '1%', display: 'flex', alignItems: 'center'}}>
                                            <StartSelling 
                                                product={product}
                                                reloadSellers={getSellers}
                                            />
                                        </div>
                                    )}
                                </div>
                                <Table columns={columns} dataSource = {sellers} pagination = {false}
                                    style = {{width: '100%'}}
                                />
                                <div style = {{fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '10vh'}}>
                                    Reviews
                                    {
                                        canReview &&
                                        <div style = {{marginLeft: '2%', display: 'flex', alignItems: 'center'}}>
                                            <AddReview 
                                                type = 'product'
                                                reviewId = {product.id}
                                                updateReviews = {getReviews}
                                            />
                                        </div>
                                    }
                                </div>
                                <div style = {{ width: '50%', marginTop: '5vh'}}>
                                    {reviewRender}
                                </div>
                            </div>
                        </div>
                    )
                )
            }
        </div>
    )
}

export default withRouter(Product);