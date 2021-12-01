import { useEffect, useState } from 'react';
import { Button, Modal, Form, InputNumber } from 'antd';
import { EditSellerProduct as edit } from '../../api/api';
import { EditOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const EditProduct = props => {

	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		// Set initial values of product info
		form.setFieldsValue(props.product);
	}, [props.product])

	const onOk = () => {
		form.validateFields()
		.then(async values => {
			await uploadData(values);
			setVisible(false);
		})
		.catch(err => {
			console.log('Failed:', err);
		});
	}

	const uploadData = async (values) => {
		// Add new product info to form data
		const formData = new FormData();
		formData.append('price', values.price);
		formData.append('amt_in_stock', values.amt_in_stock);
		const res = await edit(localStorage.getItem('token'), formData, props.product.product_id)
			.then(res => props.reloadProducts())
	}

	const onCancel = () => {
		setVisible(false);
	}


    return (
        <>
			<Button 
				size = 'small'
				onClick={() => setVisible(!visible)} 
				icon = {<EditOutlined/>}
			/>
			<Modal title='Edit Product'
				visible={visible}
				onCancel={onCancel}
				onOk={onOk}
				okText='Save'
			>
				<Form 
					{...layout} 
					form = {form}
				>
					<Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber precision = {2} min ={0} />
                    </Form.Item>
                    <Form.Item name="amt_in_stock" label="Stock" rules={[{ required: true }]}>
                        <InputNumber precision = {0} min ={0} />
                    </Form.Item>
				</Form>
			</Modal>
      	</>
    );
}

export default withRouter(EditProduct);