import { useState, useEffect } from 'react';
import Logo from '../../assets/amazon_white.png';
import { Link, withRouter } from 'react-router-dom';
import { Input, Button } from 'antd';
import CreateProduct from '../products/CreateProduct';
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';

const NavBar = props => {

    useEffect(() => {
        const params = new URLSearchParams(props.location.search);
        const newSearch = params.get('search');
        // Populate search bar on first page load with query params
        if(newSearch && newSearch !== search) {
            console.log(newSearch)
            setSearch(newSearch)
        }
    }, [props.location.search])

    const [search, setSearch] = useState('');

    const onSearch = () => {
        props.history.push(`/search?search=${search}`);
    }

    const toAccount = () => {
        props.history.push(`/user/${localStorage.getItem('id')}`);
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('isSeller');
        props.history.push('/login');
    }

    const toCart = () => {
        props.history.push('/cart');
    }

    const isSeller = localStorage.getItem('isSeller') === 'true';

    return (
        <div style={{ position: 'relative', height: '12vh', width: '100%', background: '#131921', display: 'flex', alignItems: 'center'}}>
            <div style={{ marginLeft: '5%', height: '45%', marginRight: '5%' }}>
                <Link to = '/home'>
                    <img src={Logo} alt='logo' style = {{height: '100%'}} />
                </Link>
            </div>
            <div style={{ height: '50%', width: '40%', background: 'white', borderRadius: '5px 0px 0px 5px', display: 'flex', justifyContent: 'center'}}>
                <Input value={search} bordered={false} onChange = {e => setSearch(e.target.value)} />
            </div>
            <Button icon={<SearchOutlined style={{fontSize: '125%'}}/>} 
                style={{ height: '6vh', width: '6vh', background: '#FEBD69', borderRadius: '0px 5px 5px 0px', borderWidth: '0px'}}
                onClick = {onSearch}
            />
            {isSeller && <CreateProduct/>}
            <Button type='ghost' icon={<UserOutlined style={{ color: 'white', fontSize: '150%' }} />}
                style={{ height: '6vh', width: '6vh', marginRight: '2%', borderRadius: '5px', marginLeft: !isSeller && 'auto'}}
                onClick={toAccount}
            />
            <Button type='ghost' icon={<ShoppingCartOutlined style={{color: 'white', fontSize: '150%'}} />}
                style={{ height: '6vh', width: '6vh', marginRight: '2%', borderRadius: '5px' }}
                onClick={toCart}
            />
            <Button type='ghost' icon={<LogoutOutlined style={{ color: 'white', fontSize: '150%' }} />}
                style={{ height: '6vh', width: '6vh', marginRight: '5%', borderRadius: '5px' }}
                onClick={logout}
            />
        </div>
    );
}

export default withRouter(NavBar);