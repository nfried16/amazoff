import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { SearchProducts } from '../../api/api';
import { withRouter } from 'react-router';

const ProductList = props => {
    // If results null, loading
    const [results, setResults] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(async () => {
        // Start loading
        setResults(null);
        const params = new URLSearchParams(props.location.search);
        const search = params.get('search');
        setSearch(search);
        const res = await SearchProducts(localStorage.getItem('token'), search);
        setResults(res);
    }, [props.location.search])

    return (
        <>
        <center style ={{marginTop: '10vh', fontSize: '1.5rem', fontWeight: 'bold'}} >
            {`Search results for \"${search}\":`}
        </center>
        {results === null ? (
            <center style = {{ marginTop: '10vh'}}>
                loading dot dot dot
            </center>
        ) : (
            <div style = {{ marginTop: '10vh', paddingBottom: '10vh', width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                <div style = {{width: '90%', display: 'flex', flexDirection: 'column'}}>
                    {results.map(res => 
                        (
                            <ProductCard
                                key = {res.id}
                                {...res}
                            />
                        )
                    )}
                </div>
            </div>
        )}
        </>
    );
}

export default  withRouter(ProductList);