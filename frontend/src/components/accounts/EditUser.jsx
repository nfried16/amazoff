import { useState } from 'react';
import { EditUser as edit } from '../../api/api';
import { Button, Modal, Form, Input, InputNumber } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const EditUser = props => {

	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();

	const onOk = () => {
		form.validateFields()
		.then(values => {
			edit(localStorage.getItem('token'), values)
			.then(res => {
				props.updatePage();
			})
			.catch(err => console.log(err));
			setVisible(false);
		})
		.catch(info => {
			console.log('Validate Failed:', info);
		});
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
				icon = {<EditOutlined/>}/>
			<Modal title="Edit User" 
				visible={visible}
				onCancel={onCancel}
				onOk={onOk}
				okText='Save'
			>
				<Form {...layout} form = {form}>
					<Form.Item name="first_name" label="First Name" initialValue = {props.user.first_name} rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="last_name" label="Last Name"  initialValue = {props.user.last_name} rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="email" label="Email" initialValue = {props.user.email} rules={[{ required: true, type: 'email' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="address" label="Address" initialValue = {props.user.address} rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="balance" label="Balance" initialValue = {props.user.balance} rules={[{ required: true }]}>
						<InputNumber precision = {2} min = {0} />
					</Form.Item>
				</Form>
			</Modal>
      	</>
    );
}

export default EditUser;