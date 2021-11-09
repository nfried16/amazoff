import { useState } from 'react';
import { Button, Spin } from 'antd';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';
import { Fulfill } from '../../api/api';

const FulfillButton = props => {

    const [loading, setLoading] = useState(0);

    if(props.record.fulfill_date) {
        return new Date(props.record.fulfill_date).toLocaleDateString();
    }
    
    switch(loading) {
        case 0:
            return <Button onClick={async () => {
                setLoading(1);
                await Fulfill(localStorage.getItem('token'), props.record.order_id, props.record.product_id)
                    .then(res => {
                        props.updateOrderItems();
                    })
                    .catch(err => { 
                        console.log(err)
                        setLoading(2);
                        setTimeout(() => {setLoading(0)}, 1000);
                    })
            }}
                icon={<SendOutlined />}
            />
        case 1:
            return <Spin/>
        case 2:
            return <CloseOutlined style={{color: 'red'}}/>
    }
}

export default FulfillButton;