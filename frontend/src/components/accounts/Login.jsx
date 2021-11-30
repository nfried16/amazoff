import {Login as login} from '../../api/api';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const Login = props => {

    const [form] = Form.useForm();

    const onFinish = () => {
        login(form.getFieldValue('email'), form.getFieldValue('password'))
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

    const toRegister = () => {
        props.history.push('/register');
    }
    
    return (
        <div style = {{width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Form {...layout} form={form} name="login" onFinish={onFinish}>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Log in
                    </Button>
                    <Button type="link" htmlType="button" onClick={toRegister}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default withRouter(Login);