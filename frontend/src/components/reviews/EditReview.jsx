import { useState } from 'react';
import { Button, Modal, Form, Rate, Input } from 'antd';
import { EditSellerReview, EditProductReview } from '../../api/api';
import { EditOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

// Edit review button
const EditReview = props => {

	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();

	const onOk = () => {
		form.validateFields()
		.then(values => {
			edit(values);
		})
		.catch(info => {
			console.log('Failed:', info);
		});
	}

	const edit = async values => {
		// Check whether seller of product review
		if(props.seller_id) {
			await EditSellerReview(localStorage.getItem('token'), props.seller_id, values.title, values.rating, values.description)
				.then(res => {
					props.updateReviews();
					setVisible(false);
				})
		}
		else if(props.product_id) {
			await EditProductReview(localStorage.getItem('token'), props.product_id, values.title, values.rating, values.description)
				.then(res => {
					props.updateReviews();
					setVisible(false);
				})
		}
	}

	const onCancel = () => {
		form.resetFields();
		setVisible(false);
	}

    return (
        <>
			<Button 
				style = {{right: '50px', position: 'absolute'}}
				size = 'small'
				onClick={() => setVisible(!visible)} 
				icon = {<EditOutlined/>}
			/>
			<Modal title='Add Review'
				visible={visible}
				onCancel={onCancel}
				onOk={onOk}
				okText='Save'
			>
				<Form 
					{...layout} 
					initialValues={props}
					form = {form}
				>
					<Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
						<Rate />
					</Form.Item>
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
						<Input maxLength={30}/>
					</Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
						<Input.TextArea maxLength={1000}/>
					</Form.Item>
				</Form>
			</Modal>
      	</>
    );
}

export default withRouter(EditReview);