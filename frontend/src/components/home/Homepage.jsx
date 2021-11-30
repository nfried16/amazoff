import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { GetCategories } from "../../api/api";

const Homepage = props => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        updateCategories();
    }, [])

    const updateCategories = async () => {
        await GetCategories(localStorage.getItem('token'))
            .then(res => setCategories(res))
            .catch(err => setCategories([]))
        setLoading(false);
    }

    const toCategory = cat => {
        props.history.push(`/search?search=&page=1&category=${cat}`);
    }

    return (
        <div style = {{ marginTop: '10vh', paddingBottom: '10vh', width: '100%', display: 'flex', justifyContent: 'center'}}>
            {loading ? 
                <center>
                    loading dot dot dot
                </center> :
                <div style = {{width: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style = {{fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '5vh'}}>
                        Browse By Category
                    </div>
                    {categories.map(cat => (
                        <div style = {{fontSize: '1.5rem', borderRadius: '5px', borderWidth: '2px', borderColor: '#007185', borderStyle: 'solid', padding: '0.25vh 0.5vh', marginBottom: '2vh', color: '#007185', fontWeight: 'bold', cursor: 'pointer'}}
                            onClick={e => toCategory(e.target.innerText)}
                        >
                            {cat}
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default withRouter(Homepage);