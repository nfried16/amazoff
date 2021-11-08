import { useEffect, useState } from 'react';
import { GetProductsBySeller } from '../../api/api';
import { withRouter, Redirect } from 'react-router-dom';
import { Input, Table } from 'antd';
import EditSellerProduct from './EditSellerProduct';

const SellerProducts = props => {

    const [products, setProducts] = useState([]);
    const isSeller = localStorage.getItem('isSeller') === 'true';

    useEffect(() => {
        if(isSeller) {
            reloadProducts();
        }
    }, [])

    const reloadProducts = async () => {
        await GetProductsBySeller(localStorage.getItem('token'))
                .then(res => setProducts(res.map(row => {
                    row.key=row.product_id;
                    return row;
                })))
                .catch(e => console.log(e))
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
        {
            title: 'Edit', key: 'edit', dataIndex: 'edit', 
            render: (text, record) => (
                <EditSellerProduct product={record} reloadProducts={reloadProducts}/>
            )
        }
    ];

    if(!isSeller) {
        return <Redirect to='/home'/>
    }
    return (
        <div style = {{ marginTop: '10vh', paddingBottom: '10vh', width: '100%', display: 'flex', justifyContent: 'center'}}>
            <div style = {{width: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style = {{fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                    <span style = {{justifySelf: 'center'}}>
                        My Products
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