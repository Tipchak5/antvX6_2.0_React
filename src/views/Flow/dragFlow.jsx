import React, { useRef, useState, useEffect } from 'react';
import './flow.less';
import { Dropdown, Button, Modal } from 'antd';
import { Graph } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { register } from '@antv/x6-react-shape';
import { Export } from '@antv/x6-plugin-export';
import { Transform } from '@antv/x6-plugin-transform';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { reset, showPorts, autoLayout } from '../../utils/method';
import { ports } from '../../assets/ports';

let count = 0;

const male =
	'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'; // 节点icon
const female =
	'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ'; // 节点icon
function SoftwareFlow(props) {
	const dndRef = useRef();
	const graphRef = useRef();
	const containerRef = useRef(null);
	const dndContainerRef = useRef(null);
	const [newGraph, setNewGraph] = useState(null); // 画布
	const [isModalOpen, setIsModalOpen] = useState(false); // 编辑节点信息弹框
	const [nodeId, setNodeId] = useState(null);
	const searchParams = new URLSearchParams(props.location.search); // 获取url上的变量

	const nodeArr = [
		{
			id: 1,
			label: 'rect',
			image: male,
		},
		{
			id: 2,
			label: 'circle',
			image: female,
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
			<div className='graph'>
				{/* 拖拽框 */}
				<div className='dnd-wrap' ref={dndContainerRef}>
					<h4>通用节点</h4>
					{/* 根据后台数据渲染节点 */}
					{nodeArr.map((i, index) => {
						return (
							<div
								key={index}
								data-type={i.label}
								className='dnd-rect'
								onMouseDown={(e) => {
									startDrag(e, i.id);
								}}
							>
								<img style={{ width: '15px', marginRight: '5px' }} src={i.image} alt='Icon' />
								{i.label}
							</div>
						);
					})}
					<h4>addGroup</h4>
					<Button onClick={addGroup}>addGroup</Button>
					<h4>其他节点</h4>
					......
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
								label: '运行该节点',
								onClick: () => {
									console.log('运行该节点', node);
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

		nodeArr.forEach((node) => {
			// nodeArr是后台数据
			const { id, label, image } = node;
			const shape = `custom-node${id}`;
			register({
				shape,
				width: 100,
				height: 40,
				attrs: {
					image: {
						'xlink:href': image,
					},
				},
				component: (props) => <CustomComponent {...props} image={image} label={label} />,
			});
		});

		// 画布注册
		const graph = new Graph({
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
			translating: {
				restrict(view) {
					if (view) {
						const cell = view.cell;
						if (cell.isNode()) {
							const parent = cell.getParent();
							if (parent) {
								return parent.getBBox();
							}
						}
					}
					return null;
				},
			}, // 限制子节点的移动范围
			embedding: {
				enabled: true,
				findParent({ node }) {
					const bbox = node.getBBox();
					return this.getNodes().filter((node) => {
						const data = node.getData();
						if (data && data.parent) {
							const targetBBox = node.getBBox();
							return bbox.isIntersectWithRect(targetBBox);
						}
						return false;
					});
				},
			}, // 允许节点被拖入父节点
			connecting: {
				router: 'manhattan', // orth
				connector: 'rounded',
			},
			scroller: true,
		});

		// 拖拽工具注册
		const dnd = new Dnd({
			target: graph,
			scaled: false,
			dndContainer: dndContainerRef.current,
			getDragNode: (node) => node.clone({ keepId: true }), //确保id一致
			getDropNode: (node) => node.clone({ keepId: true }),
		});

		graphRef.current = graph;
		dndRef.current = dnd;

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
		graph
			.use(
				new Snapline({
					enabled: true,
				})
			)
			.use(
				new Selection({
					enabled: true,
				})
			)
			.use(
				new Keyboard({
					enabled: true,
				})
			)
			.use(
				new Clipboard({
					enabled: true,
				})
			)
			.use(
				new History({
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

		graph.bindKey('backspace', () => {
			const cells = graph.getSelectedCells();
			if (cells.length) {
				const cellsId = cells[0]?.id;
				const allChildrenNode = [];
				const nodes = cells.filter((cell) => cell.isNode());
				nodes.forEach((node) => {
					//  获取后继单元格
					const successors = graph.getSuccessors(node, {
						depth: 3,
					});
					allChildrenNode.push(...successors); // 如果删除的是源节点 则删除后面所有节点
					if (allChildrenNode) {
						graph.removeCells(allChildrenNode);
					}
				});
				// 获取后继节点id
				let keyArr = [];
				allChildrenNode.forEach((i) => {
					keyArr.push(i?.id);
				});
				graph.removeCells(cells);
			}
		});

		graph.on('edge:click', ({ edge }) => {
			reset(graph);
			edge.attr('line/stroke', 'orange');
		});

		graph.on('node:click', ({ node }) => {
			reset(graph);
			node.attr('body/stroke', 'orange');
			console.log(node.getParentId(), 'Id'); // 获取父节点
		});

		/** 双击节点 */
		graph.on('cell:dblclick', ({ node }) => {
			console.log(node, 'dddd');
			node?.prop('color', '#54A617');
			setIsModalOpen(true);
		});
		setNewGraph(graph);
	}

	/** 拖拽完成前 */
	function startDrag(e, id) {
		const target = e.currentTarget;
		const type = target.getAttribute('data-type');
		const nodeTypes = {
			rect: `custom-node${id}`,
			circle: `custom-node${id}`,
			//其他节点类型
		};

		const node = graphRef.current.createNode({
			label: type,
			id: getNewNodeId(),
			ports: { ...ports },
			shape: nodeTypes[type],
		});
		dndRef.current?.start(node, e?.nativeEvent);
	}

	/** 生成节点群组 */
	function addGroup() {
		const parent = newGraph.addNode({
			x: 200,
			y: 80,
			width: 240,
			height: 160,
			zIndex: 1,
			label: 'Parent',
			id: getNewNodeId(),
			attrs: {
				body: {
					fill: '#fffbe6',
					stroke: '#ffe7ba',
				},
				label: {
					fontSize: 12,
				},
			},
			data: {
				parent: true,
			},
			ports: { ...ports },
		});

		const child1 = newGraph.addNode({
			x: 240,
			y: 90,
			id: getNewNodeId(),
			width: 100,
			height: 40,
			label: 'child',
			ports: { ...ports },
			shape: `custom-node1`,
		});

		parent.addChild(child1);
	}

	/** 生成唯一的节点id */
	function getNewNodeId() {
		const getNodeIds = (graphInstance) =>
			graphInstance ? graphInstance.getNodes().map((node) => node.id) : []; // 获取画布中所有节点
		const nodeIds = [...getNodeIds(newGraph)];
		let newNodeId = `task${++count}`;
		while (nodeIds.includes(newNodeId)) {
			newNodeId = `task${++count}`;
		} // 生成唯一的nodeId
		return newNodeId;
	}
}

export default SoftwareFlow;
