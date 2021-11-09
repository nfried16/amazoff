import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Table } from 'antd';
import FulfillButton from './FulfillButton';
import { SendOutlined } from '@ant-design/icons';
import { GetSellerOrders, Fulfill } from '../../api/api';
// import { GetCart, Order, EditCartItem } from '../../api/api';

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

    const updateOrderItems = () => {
        GetSellerOrders(localStorage.getItem('token'))
            .then(orderItems => {
                console.log(orderItems);
                setOrderItems(orderItems.map(item => {
                    item.key=item.order_id+'-'+item.seller_id+'-'+item.product_id;
                    return item;
                }))
            })
    }

    const columns = [
        {
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
            title: 'Date', dataIndex: 'order_date', key: 'order_date',
            render: (text, record) => new Date(record.order_date).toLocaleString()
        },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Fulfill', dataIndex: 'fulfill', key: 'fulfill', align: 'center',
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