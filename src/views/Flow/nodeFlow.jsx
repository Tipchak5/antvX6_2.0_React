import React, { useEffect, useRef, useState } from 'react';
import {
	message,
	Dropdown,
	Button,
	Modal,
	Select,
	Form,
	Space,
	Input,
} from 'antd';
import myContext from '../../utils/context';
import BaseInfo from '../../component/Flow/NodeInfo/NodeIndex';
import TemplateGraph from '../../component/Flow/templateGraph';
import New from '../../assets/new.json';
import New2 from '../../assets/masterplate.json';

import { register } from '@antv/x6-react-shape';
import { Graph } from '@antv/x6';
import { Export } from '@antv/x6-plugin-export';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Transform } from '@antv/x6-plugin-transform';
import { reset, showPorts, autoLayout } from '../../utils/method';
import './nodeFlow.less';
import { ports } from '../../assets/ports';

let count = 0;
const male =
	'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'; // 节点icon

/** 函数组件 */
function ManageFlow(props) {
	let graph;
	const nodeInfoRef = useRef(null);
	const [isShowTemplate, setIsShowTemplate] = useState(false); // 是否展示模版
	const [newToChild, setNewToChild] = useState(); // 传输模版数据给子组件

	const formRef = useRef(null);
	const formRef2 = useRef(null);
	const [newGraph, setNewGraph] = useState(null); // 画布

	const [template, setTemplate] = useState([
		{
			label: 1,
			value: '1',
		},
		{
			label: 2,
			value: '2',
		},
	]); // 模版
	const [clickNodeInfo, setClickNodeInfo] = useState(null); // 右键新增节点
	const [isModalOpen, setIsModalOpen] = useState(false); // 模版弹框
	const [modalTitle, setModalTitle] = useState(null);
	const [nodeInfo, setNodeInfo] = useState(null); // 节点信息

	useEffect(() => {
		nodeInfoRef.current = nodeInfo;
	}, [nodeInfo]);

	useEffect(() => {}, []);

	useEffect(() => {
		init(); // 初始画布
		autoLayout(graph); // 自动布局
		graph.centerContent();
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

		graph.on('node:click', ({ node }) => {
			console.log(node);
			setClickNodeInfo(node); // 节点信息
		});

		graph.on('edge:click', ({ edge }) => {
			reset(graph);
			edge.attr('line/stroke', 'orange');
		});

		graph.on('cell:click', ({ cell }) => {
			reset(graph);
			cell.attr('body/stroke', 'orange');
		});

		// 右键操作
		graph.on('node:contextmenu', ({ node }) => {
			setNodeInfo(node);
		});

		graph.bindKey(['ctrl+1', 'meta+1'], () => {
			const zoom = graph.zoom();
			if (zoom < 1.5) {
				graph.zoom(0.1);
			}
		});

		graph.bindKey(['ctrl+2', 'meta+2'], () => {
			const zoom = graph.zoom();
			if (zoom > 0.5) {
				graph.zoom(-0.1);
			}
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

		return () => {
			graph.dispose(); // 销毁画布
		};
	}, []);

	return (
		<div className="FlowManage">
			<myContext.Provider
				value={{
					childData: clickNodeInfo,
				}}
			>
				<div className="btnArr">
					<Button
						type="primary"
						onClick={() => {
							addTask();
						}}
					>
						addNode
					</Button>
					<Button
						type="primary"
						onClick={() => {
							setIsModalOpen(true);
							setModalTitle('选择模版');
						}}
					>
						引入模版
					</Button>
					<Button
						type="primary"
						onClick={() => {
							setIsModalOpen(true);
							setModalTitle('导出模版');
						}}
					>
						导出模版
					</Button>
				</div>
				<div className="content">
					<div className="graphBox">
						<div className="react-shape-app graph">
							<div
								id="graph-container"
								className="app-content"
								style={{ flex: 1 }}
							></div>
						</div>
					</div>

					<div className="newAllocation">
						<BaseInfo />
					</div>

					{/* 模版弹框 */}
					<Modal
						className="dirModal"
						title={modalTitle}
						open={isModalOpen}
						centered="true"
						forceRender="true"
						footer={null}
						onCancel={() => {
							cancelModal();
						}}
					>
						<Form
							className="ModalForm"
							name="control-hooks"
							ref={formRef2}
							onFinish={sumbitTemplate}
						>
							{/* 根据 modalTitle 的值来渲染表单项 */}
							{modalTitle === '选择模版' ? (
								<>
									<Form.Item
										style={{ width: '100%' }}
										name="type"
										label="模版导入"
										rules={[
											{
												required: true,
												message: '请选择模版！',
											},
										]}
									>
										<Select
											onSelect={(value) => {
												handClick(value);
											}} // 选择后获取模版数据
											placeholder="请选择模版"
											options={template}
										/>
									</Form.Item>
									{/* 节点模版展示 */}
									{isShowTemplate ? (
										<TemplateGraph data={newToChild} />
									) : null}
								</>
							) : (
								<Form.Item
									style={{ width: '100%' }}
									name="name"
									label="模版名称"
									rules={[
										{
											required: true,
											message: '请选择填写模版名称！',
										},
									]}
								>
									<Input placeholder="请填写模版名称" />
								</Form.Item>
							)}
							<Form.Item
								className="btn"
								style={{ justifyContent: 'center' }}
							>
								<Button type="primary" htmlType="submit">
									确认
								</Button>
								<Button
									htmlType="button"
									onClick={() => {
										formRef.current?.resetFields();
										setIsModalOpen(false);
										setIsShowTemplate(false); // 关闭弹框画布
									}}
								>
									取消
								</Button>
							</Form.Item>
						</Form>
					</Modal>
				</div>
			</myContext.Provider>
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
						className="custom-react-node"
						style={{
							background: label === '开始' ? '#7AA874' : color,
							borderRadius: label === '开始' ? '50%' : '0',
							border: `3px solid ${boder}`,
						}}
					>
						{label === '开始' ? null : (
							<img className="img" src={male} alt="Icon" />
						)}
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

		graph.addNode({
			shape: 'custom-react-node',
			id: -1,
			label: '开始',
			ports: { ...ports },
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

	function handClick(value) {
		setIsShowTemplate(true);
		if (value === '1') {
			setNewToChild(New);
		} else {
			setNewToChild(New2);
		}
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

	/**
	 * 模版提交
	 * @param {Object} value 模版表单数据
	 */
	async function sumbitTemplate(value) {
		if (modalTitle === '选择模版') {
			// 插入模版
			const cells = newGraph.getCells(); // 获取所有单元格
			newGraph.removeCells(cells); // 清空所有单元格
			await new Promise((resolve) => setTimeout(resolve, 100));
			if (value.type == 1) {
				newGraph.fromJSON(New).centerContent(); // 导入模版到画布
			} else {
				newGraph.fromJSON(New2).centerContent(); // 导入模版到画布
			}
			// 更新目录树
			message.success('插入成功！');
		} else if (modalTitle === '导出模版') {
			// 导出模版

			console.log(
				JSON.stringify(newGraph.toJSON({ diff: true })),
				'导出'
			);
		}
		setIsModalOpen(false);
		setIsShowTemplate(false); // 关闭弹框画布
		formRef2.current?.resetFields();
	}

	/** 取消弹框 */
	function cancelModal(data) {
		Modal.confirm({
			title: '确认要取消吗?',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				if (data) {
					formRef.current?.resetFields();
				} else {
					formRef2.current?.resetFields();
					setIsModalOpen(false);
					setIsShowTemplate(false); // 关闭弹框画布
				}
			},
		});
	}
}

export default ManageFlow;
