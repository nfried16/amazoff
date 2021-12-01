import { Rate } from 'antd';
import { withRouter } from 'react-router';

// Product card shown in search list
const ProductCard = props => {

    // Click to go to product page
    const onClick = () => {
        props.history.push(`/product/${props.id}`);
    }

    return(
        <div style={{width: '100%', height: '30vh', borderWidth: '3px 0px 0px 0px', borderColor: '#DDDDDD', borderStyle: 'solid', flexDirection: 'row'}}>
            <div style = {{display: 'flex', height: '100%', alignItems: 'center'}}>
                <img onClick={onClick} src={`data:image/jpeg;base64,${props.image}`} style = {{cursor: 'pointer', marginLeft: '2.5%', maxWidth: '30%', maxHeight: '80%', minHeight: '80%'}} />
                <div style = {{height: '100%', marginLeft: '2.5%'}}>
                    <div onClick={onClick} style = {{cursor: 'pointer', marginTop: '5vh', fontSize: '1.5rem', fontWeight: 'bold', color: '#007185'}}>
                        {props.name}
                    </div>
                    <Rate allowHalf disabled defaultValue={parseFloat(props.rating)} style={{fontSize: '1rem'}}/>
                    <div style = {{marginTop: '1vh', fontSize: '1.25rem', fontWeight: 'bold'}}>
                        {`$${props.price}`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(ProductCard);