import { useEffect, useState } from 'react';
import { GetProductsBySeller } from '../../api/api';
import { withRouter } from 'react-router-dom';
import { Table, message } from 'antd';
import DeleteSellerProduct from './DeleteSellerProduct';
import EditSellerProduct from './EditSellerProduct';

const SellerProducts = props => {

    const [products, setProducts] = useState([]);
    const [seller, setSeller] = useState('');
    const seller_id = props.match.params.id;
    const isSelf = localStorage.getItem('id') === seller_id;

    useEffect(() => {
        reloadProducts();
    }, [])

    // Fetch data for this seller's inventory
    const reloadProducts = async () => {
        await GetProductsBySeller(localStorage.getItem('token'), seller_id)
                .then(res => {
                    // Track name of seller in state
                    const name = res.first_name;
                    setSeller(name);
                    const prodArr = res.products;
                    setProducts(prodArr.map(row => {
                        // Set key for each product
                        row.key=row.product_id;
                        return row;
                    }))
                })
                .catch(e => {
                    message.error('Error fetching seller products');
                    props.history.push('/home');
                })
    }

    // Columns for user's products
    const columns = [
        { 
            // Product name, click to go to product page
            title: 'Name', key: 'name', dataIndex: 'name',
            render: (text, record) => (
                <div style={{ color: '#007185', cursor: 'pointer' }}
                    onClick={() => props.history.push(`/product/${record.product_id}`)}
                >
                    {record.name}
                </div>
            )
        },
        { title: 'Price', key: 'price', dataIndex: 'price' },
        { title: 'Amount in stock', key: 'amt_in_stock', dataIndex: 'amt_in_stock' },
        // Conditional column
        ...isSelf ?
        [
            {
                // Edit button
                title: 'Edit', key: 'edit', dataIndex: 'edit', 
                render: (text, record) => (
                    <EditSellerProduct product={record} reloadProducts={reloadProducts}/>
                )
            },
            {
                // Stop selling button
                title: 'Delete', key: 'delete', dataIndex: 'delete', 
                render: (text, record) => (
                    <DeleteSellerProduct product={record} reloadProducts={reloadProducts}/>
                )
            }
        ] : []
    ];

    // If no products in inventory
    if(!products.length) {
        return (
            <div style = {{marginTop: '10vh', width: '100%', display: 'flex', justifyContent: 'center', fontSize: '1.5rem'}}>
                User has no products
            </div>
        )
    }
    return (
        <div style = {{ marginTop: '10vh', paddingBottom: '10vh', width: '100%', display: 'flex', justifyContent: 'center'}}>
            <div style = {{width: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style = {{fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                    <span style = {{justifySelf: 'center'}}>
                        {`${seller}'s Products`}
                    </span>
                </div>
                <Table columns={columns} dataSource = {products} pagination = {false}
                                    style = {{width: '100%', marginTop: '5vh'}}
                                />
            </div>
        </div>
    );
}

export default withRouter(SellerProducts);