import { useState, useContext, useEffect } from 'react';
import { Tabs, message } from 'antd';
import BaseInfo from './baseInfo';

import myContext from '../../../utils/context';
import { useHistory } from 'react-router-dom';

function NodeIndex(props) {
	const history = useHistory();
	const [tabsType, setTabsType] = useState('0');
	const { childData } = useContext(myContext); 
	const [nodeId, setNodeId] = useState(null);

	useEffect(() => {
		console.log(childData,'childData');
	}, [childData]);

	const tabItem = [
		{
			label: <span>节点的基本信息</span>,
			component: <BaseInfo />,
		},
	];

	return (
		<div className='NodeIndex'>
			<Tabs
				defaultActiveKey='1'
				centered
				onChange={(activeKey) => {
					setTabsType(activeKey);
				}}
				items={tabItem.map((i, index) => {
					return {
						label: i.label,
						key: index,
						children: (
							<div
								style={{
									flex: 1,
								}}
							>
								{i.component}
							</div>
						),
						onClick: i.onClick,
					};
				})}
			/>
		</div>
	);
}

export default NodeIndex;
