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

    const updateOrder = () => {
        const id = props.match.params.id;
        GetOrder(localStorage.getItem('token'), id)
            .then(items => {
                setOrderItems(items.map(item => {
                    item.key=item.seller_id+'-'+item.product_id;
                    return item;
                }));
            })
            .catch(err => {
                // NOT YOUR ORDER
                props.history.push('/home');
            })
    }

    const columns = [
        {
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
            render: (text, record) => 
                record.fulfill_date ? new Date(record.fulfill_date).toLocaleDateString() :
                (
                    <CloseOutlined />
                )
        },
    ];

    let total = 0;
    orderItems.forEach(item => {
        const itemTotal = item.amount * item.price;
        total+=itemTotal;
    })

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