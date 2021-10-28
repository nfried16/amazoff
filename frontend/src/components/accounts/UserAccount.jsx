import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GetSellerReviews, GetUser } from '../../api/api';
import ReviewCard from '../reviews/ReviewCard';

const UserAccount = props => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        // Use to check if this page is the current user
        const currentUser = localStorage.getItem('id');
        const userId = props.match.params.id;
        GetUser(localStorage.getItem('token'), userId)
            .then(res => {
                setUser(res);
                if(res.products) {
                    getReviews();
                }
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            })
    }, [])

    const getReviews = async () => {
        const sellerId = props.match.params.id;
        const reviews = await GetSellerReviews(localStorage.getItem('token'), sellerId)
            .catch(err => [])
        setReviews(reviews);
    }
    
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
                        <div style = {{fontSize: '2rem'}}>
                            {user.first_name + " " + user.last_name}
                        </div>
                        <div>
                            Account #: {user.id}
                        </div>
                        {
                            // Info only for sellers and self:
                            (user.products || user.id == localStorage.getItem('id')) && (
                                <>
                                <div>Email: {user.email}</div>
                                <div>Address: {user.address}</div>
                                </>
                            )
                        }
                        { 
                            // Info only for sellers (reviews)
                            user.products && (
                                <>
                                <div style ={{marginTop: '10vh', fontSize: '2rem'}}>
                                    Reviews
                                </div>
                                <div style = {{marginTop: '5vh', width: '50%'}}>
                                    {
                                        reviews.map(review => (
                                            <ReviewCard {...review}/>
                                        ))
                                    }
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