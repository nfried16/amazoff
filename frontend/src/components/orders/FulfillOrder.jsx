import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Table } from 'antd';
import FulfillButton from './FulfillButton';
import { GetSellerOrders } from '../../api/api';

const FulfillOrder = props => {

    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        // If not seller, don't access this page
        if(!localStorage.getItem('isSeller')==='true') {
            props.history.push('/home');
        }
        else {
            updateOrderItems();
        }
    }, [])

    // Get order items
    const updateOrderItems = () => {
        GetSellerOrders(localStorage.getItem('token'))
            .then(orderItems => {
                setOrderItems(orderItems.map(item => {
                    // Add key to each item
                    item.key=item.order_id+'-'+item.seller_id+'-'+item.product_id;
                    return item;
                }))
            })
    }

    // Columns for order item table
    const columns = [
        {
            // Product name, click to go to product page
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ color: '#007185', cursor: 'pointer' }}
                    onClick={() => props.history.push(`/product/${record.product_id}`)}
                >
                    {record.name}
                </div>
            )
        },
        { 
            // Buyer name, click to go to user page
            title: 'Buyer', dataIndex: 'user', key: 'user',
            render: (text, record) => (
                <div style={{ color: '#007185', cursor: 'pointer' }}
                    onClick={() => props.history.push(`/user/${record.user_id}`)}
                >
                    {`${record.first_name} ${record.last_name}`}
                </div>
            )
        },
        { 
            // Date ordered
            title: 'Date', dataIndex: 'order_date', key: 'order_date',
            render: (text, record) => new Date(record.order_date).toLocaleString()
        },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Fulfill', dataIndex: 'fulfill', key: 'fulfill', align: 'center',
            // Click to fulfill, or show date fulfilled if already fulfilled
            render: (text, record) => 
                <FulfillButton record={record} updateOrderItems={updateOrderItems}/>
        },
    ];

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8vh'}}>
            <div style = {{fontSize: '2rem'}}>
                Order Fulfillment
            </div>
            <Table dataSource={orderItems} columns={columns} pagination={false} bordered 
                style = {{marginTop: '5vh', width: '85%'}}
            />
        </div>
    );
}

export default withRouter(FulfillOrder);