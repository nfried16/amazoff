import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = props => {

    const { auth, component: Component, ...rest } = props;

    // Load component if auth, otherwise push to login
    return (
        <Route {...rest}>
            {
                auth ?
                    (
                        <Component />
                    ) :
                    (
                        <Redirect to={{ pathname: '/login' }} />
                    )
            }
        </Route>
    );
}

export default ProtectedRoute;