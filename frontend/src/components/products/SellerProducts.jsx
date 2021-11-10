import { useEffect, useState } from 'react';
import { GetProductsBySeller } from '../../api/api';
import { withRouter, Redirect } from 'react-router-dom';
import { Input, Table, message } from 'antd';
import EditSellerProduct from './EditSellerProduct';

const SellerProducts = props => {

    const [products, setProducts] = useState([]);
    const [seller, setSeller] = useState('');
    const seller_id = props.match.params.id;
    const isSelf = localStorage.getItem('id') === seller_id;

    useEffect(() => {
        reloadProducts();
    }, [])

    const reloadProducts = async () => {
        await GetProductsBySeller(localStorage.getItem('token'), seller_id)
                .then(res => {
                    const name = res.first_name;
                    setSeller(name);
                    const prodArr = res.products;
                    setProducts(prodArr.map(row => {
                        row.key=row.product_id;
                        return row;
                    }))
                })
                .catch(e => {
                    console.log(e)
                    message.error('Error fetching seller products');
                    props.history.push('/home');
                })
    }

    const columns = [
        { 
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
        ... isSelf ?
        [{
            title: 'Edit', key: 'edit', dataIndex: 'edit', 
            render: (text, record) => (
                <EditSellerProduct product={record} reloadProducts={reloadProducts}/>
            )
        }] : []
    ];

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
                        {`${seller}\'s Products`}
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