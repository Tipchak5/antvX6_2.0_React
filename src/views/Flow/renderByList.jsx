import React, { useEffect, useRef, useState } from 'react';
import { Tree, Dropdown } from 'antd';
import { register } from '@antv/x6-react-shape';
import { Graph } from '@antv/x6';
import { Export } from '@antv/x6-plugin-export';
import { Snapline } from '@antv/x6-plugin-snapline';

import { Transform } from '@antv/x6-plugin-transform';
import { reset, showPorts, autoLayout } from '../../utils/method';
import './nodeFlow.less';

let count = 0;
const male =
	'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'; // 节点icon

const ports = {
	groups: {
		top: {
			position: 'top',
			attrs: {
				circle: {
					r: 4,
					magnet: true,
					// stroke: 'black',
					strokeWidth: 0.2,
					fill: '#fff',
					style: {
						visibility: 'hidden',
					},
				},
			},
		},
		right: {
			position: 'right',
			attrs: {
				circle: {
					r: 4,
					magnet: true,
					// stroke: 'black',
					strokeWidth: 0.2,
					fill: '#fff',
					style: {
						visibility: 'hidden',
					},
				},
			},
		},
		bottom: {
			position: 'bottom',
			attrs: {
				circle: {
					r: 4,
					magnet: true,
					// stroke: 'black',
					strokeWidth: 0.2,
					fill: '#fff',
					style: {
						visibility: 'hidden',
					},
				},
			},
		},
		left: {
			position: 'left',
			attrs: {
				circle: {
					r: 4,
					magnet: true,
					// stroke: 'black',
					strokeWidth: 0.2,
					fill: '#fff',
					style: {
						visibility: 'hidden',
					},
				},
			},
		},
	},
	items: [
		{
			group: 'top',
		},
		{
			group: 'right',
		},
		{
			group: 'bottom',
		},
		{
			group: 'left',
		},
	],
}; // 连接桩

/** 函数组件 */
function ManageFlow(props) {
	let graph;
	const nodeInfoRef = useRef(null);

	const [newGraph, setNewGraph] = useState(null); // 画布
	const [nodeInfo, setNodeInfo] = useState(null); // 节点信息
	const [treeList, setTreeList] = useState([
		{
			title: '节点列表',
			key: 'list',
			children: [
				{
					title: 'node1',
					color: '#F6E98C',
					key: 1,
					parents: [-1],
				},
				{
					title: 'node2',
					color: '',
					key: 2,
					parents: [1],
				},
				{
					title: 'node3',
					color: '',
					key: 3,
					parents: [1],
				},
				{
					title: 'node4',
					color: 'pink',
					key: 4,
					parents: [3],
				},
				{
					title: 'node5',
					color: '',
					key: 5,
					parents: [3],
				},
			],
		},
	]); // 目录树

	useEffect(() => {
		nodeInfoRef.current = nodeInfo;
		console.log(nodeInfoRef.current);
	}, [nodeInfo]);

	useEffect(() => {
		init(); // 初始画布
		graph.centerContent();
		graph
			.use(
				new Snapline({
					enabled: true,
				})
			)
			.use(
				new Transform({
					resizing: true,
					rotating: true,
					enabled: true,
				})
			)
			.use(new Export());

		graph.on('node:click', ({ node }) => {
			console.log(node);
		});

		graph.on('edge:click', ({ edge }) => {
			reset(graph);
			edge.attr('line/stroke', 'orange');
		});

		// 右键操作
		graph.on('node:contextmenu', ({ node }) => {
			setNodeInfo(node);
		});

		// 删除处理
		graph.bindKey('backspace', () => {
			const cells = graph.getSelectedCells();
			const cellsId = cells[0].id;
			if (cellsId) {
				graph.removeCells(cells);
				// 删除节点信息 接口
			}
		});

		graph.zoomTo(0.8);

		refreshGraph();

		return () => {
			graph.dispose(); // 销毁画布
		};
	}, []);

	return (
		<div className='FlowManage'>
			<div className='content' style={{ flexDirection: 'initial' }}>
				<Tree defaultExpandAll treeData={treeList} style={{ width: '180px', padding: '15px' }} />

				<div className='graphBox'>
					<div className='react-shape-app graph'>
						<div id='graph-container' className='app-content' style={{ flex: 1 }}></div>
					</div>
				</div>
			</div>
		</div>
	);

	/** 初始化画布 */
	function init() {
		// 右键菜单
		const CustomComponent = ({ node }) => {
			const label = node.prop('label');
			const color = node.prop('color');

			const boder = node.store?.data?.attrs?.body?.stroke;
			return (
				<Dropdown
					menu={{
						items: [
							{
								key: 'add',
								label: '新增任务',
								onClick: () => {
									addTask();
								},
							},
						],
					}}
					trigger={['contextMenu']}
				>
					<div
						className='custom-react-node'
						style={{
							background: label === '开始' ? '#7AA874' : color,
							borderRadius: label === '开始' ? '50%' : '0',
							border: `3px solid ${boder}`,
						}}
					>
						{label === '开始' ? null : <img className='img' src={male} alt='Icon' />}
						{label}
					</div>
				</Dropdown>
			);
		};

		register({
			shape: 'custom-react-node',
			width: 100,
			height: 40,
			attrs: {
				label: {
					textAnchor: 'left',
					refX: 8,
					textWrap: {
						ellipsis: true,
					},
				},
			},
			component: CustomComponent,
		});

		graph = new Graph({
			container: document.getElementById('graph-container'),
			grid: true,
			panning: true,
			mousewheel: {
				enabled: true,
				zoomAtMousePosition: true,
				modifiers: 'ctrl',
				minScale: 0.4,
				maxScale: 3,
			},
			connecting: {
				snap: true,
				router: 'manhattan', // orth
				highlight: true,
			},
			scroller: true,
		});

		graph.centerContent();

		graph.on('node:mouseenter', () => {
			const container = document.getElementById('graph-container');
			const ports = container.querySelectorAll('.x6-port-body');
			showPorts(ports, true);
		});
		graph.on('node:mouseleave', () => {
			const container = document.getElementById('graph-container');
			const ports = container.querySelectorAll('.x6-port-body');
			showPorts(ports, false);
		});
		setNewGraph(graph);
	}

	/** 新增节点 */
	function addTask() {
		let newNodeOptions = null;
		newNodeOptions = {
			shape: 'custom-react-node',
			width: 100,
			height: 50,
			id: `task${++count}`,
			attrs: {
				body: {
					strokeWidth: 0.2,
					fill: '#fff',
					refWidth: 1,
					refHeight: 1,
				},
			},
			label: `任务${count}`,
			ports: { ...ports },
		};
		let newNode = null; // 将 newNode 初始化为 null
		const g = graph ? graph : newGraph;

		if (nodeInfoRef.current) {
			// 如果 nodeInfoRef.current 存在且 graph 存在，则将新节点添加到 graph 中
			newNode = g.addNode(newNodeOptions); // 在添加边之前声明和初始化 newNode
			g.addEdge({
				source: nodeInfoRef.current,
				target: newNode,
				router: {
					name: 'manhattan',
				},
			});
		} else {
			g?.addNode(newNodeOptions); // 在添加边之前声明和初始化 newNode
		}
		autoLayout(g); // 自动布局
	}

	/** 根据列表渲染节点 */
	function refreshGraph() {
		const g = graph ? graph : newGraph;
		g?.clearCells(); // 清除先前的数据

		graph.addNode({
			shape: 'custom-react-node',
			id: -1,
			label: '开始',
			ports: { ...ports },
		});

		treeList[0].children?.forEach((i) => {
			let newNodeOptions = null;
			// 1、根据type渲染不同类型大的节点

			newNodeOptions = {
				shape: 'custom-react-node',
				id: i.key,
				label: i.title,
				color: i.color,
				ports: { ...ports },
			};

			// 3、如果存在父节点 连接两个节点
			let newNode = null;
			if (i.parents && g) {
				// const node = g.getCellById(i.parent);
				newNode = g?.addNode(newNodeOptions);
				i.parents.forEach((id) => {
					// 根据父id 连接子
					g?.addEdge({
						source: id,
						target: i.key,
						router: {
							name: 'manhattan',
						},
					});
				});
			} else {
				// 如果没有父节点
				g?.addEdge({
					source: -1,
					target: i.key,
					router: {
						name: 'manhattan',
					},
				});
				g?.addNode(newNodeOptions);
			}

			autoLayout(g); // 如果 position 不是空 就要自动布局
		});
	}
}

export default ManageFlow;
