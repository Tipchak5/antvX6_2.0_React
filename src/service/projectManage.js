import { request } from '../utils/request';

export const deleteProject = (params) => {
	return request(
		'post',
		'/project/deleteProjectById/delete.do',
		params,
		'formData'
	); // 删除项目 ✅
};

export const addNewProject = (params) => {
	return request(
		'post',
		`/project/insertProject/insert.do?userId=${params.userId}`,
		params
	); // 新增项目 ✅
};

export const getProjectInfo = (params) => {
	return request('get', '/project/selectProjectById/get.do', params); // 项目信息 ✅
};

export const getProjectList = (params) => {
	return request('get', '/project/selectProjectList/get.do', params); // 查询项目集列表 ✅
};

export const getUser = () => {
	return request('get', '/project/selectUserList/get.do'); // 获取用户ID，姓名列表 ✅
};

export const changeProject = (params) => {
	return request('post', '/project/uploadProject/update.do', params); // 修改项目 ✅
};

export const stageList = () => {
	return request('get', '/type/getTypeList/get.do'); // 阶段 ✅
};

export const startStage = (params) => {
	return request('get', '/type/startType/get.do', params); // 阶段开始 ✅
};

export const stageFinish = (params) => {
	return request('get', '/type/finishType/get.do', params); // 阶段完成 ✅
};

export const processFiles = (params) => {
	return request('get', '/assignment/files/get.do', params,'formData'); // 过程文件
};


