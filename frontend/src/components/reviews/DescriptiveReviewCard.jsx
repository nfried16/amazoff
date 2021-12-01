import { Rate } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import EditReview from './EditReview';
import DeleteReview from './DeleteReview';

// Review card which shows what is being reviewed
const DescriptiveReviewCard = props => {

    const toProduct = id => {
        props.history.push(`/product/${id}`);
    }

    const toSeller = id => {
        props.history.push(`/user/${id}`);
    }

    return (
        <div style={{ width: '100%', marginBottom: '2vh', display: 'flex', flexDirection: 'column', borderStyle: 'solid', borderWidth: '1px', borderRadius: '3px', padding: '20px', background: '#F5F6F8', wordBreak: 'break-word', position: 'relative'}}>
            <div style = {{fontSize: '1rem', display: 'flex', alignItems: 'center'}}>
                <UserOutlined style={{ fontSize: '1.5rem', background: '#A9B7B8', width: '2rem', height: '2rem', borderRadius: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}/>
                <div style = {{marginLeft: '2%'}}>
                    {props.first_name} {props.last_name}
                </div>
                <EditReview 
                    {...props}
                />
                <DeleteReview 
                    {...props}
                />
            </div>
            <div style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', marginTop: '5px', fontWeight: 500, color: '#007185', cursor: 'pointer' }}
                onClick={() => props.name ? toProduct(props.product_id) : toSeller(props.seller_id)}
            >
                {props.name ? 
                    `Product: ${props.name}` :
                    `Seller: ${props.seller_first_name} ${props.seller_last_name}`
                }
            </div>
            <div style={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
                <Rate disabled value={props.rating}/>
                <div style={{ marginLeft: '2%', fontWeight: 'bold' }}>
                    {props.title}
                </div>
            </div>
            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                <div style={{ color: '#565959'}}>
                    Reviewed on {new Date(props.date).toLocaleDateString()}
                </div>
            </div>
            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                {props.description}
            </div>
        </div>
    )
}

export default withRouter(DescriptiveReviewCard);