import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Table } from 'antd';
import { GetOrder } from '../../api/api';
import { CloseOutlined } from '@ant-design/icons';

const Order = props => {
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        updateOrder();
    }, [])

    // Get data for this order
    const updateOrder = () => {
        // id of order in url
        const id = props.match.params.id;
        GetOrder(localStorage.getItem('token'), id)
            .then(items => {
                setOrderItems(items.map(item => {
                    // Set key for each item
                    item.key=item.seller_id+'-'+item.product_id;
                    return item;
                }));
            })
            .catch(err => {
                // NOT YOUR ORDER, push home
                props.history.push('/home');
            })
    }

    // Columns for order item table
    const columns = [
        {
            // Product name, click to go to product page
            title: 'Item',
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
            // Seller name, click to go to user page
            title: 'Seller', dataIndex: 'seller_id', key: 'seller_id',
            render: (text, record) => (
                <div style={{ color: '#007185', cursor: 'pointer' }}
                    onClick={() => props.history.push(`/user/${record.seller_id}`)}
                >
                    {`${record.first_name} ${record.last_name}`}
                </div>
            )
        },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' } ,
        { title: 'Fulfilled', dataIndex: 'fulfilled', key: 'fulfilled', align: 'center',
            // Show whether or not this item has been fulfilled
            render: (text, record) => 
                record.fulfill_date ? new Date(record.fulfill_date).toLocaleDateString() :
                (
                    <CloseOutlined />
                )
        },
    ];

    // Calculate order total
    let total = 0;
    orderItems.forEach(item => {
        const itemTotal = item.amount * item.price;
        total+=itemTotal;
    })

    // Still fetching order items
    if(!orderItems.length) {
        return <center style = {{marginTop: '10vh'}}>loading dot dot dot</center>
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8vh'}}>
            <div style = {{fontSize: '2rem'}}>
                Order #{orderItems.length && orderItems[0].order_id}
            </div>
            <div style = {{fontSize: '1rem'}}>
                {new Date(orderItems.length && orderItems[0].order_date).toLocaleString()}
            </div>
            <Table dataSource={orderItems} columns={columns} pagination={false} bordered 
                style = {{marginTop: '5vh', width: '85%'}}
                summary = { data => {
                    return (
                        <Table.Summary.Row style={{ background: '#FAFAFA'}}>
                            <Table.Summary.Cell>Total</Table.Summary.Cell>
                            <Table.Summary.Cell/>
                            <Table.Summary.Cell>{total}</Table.Summary.Cell>
                            <Table.Summary.Cell/>
                            <Table.Summary.Cell/>
                        </Table.Summary.Row>
                    )
                }}
            />
        </div>
    );
}

export default withRouter(Order);