import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Table } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { GetOrders } from '../../api/api';

const PastOrders = props => {
    const [orders, setOrders] = useState([]);


    useEffect(() => {
        // Get all orders
        GetOrders(localStorage.getItem('token'))
            .then(orders => {
                setOrders(orders.map(order => {
                    // Set key for each order
                    order.key = order.id;
                    return order;
                }))
            })
    }, [])

    // Columns for order table
    const columns = [
        {
            // id of order, click to go to detailed order page
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => (
                <div style={{ color: '#007185', cursor: 'pointer' }}
                    onClick={() => props.history.push(`/order/${record.id}`)}
                >
                    {record.id}
                </div>
            )
        },
        {
            // Date orderd
            title: 'Date', dataIndex: 'date', key: 'date',
            render: (text, record) => 
                new Date(record.order_date).toLocaleDateString()
        },
        { title: 'Total', dataIndex: 'total', key: 'total' },
        { title: 'Number of Items', dataIndex: 'count', key: 'count' } ,
        { title: 'Fulfilled', dataIndex: 'fulfilled', key: 'fulfilled', align: 'center',
            // Whether or not all items have been fulfilled
            render: (text, record) => 
                record.fulfilled ? (
                    <CheckOutlined/>
                ) :
                (
                    <CloseOutlined />
                )
        },
    ];

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8vh'}}>
            <div style = {{fontSize: '2rem'}}>
                Past Orders
            </div>
            <Table dataSource={orders} columns={columns} pagination={false} bordered 
                style = {{marginTop: '5vh', width: '85%'}}
            />
        </div>
    );
}

export default withRouter(PastOrders);