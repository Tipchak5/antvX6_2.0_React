import Flow from './Flow/nodeFlow';
import Flow2 from './Flow/dragFlow';
import Flow3 from './Flow/dragFlow2';
import RenderByList from './Flow/renderByList';
import Nopermission from './Nopermission';

import { Switch, Route, Redirect } from 'react-router-dom';
import '../App.less';
import React, { useState } from 'react';

import { Layout, Menu, theme, Avatar, Dropdown } from 'antd';
import { BarsOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;

function getItem(label, key, icon, children) {
	return { key, icon, children, label };
}

// 菜单数据
const menuItems = [
	getItem('流程1', '/flow1', <BarsOutlined />),
	getItem('根据list渲染节点', '/renderByList', <BarsOutlined />),
	getItem('拖拽流程1', '/flow2', <BarsOutlined />),
	getItem('拖拽流程2', '/flow3', <BarsOutlined />),
];

const SendBox = (props) => {
	const [curPath, setCurPath] = useState('/flow1');

	// 头像子菜单
	const items = [
		{
			key: '1',
			label: <p onClick={() => {}}>退出登陆</p>,
		},
		{
			key: '2',
			label: <p onClick={() => {}}>注销账号</p>,
		},
	];
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	return (
		<Layout>
			<Header className='header'>
				<div className='logo' />

				<Menu
					defaultSelectedKeys={['/flow1']}
					selectedKeys={[curPath]}
					onClick={clickMenu}
					mode={'horizontal'}
					theme={'dark'}
					items={menuItems}
				/>

				<Dropdown menu={{ items }} placement='bottom' arrow>
					<Avatar size={40}>user</Avatar>
				</Dropdown>
			</Header>

			<Layout
				style={{
					padding: '18px',
				}}
			>
				{/* 内容 */}
				<Content style={{ padding: 24, margin: 0, minHeight: 280, background: colorBgContainer }}>
					<Switch>
						<Route path='/renderByList' component={RenderByList}></Route>
						<Route path='/flow1' component={Flow} />
						<Route path='/flow2' component={Flow2} />
						<Route path='/flow3' component={Flow3} />
						<Redirect from='/' to='/flow1' exact></Redirect>
						<Route path='*' component={Nopermission}></Route>
					</Switch>
				</Content>
			</Layout>
		</Layout>
	);

	/**
	 * @param {Object} e 菜单数据
	 */
	function clickMenu(e) {
		props.history.push(e.key);
		console.log(e.key);
		setCurPath(e.key); // 根据路由显示菜单高亮
	}
};
export default SendBox;
