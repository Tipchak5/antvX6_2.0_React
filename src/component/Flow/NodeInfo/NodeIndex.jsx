import { Tabs } from 'antd';
import BaseInfo from './baseInfo';

function NodeIndex(props) {
	const tabItem = [
		{
			label: <span>节点的基本信息</span>,
			component: <BaseInfo />,
		},
	];

	return (
		<div className="NodeIndex">
			<Tabs
				defaultActiveKey="1"
				centered
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
