import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from '../views/Login/login';
import SendBox from '../views/sendBox';

function RouterIndex(props) {
	const [loggedIn, setLoggedIn] = useState(false);
	// 在组件挂载时检查用户是否已登录
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token !== undefined || token !== null) {
			setLoggedIn(true);
			// window.location.href = '/#/login';
		}
	}, []);

	return (
		<HashRouter>
			<Switch>
				{/* <Route component={Login} path='/' exact></Route> */}
				<Route path='/login' component={Login} />
				<Route
					path='/'
					component={SendBox}
					render={() => (loggedIn ? <SendBox /> : <Redirect to='/login' />)}
				/>
			</Switch>
		</HashRouter>
	);
}

export default RouterIndex;
