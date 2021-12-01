import { useState } from 'react';
import { EditUser as edit, UpdatePassword } from '../../api/api';
import { Button, Modal, Form, Input, InputNumber, message} from 'antd';
import { EditOutlined } from '@ant-design/icons';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const EditUser = props => {

	const [visible, setVisible] = useState(false);
	const [showPassModal, setShowPassModal] = useState(false);
	const [form] = Form.useForm();
	const [passForm] = Form.useForm();

	const onOk = () => {
		form.validateFields()
		.then(values => {
			edit(localStorage.getItem('token'), values)
			.then(res => {
				// Update user page with new info
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

	const onOkPass = () => {
		passForm.validateFields()
		.then(values => {
			// Send old and new values
			UpdatePassword(localStorage.getItem('token'), values['Old Password'], values['Old Password'])
			.then(res => {
				passForm.resetFields();
				message.success('Password updated');
				setShowPassModal(false);
			})
			.catch(err => {
				// Check if old password sent was correct
				if(err.response && err.response.status === 403) {
					message.error('Incorrect current password');
				}
				else {
					message.error('Error updating password');
				}
			});
		})
		.catch(info => {
			console.log('Validate Failed:', info);
		});
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
				<center style={{color: '#007185', cursor: 'pointer'}}
					onClick = {() => setShowPassModal(true)}
				>
					Change Password
				</center>
			</Modal>
			<Modal title="Change Password" 
				visible={showPassModal}
				onCancel={() => setShowPassModal(false)}
				onOk={onOkPass}
				okText='Save'
			>
				<Form {...layout} form = {passForm}>
					<Form.Item name="Old Password" label="Old Password" rules={[{ required: true }]}>
						<Input.Password />
					</Form.Item>
					<Form.Item name="New Password" label="New Password" rules={[{ required: true }]}>
						<Input.Password />
					</Form.Item>
				</Form>
			</Modal>
      	</>
    );
}

export default EditUser;