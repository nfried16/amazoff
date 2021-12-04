import { useState } from 'react';
import { Button, Modal, Spin } from 'antd';
import { StopSelling } from '../../api/api';
import { DeleteOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';

// Confirm deletion of product
const DeleteSellerProduct = props => {

	const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(0);

	const onOk = async () => {
        setLoading(1);
        setVisible(false);
        // Stop selling this product
		await StopSelling(localStorage.getItem('token'), props.product.product_id)
            .then(res => {
                setLoading(3);
                setTimeout(() => {
                    setLoading(0);
                    props.reloadProducts();
                }, 1000);
            })
            .catch(err => {
                setLoading(2);
                setTimeout(() => {
                    setLoading(0);
                }, 1000);
            })
	}

	const onCancel = () => {
		setVisible(false);
	}

    return (
        <>
			<Button 
				size = 'small'
				onClick={() => setVisible(!visible)} 
				icon = {loading === 0 ? <DeleteOutlined/> : 
                    loading === 1 ? <Spin/> : 
                    loading === 2 ? <CloseOutlined style={{color: 'red'}}/> : 
                    <CheckOutlined style={{color: '#53B635'}}/>}
			/>
			<Modal title='Delete Product'
				visible={visible}
				onCancel={onCancel}
				onOk={onOk}
				okText='Delete'
			>
				Are you sure you want to delete this product?
			</Modal>
      	</>
    );
}

export default withRouter(DeleteSellerProduct);