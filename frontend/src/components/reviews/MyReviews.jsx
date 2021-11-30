import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GetMyReviews } from '../../api/api';
import DescriptiveReviewCard from '../reviews/DescriptiveReviewCard';

const MyReviews = props => {

    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [numReviews, setNumReviews] = useState(0);
    const [avg, setAvg] = useState(0);

    useEffect(() => {
        getReviews();
    }, [])

    const getReviews = async () => {
        setLoading(true);
        let total = 0;
        const revs = await GetMyReviews(localStorage.getItem('token'))
            .then(res => {
                // Calculate totals
                res.forEach(rev => {
                    total+=rev.rating;
                });
                return res;
            })
            .catch(err => []);
        setLoading(false);
        setNumReviews(revs.length);
        setAvg(revs.length > 0 ? Math.round(total/revs.length*100)/100 : 0);
        setReviews(revs);
    }

    return (
        <div style = {{ marginTop: '10vh', paddingBottom: '10vh', width: '100%', display: 'flex', justifyContent: 'center'}}>
            {loading ? 
                <center>
                    loading dot dot dot
                </center> :
                <div style = {{width: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style = {{fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: 'column'}}>
                        <div style = {{display: 'flex'}}>
                            My Reviews
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
                        {reviews.map(review => 
                            <DescriptiveReviewCard 
                                updateReviews={getReviews}
                                key = {review.user_id+'-'+(review.seller_id || review.product_id)}
                                {...review}
                            />
                        )}
                    </div>
                </div>
            }
        </div>
    );
}

export default withRouter(MyReviews);