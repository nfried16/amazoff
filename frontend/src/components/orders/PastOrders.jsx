import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Table, Select, message } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { GetOrders } from '../../api/api';

const PastOrders = props => {
    const [orders, setOrders] = useState([]);


    useEffect(() => {
        GetOrders(localStorage.getItem('token'))
            .then(orders => {
                setOrders(orders.map(order => {
                    order.key = order.id;
                    return order;
                }))
            })
    }, [])

    const columns = [
        {
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
            title: 'Date', dataIndex: 'date', key: 'date',
            render: (text, record) => 
                new Date(record.order_date).toLocaleDateString()
        },
        { title: 'Total', dataIndex: 'total', key: 'total' },
        { title: 'Number of Items', dataIndex: 'count', key: 'count' } ,
        { title: 'Fulfilled', dataIndex: 'fulfilled', key: 'fulfilled', align: 'center',
            render: (text, record) => 
                record.fulfilled ? (
                    <CheckOutlined/>
                ) :
                (
                    <CloseOutlined />
                )
        },
    ];

    console.log(orders)

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