import React, { useEffect, useState } from 'react';
import { Button, Row, Table } from 'antd';
import { GetCart } from '../../api/api';

const Cart = props => {
    const [cart, setCart] = useState(null);


    useEffect(() => {
        GetCart(localStorage.getItem('token'))
            .then(res => {
                setCart(res);
            })
            .catch(err => {

            })
    }, [])


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
            title: 'Seller',
            dataIndex: 'seller_id',
            key: 'seller_id',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        }
    ];

    const onSubmit = () => {
        console.log('Submit order');
        // Make API call
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

export default Cart;