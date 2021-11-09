import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Table, Select, message } from 'antd';
import { GetCart, Order, EditCartItem } from '../../api/api';
import RemoveFromCart from './RemoveFromCart';

const Cart = props => {
    const [cart, setCart] = useState(null);


    useEffect(() => {
        updateCart();
    }, [])

    const updateCart = () => {
        GetCart(localStorage.getItem('token'))
        .then(res => {
            setCart(res.map(row => {
                row.key = row.id + '-' + row.seller_id;
                return row;
            }));
        })
        .catch(err => {
            
        })
    }

    const options = Array.from(
        {length: 10}, 
        (_, i) => {
            return {value: i+1}
        }
    )

    const columns = [
        {
            title: 'Item',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ color: '#007185', cursor: 'pointer' }}
                    onClick={() => props.history.push(`/product/${record.id}`)}
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
        { title: 'Amount', dataIndex: 'amount', key: 'amount',
            render: (text, record) => (
                <Select 
                    options={options} 
                    defaultValue={record.amount}
                    onChange = {val => {
                        EditCartItem(localStorage.getItem('token'), record.id, record.seller_id, val)
                        record.amount = val
                    }}
                />
            ),
        },
        {
            title: 'Remove', dataIndex: 'remove', key: 'remove',
            render: (text, record) => (
                <RemoveFromCart record={record} updateCart={updateCart}/>
            )
        },
    ];

    const onSubmit = () => {
        Order(localStorage.getItem('token'))
            .then(orderId => {
                message.success('Order submitted!')
                props.history.push(`/order/${orderId}`);
            })
            .catch(err => {
                message.warning(err.response.data);
            })
    }

    if(!cart) {
        return (
            <center style = {{marginTop: '10vh'}}>
                loading dot dot dot
            </center>
        )
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.amount * item.price;
        total+=itemTotal;
    })

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8vh'}}>
            <div style = {{fontSize: '2rem'}}>
                My Cart
            </div>
            <Table dataSource={cart} columns={columns} pagination={false} bordered 
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
            <Button 
                onClick = {onSubmit}
                size='large'
                style = {{alignSelf: 'flex-end', marginRight: '15%', marginTop: '5%'}}
            >
                Submit Order
            </Button>
        </div>
    );
}

export default withRouter(Cart);