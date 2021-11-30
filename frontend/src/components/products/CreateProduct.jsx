import { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Menu, Select, Upload, Button } from 'antd';
import { CreateProduct as create, GetCategories } from '../../api/api';
import { SkinOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const EditProduct = props => {

	const [visible, setVisible] = useState(false);
	const [fileList, setFileList] = useState([]);
	const [form] = Form.useForm();
	const [categories, setCategories] = useState([]);

	useEffect(() => { 
		// Get categories
		GetCategories(localStorage.getItem('token'))
			.then(cats => {
				setCategories(cats)
			});
	}, [])

	const onOk = () => {
		form.validateFields()
		.then(async values => {
			await uploadData(values);
			setVisible(false);
			form.resetFields();
		})
		.catch(info => {
			console.log('Validate Failed:', info);
		});
	}

	const uploadData = async (values) => {
		const formData = new FormData();
		formData.append('name', values.name);
		formData.append('image', values.image.file.originFileObj);
		formData.append('description', values.description);
		formData.append('category', values.category);
        formData.append('price', values.price);
        formData.append('amt_in_stock', values.amt_in_stock);
        const res = await create(localStorage.getItem('token'), formData);
        props.history.push(`/product/${res}`);
	}

	const onCancel = () => {
		form.resetFields();
		setVisible(false);
	}

	const handleChange = (info) => {
		let fileList = [...info.fileList];
		// Only keep most recent
		fileList = fileList.slice(-1);
		setFileList(fileList);
	};

    return (
        <>
            <Menu.Item
				key='create'
                onClick={() => setVisible(!visible)}
            >
				Create Product
			</Menu.Item>
			<Modal title='Create Product'
				visible={visible}
				onCancel={onCancel}
				onOk={onOk}
				okText='Save'
			>
				<Form 
					{...layout} 
					form = {form}
				>
					<Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="image" label="Image" rules={[{ required: true }]}>
						<Upload accept='.jpg,.jpeg' 
							multiple={false} 
							fileList={fileList} 
							onChange={handleChange} 
							listType='picture-card'
						>
							<Button icon={<UploadOutlined/>}></Button>
						</Upload>
					</Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
						<Input.TextArea />
					</Form.Item>
					<Form.Item name="category" label="Category" rules={[{ required: true }]}>
						<Select >
							{categories.map(cat => 
								(
									<Select.Option key = {cat.toString(36)}>
										{cat}
									</Select.Option>
								)
							)}
						</Select>
					</Form.Item>
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