import { useContext, useEffect } from 'react';
import myContext from '../../../utils/context';

function BaseInfo(props) {
	const { childData } = useContext(myContext); // 接受数据 跨级通信

	useEffect(() => {
		console.log(childData, 'childData');
	}, [childData]);

	return (
		<div
			className="BaseInfo"
			style={{ background: '#fff', textAlign: 'center' }}
		>
			<h2> 节点ID：{childData?.id}</h2>
		</div>
	);
}

export default BaseInfo;