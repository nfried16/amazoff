import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GetSellerReviews, GetUser, CanReviewSeller } from '../../api/api';
import EditUser from './EditUser';
import ReviewCard from '../reviews/ReviewCard';
import AddReview from '../reviews/AddReview';

const UserAccount = props => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [numReviews, setNumReviews] = useState(0);
    const [avg, setAvg] = useState(0);
    const [canReview, setCanReview] = useState(false);

    // This user is a seller
    const isSeller = !loading && user && user.isSeller;
    // This is the logged in user
    const isSelf = !loading && user && localStorage.getItem('id') == user.id;

    useEffect(() => {
        updateUser();
    }, [props.match.params.id])

    // Get user info
    const updateUser = () => {
        // User id in url
        const userId = props.match.params.id;
        GetUser(localStorage.getItem('token'), userId)
            .then(res => {
                setUser(res);
                if(res.isSeller) {
                    getReviews();
                }
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            })
    }

    const getReviews = async () => {
        checkCanReview();
        const sellerId = props.match.params.id;
        // Total review count to calculate average
        let total = 0;
        const revs = await GetSellerReviews(localStorage.getItem('token'), sellerId)
            .then(res => {
                // Move user's reviews to beginning
                res.forEach((rev, i) => {
                    total+=rev.rating;
                    if(rev.user_id == localStorage.getItem('id')){
                        res.splice(i, 1);
                        res.unshift(rev);
                    }
                });
                return res;
            })
            .catch(err => [])
        setNumReviews(revs.length);
        setAvg(revs.length > 0 ? Math.round(total/revs.length*100)/100 : 0);
        setReviews(revs);
    }

    // Check if this user can create a new review
    const checkCanReview = async () => {
        const sellerId = props.match.params.id;
        CanReviewSeller(localStorage.getItem('token'), sellerId)
            .then(res => { 
                setCanReview(res);
            })
            .catch(err => {
                setCanReview(false);
            })
    }

    const toProducts = () => {
        props.history.push(`/products/${user.id}`);
    }

    // JSX for reviews
    const reviewRender = !reviews ? [] : reviews.map(review => (
        review.user_id == localStorage.getItem('id') ?
        <ReviewCard 
            updateReviews={getReviews}
            key = {review.user_id+'-'+review.seller_id}
            {...review}
        /> :
        <ReviewCard 
            key = {review.user_id+'-'+review.seller_id}
            {...review}
        />
    ))

    return (
        <div style = {{ marginTop: '10vh', paddingBottom: '10vh', width: '100%', display: 'flex', justifyContent: 'center'}}>
            {loading ? (
                <center>
                    loading dot dot dot
                </center>
                ) : !user ? (
                    <center style = {{fontSize: '2rem'}}>
                        User does not exist
                    </center>
                ) : 
                (
                    <div style = {{width: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style = {{fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                            <span style = {{justifySelf: 'center'}}>
                                {user.first_name + " " + user.last_name}
                            </span>
                            {isSelf && (
                                <div style = {{marginLeft: '2%', display: 'flex', alignItems: 'center'}}>
                                    <EditUser 
                                        updatePage = {updateUser}
                                        user = {user}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            Account #: {user.id}
                        </div>
                        {
                            // Info only for sellers and self:
                            (isSeller || isSelf) && (
                                <>
                                <div>Email: {user.email}</div>
                                <div>Address: {user.address}</div>
                                </>
                            )
                        }
                        {
                            // Info only for self:
                            isSelf && (
                                <div>Balance: {user.balance}</div>
                            )
                        }
                        { 
                            // Info only for sellers (products/reviews)
                            isSeller && (
                                <>
                                <div 
                                    onClick = {toProducts}
                                    style = {{color: '#007185', cursor: 'pointer'}}
                                >
                                    View Products
                                </div>
                                <div style = {{fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '10vh', flexDirection: 'column'}}>
                                    <div style = {{display: 'flex'}}>
                                        Reviews
                                        {
                                            canReview &&
                                            <div style = {{marginLeft: '5%', display: 'flex', alignItems: 'center'}}>
                                                <AddReview 
                                                    type = 'seller'
                                                    reviewId = {user.id}
                                                    updateReviews = {getReviews}
                                                />
                                            </div>
                                        }
                                    </div>
                                    <div style={{fontSize: '0.75rem', textAlign: 'center', borderStyle: 'solid', borderWidth: '1px', borderColor: 'black', borderRadius: '3px', padding: '0.5rem', background: '#F5F6F8', width: '50%'}}>
                                        <div style={{marginBottom: '-0.1rem'}}>
                                            Number of reviews: {numReviews}
                                        </div>
                                        <div style={{marginTop: '-0.1rem'}}>
                                            Average review: {avg}
                                        </div>
                                    </div>
                                </div>
                                <div style = {{marginTop: '5vh', width: '50%'}}>
                                    {reviewRender}
                                </div>
                                </>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
}

export default withRouter(UserAccount);