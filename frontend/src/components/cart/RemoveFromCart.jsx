import { useState } from 'react';
import { Button, Spin } from 'antd';
import { DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { RemoveFromCart as remove } from '../../api/api';

const RemoveFromCart = props => {

    // State of deleting cart item (0 = not clicked yet, 1 = loading, 2 = error deleting)
    const [loading, setLoading] = useState(0);

    switch(loading) {
        case 0:
            return <Button onClick={async () => {
                setLoading(1);
                await remove(localStorage.getItem('token'), props.record.id, props.record.seller_id)
                    .then(res => {
                        props.updateCart();
                    })
                    .catch(err => setLoading(2))
                setTimeout(() => {setLoading(0)}, 1000);
            }}
                icon={<DeleteOutlined />}
            />
        case 1:
            return <Spin/>
        case 2:
            return <CloseOutlined style={{color: 'red'}}/>
    }
}

export default RemoveFromCart;