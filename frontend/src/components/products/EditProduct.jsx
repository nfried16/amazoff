import { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Upload, Select } from 'antd';
import { EditProduct as edit, GetCategories } from '../../api/api';
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

	useEffect(() => {
		form.setFieldsValue(props.product);
	}, [props.product])

	const onOk = () => {
		form.validateFields()
		.then(async values => {
			await uploadData(values);
			setVisible(false);
		})
		.catch(info => {
			console.log('Validate Failed:', info);
		});
	}

	const uploadData = async (values) => {
		const formData = new FormData();
		formData.append('name', values.name);
		// formData.append('image', values.image.file.originFileObj);
		formData.append('description', values.description);
		formData.append('category', values.category);
		const res = await edit(localStorage.getItem('token'), formData, props.product.id)
			.then(res => props.reloadProduct())
	}

	const onCancel = () => {
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
					<Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					{/* <Form.Item name="image" label="Image" rules={[{ required: true }]}>
						<Upload accept='.jpg,.jpeg' 
							multiple={false} 
							fileList={fileList} 
							onChange={handleChange} 
							listType='picture-card'
						>
							<Button icon={<UploadOutlined/>}></Button>
						</Upload>
					</Form.Item> */}
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
				</Form>
			</Modal>
      	</>
    );
}

export default withRouter(EditProduct);