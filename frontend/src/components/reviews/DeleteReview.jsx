import { Button } from 'antd';
import { DeleteSellerReview, DeleteProductReview } from '../../api/api';
import { DeleteOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';

// Button to delete a review
const DeleteReview = props => {

	const deleteReview = async values => {
		// Check whether or not this is a seller or product review
		if(props.seller_id) {
			await DeleteSellerReview(localStorage.getItem('token'), props.seller_id)
				.then(res => {
					props.updateReviews();
				})
		}
		else if(props.product_id) {
			await DeleteProductReview(localStorage.getItem('token'), props.product_id)
				.then(res => {
					props.updateReviews();
				})
		}
	}

    return (
        <Button 
            style = {{right: '20px', position: 'absolute'}}
            size = 'small'
            onClick={deleteReview} 
            icon = {<DeleteOutlined/>}
        />
    );
}

export default withRouter(DeleteReview);