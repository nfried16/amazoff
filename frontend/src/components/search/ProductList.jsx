import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Pagination, Select}  from 'antd';
import { SearchProducts, GetCategories } from '../../api/api';
import { withRouter } from 'react-router';

const ProductList = props => {
    // If products null, loading
    const [products, setProducts] = useState(null);
    const [search, setSearch] = useState('');
    const [range, setRange] = useState({start: 0, end: 0, page: 0, num_rows: 0});
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [sort, setSort] = useState(null);

    useEffect(async () => {
        // Get Categories
        updateCategories();
        // Start loading
        setProducts(null);
        // Get url params (search value, category filter, sorting)
        const params = new URLSearchParams(props.location.search);
        const search = params.get('search');
        const cat = params.get('category');
        const sortParam = params.get('sort');
        setSearch(search);
        setCategory(cat);
        setSort(sortParam);
        const page = parseInt(params.get('page') || 1);
        const res = await SearchProducts(localStorage.getItem('token'), search, page, cat, sortParam)
            .catch(err => {
                // Push back to first page if not already on it
                if(page !== 1) {
                    switchPage(1);
                }
                // Default empty info
                return {products: [], start: 0, end: 0, page: 0, num_rows: 0};
            });
        const {products: productArr, ...rangeResult} = res;
        setProducts(productArr);
        setRange(rangeResult);
    }, [props.location])

    // Go to new page
    const switchPage = newPage => {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('page', newPage);
        props.history.push(window.location.pathname + "?" + currentParams.toString());
    }

    // Change category filter
    const switchCategory = cat => {
        setCategory(cat);
        const currentParams = new URLSearchParams(window.location.search);
        if(!cat) {
            currentParams.delete('category');
        }
        else {
            currentParams.set('category', cat);
        }
        currentParams.set('page', 1);
        props.history.push(window.location.pathname + "?" + currentParams.toString());
    }

    // Change sorting
    const switchSort = newSort => {
        setSort(newSort);
        const currentParams = new URLSearchParams(window.location.search);
        if(!newSort) {
            currentParams.delete('sort');
        }
        else {
            currentParams.set('sort', newSort);
        }
        currentParams.set('page', 1);
        props.history.push(window.location.pathname + "?" + currentParams.toString());
    }

    // Fetch categories for dropdown
    const updateCategories = async () => {
        return GetCategories(localStorage.getItem('token'))
            .then(res => {
                setCategories(res);
            })
            .catch(err => {
                setCategories([]);
            })
    }

    return (
        <>
        <center style ={{marginTop: '10vh'}}>
            <div style = {{fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>
                {`Search results for "${search}":`}
                <div style = {{right: '10vw', position: 'absolute'}}>
                    <Select style={{ width: 125, marginRight: '5px', fontSize: '0.75rem' }} placeholder='Category' value={category}
                        onChange={switchCategory}
                    >
                        <Select.Option key = {'all'} value={null} tyle={{fontSize: '0.75rem'}}>
                            All
                        </Select.Option>
                        {categories.map(cat => (
                            <Select.Option key = {cat} value={cat} tyle={{fontSize: '0.75rem'}}>
                                {cat}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select style={{ width: 150, fontSize: '0.75rem' }} placeholder={'Sort by price'} value={sort}
                        onChange={switchSort}
                    >
                        <Select.Option value='low' style={{fontSize: '0.75rem'}}>
                            Price: Low to High
                        </Select.Option>
                        <Select.Option value='high' style={{fontSize: '0.75rem'}}>
                            Price: High to Low
                        </Select.Option>
                    </Select>
                </div>
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
                    {products.length > 0 &&
                        <center>
                            <Pagination pageSize={15} total={range.num_rows} current={range.page} 
                                showSizeChanger={false}
                                onChange={switchPage}
                            />
                        </center>
                    }
                </div>
            </div>
        )}
        </>
    );
}

export default  withRouter(ProductList);