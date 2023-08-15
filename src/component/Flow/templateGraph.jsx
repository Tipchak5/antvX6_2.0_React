import { Graph } from '@antv/x6';
import { useState, useEffect, useRef } from 'react';

const templateGraph = (props) => {
	const graphRef = useRef(null);
	const [graph, setGraph] = useState(null);

	useEffect(() => {
		// 画布初始化
		if (graphRef.current) {
			const newGraph = new Graph({
				container: graphRef.current,
				width: '100%',
				height: 200,
				grid: true,
				panning: true,
				mousewheel: {
					enabled: true,
					zoomAtMousePosition: true,
					modifiers: 'ctrl',
					minScale: 0.4,
					maxScale: 3,
				},
				scroller: true,
				node: {
					draggable: false,
				},
			});
			newGraph.centerContent();
			newGraph.zoomTo(0.5); // 画布缩放
			setGraph(newGraph);
			return () => {
				newGraph.dispose(); // 销毁画布
			};
		}
	}, [graphRef]);

	useEffect(() => {
		// 渲染父组件传来的画布数据
		if (props.data && graph) {
			tempate();
			console.log(props.data);
		}
	}, [props.data, graph]);

	return (
		<div className='graphBox' style={{ width: '100%', height: '200px' }}>
			<div className='react-shape-app' style={{ width: '100%' }}>
				<div ref={graphRef} style={{ width: '100%', height: '100%' }}></div>
			</div>
		</div>
	);

	/** 模版渲染 */
	async function tempate() {
		graph.removeCells(graph.getCells()); // 清除先前的数据
		await new Promise((resolve) => setTimeout(resolve, 100));
		graph.fromJSON(props.data).centerContent(); // 节点内容渲染与剧中
	}
};

export default templateGraph;
