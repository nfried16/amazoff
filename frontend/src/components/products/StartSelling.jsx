import { useEffect, useState } from 'react';
import { Button, Modal, Form, InputNumber } from 'antd';
import { StartSelling as sell, GetCategories } from '../../api/api';
import { PlusOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const StartSelling = props => {

	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();

	const onOk = () => {
		form.validateFields()
		.then(async values => {
			await uploadData(values);
			setVisible(false);
		})
		.catch(info => {
			console.log('Failed:', info);
		});
	}

	const uploadData = async (values) => {
		const formData = new FormData();
		formData.append('price', values.price);
		formData.append('amt_in_stock', values.amt_in_stock);
		const res = await sell(localStorage.getItem('token'), formData, props.product.id)
			.then(res => props.reloadSellers())
	}

	const onCancel = () => {
		form.resetFields();
		setVisible(false);
	}

    return (
        <>
			<Button 
				size = 'small'
				onClick={() => setVisible(!visible)} 
				icon = {<PlusOutlined/>}
			/>
			<Modal title='Start Selling Product'
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

export default withRouter(StartSelling);