import { useEffect, useState } from 'react';
import { Button, Modal, Form, Rate, Input } from 'antd';
import { CreateProductReview, CreateSellerReview } from '../../api/api';
import { PlusOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const AddReview = props => {

	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();

	const onOk = () => {
		form.validateFields()
		.then(values => {
			review(values);
		})
		.catch(info => {
			console.log('Failed:', info);
		});
	}

	const review = async values => {
		// This component is used for both seller and product reviews, so check which one to create
		if(props.type === 'seller') {
			await CreateSellerReview(localStorage.getItem('token'), props.reviewId, values.title, values.rating, values.description)
				.then(res => {
					props.updateReviews();
					setVisible(false);
				})
		}
		else if(props.type === 'product') {
			await CreateProductReview(localStorage.getItem('token'), props.reviewId, values.title, values.rating, values.description)
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
				size = 'small'
				onClick={() => setVisible(!visible)} 
				icon = {<PlusOutlined/>}
			/>
			<Modal title='Add Review'
				visible={visible}
				onCancel={onCancel}
				onOk={onOk}
				okText='Save'
			>
				<Form 
					{...layout} 
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

export default withRouter(AddReview);