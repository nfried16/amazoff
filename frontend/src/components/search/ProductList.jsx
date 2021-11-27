import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Pagination } from 'antd';
import { SearchProducts } from '../../api/api';
import { withRouter } from 'react-router';

const ProductList = props => {
    // If products null, loading
    const [products, setProducts] = useState(null);
    const [search, setSearch] = useState('');
    const [range, setRange] = useState({start: 0, end: 0, page: 0, num_rows: 0});

    useEffect(async () => {
        // Start loading
        setProducts(null);
        const params = new URLSearchParams(props.location.search);
        const search = params.get('search');
        const page = parseInt(params.get('page') || 1);
        setSearch(search);
        const res = await SearchProducts(localStorage.getItem('token'), search, page)
            .catch(err => {
                // Push back to first page
                if(page !== 1) {
                    switchPage(1);
                }
                return {products: [], start: 0, end: 0, page: 0, num_rows: 0};
            });
        const {products: productArr, ...rangeResult} = res;
        setProducts(productArr);
        setRange(rangeResult);
    }, [props.location])

    const switchPage = newPage => {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('page', newPage);
        props.history.push(window.location.pathname + "?" + currentParams.toString());
    }

    return (
        <>
        <center style ={{marginTop: '10vh'}}>
            <div style = {{fontSize: '1.5rem', fontWeight: 'bold'}}>
                {`Search results for \"${search}\":`}
            </div>
            {
                products !== null &&
                <div style = {{fontSize: '1.15rem'}}>
                    {products.length > 0 ?
                        `Showing results ${range.start}-${range.end}` :
                        'No results'
                    }
                </div>

            }
        </center>
        {products === null ? (
            <center style = {{ marginTop: '10vh'}}>
                loading dot dot dot
            </center>
        ) : (
            <div style = {{ marginTop: '10vh', paddingBottom: '10vh', width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                <div style = {{width: '90%', display: 'flex', flexDirection: 'column'}}>
                    {products.map(res => 
                        (
                            <ProductCard
                                key = {res.id}
                                {...res}
                            />
                        )
                    )}
                    <center>
                        <Pagination pageSize={15} total={range.num_rows} current={range.page} 
                            showSizeChanger={false}
                            onChange={switchPage}
                        />
                    </center>
                </div>
            </div>
        )}
        </>
    );
}

export default  withRouter(ProductList);