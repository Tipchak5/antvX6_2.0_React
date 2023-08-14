import React, { useRef, useState, useEffect } from 'react';
import './Flow.less';
import { Dropdown, Modal } from 'antd';
import { Graph } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { register } from '@antv/x6-react-shape';
import { showPorts } from '../../utils/method';
import { ports } from '../../assets/ports';

const male =
	'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'; // 节点icon
const female =
	'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ'; // 节点icon
function SoftwareFlow(props) {
	let graph;
	const dndRef = useRef();
	const graphRef = useRef();
	const containerRef = useRef(null);
	const dndContainerRef = useRef(null);
	const [newGraph, setNewGraph] = useState(null); // 画布
	const [isModalOpen, setIsModalOpen] = useState(false); // 编辑节点信息弹框
	const [nodeId, setNodeId] = useState(null);
	const searchParams = new URLSearchParams(props.location.search); // 获取url上的变量

	// 拖拽节点数据
	const nodeArr = [
		{
			title: '其他节点',
			key: 'myTool',
			children: [
				{
					key: 1,
					title: 'Node1',
					img: male,
				},
				{
					key: 2,
					title: 'Node2',
					img: female,
				},
			],
		},
		{
			title: '通用节点',
			key: 'publicTool',
			children: [],
		},
	];

	useEffect(() => {
		init();
	}, []);
	useEffect(() => {
		const id = searchParams.get('nodeId');
		setNodeId(id);
	}, []);
	return (
		<div className='Flow'>
			<div className='graph' style={{ display: 'flex' }}>
				{/* 拖拽框 */}
				<div className='dnd-wrap' ref={dndContainerRef}>
					{/* <ul> */}
					<div>
						<ul>
							<li>
								其他节点
								<ul>
									{nodeArr[0].children.map((i) => {
										return (
											<div
												style={{ marginTop: '10px' }}
												key={i.key}
												onMouseDown={(e) => {
													startDrag(e, i);
												}}
											>
												{i.title}
											</div>
										);
									})}
								</ul>
							</li>
							<li style={{ marginTop: '10px' }}>通用节点</li>
						</ul>
					</div>
					{/* </ul> */}
				</div>
				{/* 画布 */}
				<div id='graph-container' ref={containerRef}></div>
			</div>

			<Modal
				title='节点信息'
				open={isModalOpen}
				onOk={() => {
					setIsModalOpen(false);
				}}
				onCancel={() => {
					setIsModalOpen(false);
				}}
			>
				<p>Some contents...</p>
			</Modal>
		</div>
	);

	/** 画布初始化 */
	function init() {
		const CustomComponent = ({ node }) => {
			const label = node.prop('label');
			const color = node.prop('color');
			const image = node.store.data.attrs.image['xlink:href']; // 获取图片路径
			return (
				<Dropdown
					menu={{
						items: [
							{
								key: 'running',
								label: '你的菜单栏',
								onClick: () => {
									console.log('节点信息', node);
								},
							},
						],
					}}
					trigger={['contextMenu']}
				>
					<div
						className='custom-react-node'
						style={{
							borderRadius: 4,
							background: color,
						}}
					>
						<img style={{ width: '15px', marginRight: '5px' }} src={image} alt='Icon' />
						{label}
					</div>
				</Dropdown>
			);
		};

		nodeArr[0]?.children?.forEach((node) => {
			// nodeArr是后台数据
			const { key, title, img } = node;
			const shape = `custom-node${key}`;
			register({
				shape,
				width: 100,
				height: 40,
				attrs: {
					image: {
						'xlink:href': img,
					},
				},
				component: (props) => <CustomComponent {...props} image={img} label={title} />,
			});
		});

		// 画布注册
		graph = new Graph({
			container: containerRef.current,
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
				router: 'manhattan', // orth
				connector: 'rounded',
			},
			scroller: true,
		});

		graph.on('node:mouseenter', () => {
			const container = document.getElementById('graph-container');
			const ports = container.querySelectorAll('.x6-port-body');
			showPorts(ports, true);
		});
		graph.on('node:mouseleave', () => {
			const container = document.getElementById('graph-container');
			const ports = container.querySelectorAll('.x6-port-body');
			showPorts(ports, false);
		}); // 显示/隐藏连接桩

		// 拖拽工具注册
		const dnd = new Dnd({
			target: graph,
			scaled: false,
			dndContainer: dndContainerRef.current,
			getDragNode: (node) => node?.clone({ keepId: true }), //确保id一致
			getDropNode: (node) => node?.clone({ keepId: true }),
		});
		graphRef.current = graph;
		dndRef.current = dnd;
		setNewGraph(graph);
	}

	/** 拖拽完成前 */
	function startDrag(e, i) {
		const g = graph ? graph : newGraph;
		// console.log(id);
		const nodeTypes = {
			Node1: `custom-node${i.key}`,
			Node2: `custom-node${i.key}`,
			//其他节点类型
		};

		const node = g?.createNode({
			label: i.title,
			ports: { ...ports },
			color: '',
			shape: nodeTypes[i.title],
		});
		dndRef.current?.start(node, e?.nativeEvent);
	}
}

export default SoftwareFlow;
