import { request } from '../utils/request';

export const userInfoList = () => {
	return request('get', '/user/list/info/get.do'); //查询所有用户基本信息 ✅
};

export const userInfo = (params) => {
	return request('get', '/user/info/get.do', params, 'formData'); //查询当前用户基本信息 ✅
};

export const editUserInfo = (params) => {
	return request('post', '/user/info/update.do', params); //修改用户基本信息  ✅
};

export const logout = (params) => {
	return request('post', '/user/logout.do', params, 'formData'); // 登出 ✅
};

export const userLogin = (params) => {
	return request('post', '/user/login.do', params, 'formData'); // 登录 ✅
};

export const editPassword = (params) => {
	return request('post', '/user/pwd/change.do', params, 'formData'); // 修改当前用户密码  ✅
};

export const userRegister = (params) => {
	return request('post', '/user/register.do', params); // 用户注册 ✅
};

export const getAuditList = (params) => {
	return request('get', '/user/register/list/get.do', params); // 账号审核列表 ✅
};

export const auditUser = (params) => {
	return request('post', '/user/register/list/audit.do', params); // 批量审核注册用户 ✅
};

export const addUserList = (params) => {
	return request('post', '/user/list/add.do', params); // 用户批量添加 ✅
};

export const deleteUserList = (params) => {
	return request('delete', '/user/list/delete.do', params); // 批量删除用户 ✅
};

export const logOffAccount = (params) => {
	return request('delete', '/user/account/delete.do', params); // 注销账号 ✅
};

export const accountsDisabled = (params) => {
	return request('post', '/user/deletedUserById.do', params); // 禁用用户
};

/**
 * 岗位 staff
 */
export const addStaff = (params) => {
	return request('post', '/user/staff/add.do', params); // 新增岗位 ✅
};

export const deleteStaff = (params) => {
	return request('delete', '/user/staff/delete.do', params); // 删除员工岗位 ✅
};

export const getStaff = () => {
	return request('get', '/user/staff/get.do'); // 查询岗位 ✅
};

export const editStaff = (params) => {
	return request('post', '/user/staff/update.do', params); // 修改岗位 ✅
};

/**
 * 职称 engineer
 */

export const addEngineer = (params) => {
	return request('post', '/user/engineer/add.do', params); // 新增职称 ✅
};

export const deleteEngineer = (params) => {
	return request('delete', '/user/engineer/delete.do', params); // 删除职称 ✅
};

export const getEngineer = () => {
	return request('get', '/user/engineer/get.do'); // 查询职称 ✅
};

export const editEngineer = (params) => {
	return request('post', '/user/engineer/update.do', params); // 修改职称 ✅
};

export const addDepartment = (params) => {
	return request('post', '/user/department/add.do', params); // 新增部门 ✅
};

export const deleteDepartment = (params) => {
	return request('delete', '/user/department/delete.do', params); // 删除部门 ✅
};

export const getDepartment = () => {
	return request('get', '/user/department/get.do'); // 查询部门 ✅
};

export const editDepartment = (params) => {
	return request('post', '/user/department/update.do', params); // 修改部门 ✅
};

export const getMessage = (userId) => {
	return request('get', `/user/startTypeMsg/get.do?userId=${userId}`); // 获取阶段和任务启动信息 ✅
};  

export const getHistoryNews = (userId) => {
  return request('get', `/user/history/get.do?userId=${userId}`)
}; // 获取历史消息  ✅

export const deleteNew = (id) => {
  return request('delete', '/user/history/delete.do',id)
}; // 获取历史消息  ✅

export const isReady = (params) => {
	return request('post', '/user/read/post.do',params); // 获取阶段和任务启动信息 ✅
};


