import { Register as register } from '../../api/api';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const Register = props => {

    const [form] = Form.useForm();

    const onFinish = values => {
        register(values.email, values.password, values.firstName, values.lastName, values.address, !!values.isSeller)
            .then(res => {
                // Just using localStorage instead of context
                localStorage.setItem('token', res.token);
                localStorage.setItem('id', res.id);
                localStorage.setItem('isSeller', res.isSeller);
                props.setAuth(true);
                props.history.push('/home');
            })
            .catch(err => {
                console.log(err)
                alert('YOOOO NAHH');
            });
    }
    
    return (
        <div style = {{width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Form {...layout} form={form} name="login" onFinish={onFinish}>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="isSeller" label="Seller" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default withRouter(Register);