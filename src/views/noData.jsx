import { Empty } from 'antd';
function NoData(props) {
	return (
		<div
			className=""
			style={{
				display: 'flex',
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				background: '#fff',
			}}
		>
			<Empty description={<div className="noText">暂无数据</div>} />
		</div>
	);
}

export default NoData;
