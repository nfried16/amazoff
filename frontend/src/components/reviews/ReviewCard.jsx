import { Rate } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const ReviewCard = props => {
    return (
        <div style={{ width: '100%', marginBottom: '2vh', display: 'flex', flexDirection: 'column', borderStyle: 'solid', borderWidth: '1px', borderRadius: '1px', padding: '20px', background: '#F5F6F8', wordBreak: 'break-word'}}>
            <div style = {{fontSize: '1rem', display: 'flex', alignItems: 'center'}}>
                <UserOutlined style={{ fontSize: '1.5rem', background: '#A9B7B8', width: '2rem', height: '2rem', borderRadius: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}/>
                <div style = {{marginLeft: '2%'}}>
                    {props.first_name} {props.last_name}
                </div>
            </div>
            <div style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                <Rate disabled defaultValue={props.rating}/>
                <div style={{ marginLeft: '2%', fontWeight: 'bold' }}>
                    {props.title}
                </div>
            </div>
            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                <div style={{ color: '#565959'}}>
                    Reviewed on {new Date(props.date).toDateString()}
                </div>
            </div>
            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                {props.description}
            </div>
        </div>
    )
}

export default ReviewCard;