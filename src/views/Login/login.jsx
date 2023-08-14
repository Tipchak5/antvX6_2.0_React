import React, { useRef, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../Login/login.less';
import {
	userLogin,
	getDepartment,
	getStaff,
	getEngineer,
} from '../../service/user';
import { message, Button, Input, Form, Select, Spin } from 'antd';

function LoginPage(props) {
	// 基础数据
	const formRef = useRef(null);
	const [form] = Form.useForm();

	const [department, setDepartment] = useState(null); // 部门
	const [loading, setLoading] = useState(null);
	const [staff, setStaff] = useState(null); // 岗位
	const [engineer, setEngineer] = useState(null); // 职称
	const [isManage, setIsManage] = useState(null); // 是否为管理者

	useEffect(() => {
		getStaffList();
		getEngineerList();
		getDepartmentList();
	}, []);

	return (
		<div className="login">
			<Spin spinning={loading}></Spin>
			<div className="login-box">
				<h2
					onClick={() => {
						setIsManage(!isManage);
					}}
				>
					联合仿真{isManage ? '管理' : null}系统
				</h2>
				<Form
					form={form}
					name="control-hooks"
					ref={formRef}
					onFinish={login}
				>
					<Form.Item
						name="account"
						label="账号"
						rules={[
							{
								required: true,
								message: '请填写用户名！',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="password"
						label="密码"
						rules={[
							{
								required: true,
								message: '请填写密码！',
							},
						]}
					>
						<Input.Password minLength={6} />
					</Form.Item>
					<Form.Item
						name="engineer"
						label="职称"
						rules={[
							{
								required: true,
								message: '请选择职称！',
							},
						]}
					>
						<Select placeholder="请选择职称" options={engineer} />
					</Form.Item>

					{/* 如果是管理员 就不显示部门和岗位 */}
					{isManage ? null : (
						<div>
							<Form.Item
								name="department"
								label="部门"
								rules={[
									{
										required: true,
										message: '请选择部门！',
									},
								]}
							>
								<Select
									placeholder="请选择部门"
									options={department}
								/>
							</Form.Item>
							<Form.Item
								name="staff"
								label="岗位"
								rules={[
									{
										required: true,
										message: '请选择岗位！',
									},
								]}
							>
								<Select
									placeholder="请选择您的职称"
									allowClear
									options={staff}
								/>
							</Form.Item>
						</div>
					)}

					<Form.Item
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<Button type="primary" htmlType="submit">
							登录
						</Button>
				
					</Form.Item>
				</Form>
			</div>
		</div>
	);

	/**
	 * 获取部门列表
	 */
	function getDepartmentList() {
		getDepartment().then((res) => {
			const result = res.result.map((item) => {
				return {
					label: item.name,
					value: item.name,
				};
			});
			// console.log(result);
			setDepartment(result);
		});
	}

	/**
	 * 获取岗位列表
	 */
	function getStaffList() {
		getStaff().then((res) => {
			const result = res.result.map((item) => {
				return {
					label: item.name,
					value: item.name,
				};
			});
			setStaff(result);
		});
	}

	/**
	 * 获取职称列表
	 */
	function getEngineerList() {
		getEngineer().then((res) => {
			const result = res.result.map((item) => {
				return {
					label: item.name,
					value: item.name,
				};
			});
			setEngineer(result);
		});
	}


	/**
	 * 登录
	 * @param {Object} values 表单数据
	 */
  function login (values) {
    localStorage.clear();
    sessionStorage.clear();
		// console.log(values);
    userLogin(values).then((res) => {
			setLoading(true);
			if (res.code === '200') {
				message.success(res.message);

				localStorage.setItem('userName', res.result.name);
				localStorage.setItem('userId', res.result.id);
				localStorage.setItem('token', res.result.token);

				// 如果token存在才能登陆
				if (localStorage.getItem('token')) {
					props.history.push('/home');
					setLoading(false);
				}
			} else {
				message.error(res.message);
				setLoading(false);
			}
		});
	}
}
export default LoginPage;
