import { useState } from 'react';
import { Button, Spin } from 'antd';
import { ShoppingCartOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { AddToCart as add } from '../../api/api';

const AddToCart = props => {

    // State of item being added (0 = button not yet clicked, 1 = loading, 2 = success/added, 3 = error adding)
    const [loading, setLoading] = useState(0);

    switch(loading) {
        case 0:
            return <Button onClick={async () => {
                setLoading(1);
                await add(localStorage.getItem('token'), {
                    seller_id: props.record.id,
                    product_id: props.product_id,
                    amount: props.record.qty
                })
                    .then(res => setLoading(2))
                    .catch(err => setLoading(3))
                setTimeout(() => {setLoading(0)}, 1000);
            }}
                icon={<ShoppingCartOutlined />}
            />
        case 1:
            return <Spin/>
        case 2:
            return <CheckOutlined style={{color: '#53B635'}}/>
        case 3:
            return <CloseOutlined style={{color: 'red'}}/>
    }
}

export default AddToCart;