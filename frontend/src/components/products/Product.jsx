import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GetProductById, GetProductReviews, GetSellers } from '../../api/api';
import { Button, Table } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import ReviewCard from '../reviews/ReviewCard';

const Product = props => {

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [sellers, setSellers] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const productId = props.match.params.id;
        GetProductById(localStorage.getItem('token'), productId)
            .then(async res => {
                setProduct(res);
                await getSellers();
                await getReviews();
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            })
    }, [])

    const getSellers = async () => {
        const productId = props.match.params.id;
        await GetSellers(localStorage.getItem('token'), productId)
            .then(res => {
                setSellers(res);
            })
    }

    const getReviews = async () => {
        const productId = props.match.params.id;
        await GetProductReviews(localStorage.getItem('token'), productId)
            .then(res => {
                setReviews(res);
            })
    }

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
            title: 'Add to cart', key: 'add', dataIndex: 'add',
            render: (text, record) => (
                <Button onClick={() => console.log(record)}
                    icon={<ShoppingCartOutlined />}
                />
            ),
        }
    ];

    return (
        <div style = {{marginTop: '10vh', width: '100%', display: 'flex', justifyContent: 'center'}}>
            {
                loading ? 'loading dot dot dot' : (
                    !product ? (
                        'Product does not exist'
                    ) : (
                        <div style = {{width: '75%', display: 'flex', display: 'flex', flexDirection: 'column', marginBottom: '10vh'}}>
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '50%', textAlign: 'center', height: '30vh' }}>
                                    image
                                </div>
                                    <div style={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', background: '#EAEDED', padding: '2%', borderRadius: '0px 5px 5px 0px' }}>
                                    <div style={{ fontSize: '2rem' }}>
                                        {product.name}
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
                                <div style = {{marginTop: '10vh', marginBottom: '4vh', fontSize: '2rem'}}>
                                    Sellers
                                </div>
                                <Table columns={columns} dataSource = {sellers} pagination = {false}
                                    style = {{width: '100%'}}
                                />
                                <div style={{ marginTop: '10vh', marginBottom: '4vh', fontSize: '2rem' }}>
                                    Reviews
                                </div>
                                <div style = {{ width: '60%'}}>
                                    {reviews.map(review => (
                                        <ReviewCard {...review}/>
                                    ))}
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