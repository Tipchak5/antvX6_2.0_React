import { request } from '../utils/request';

export const eTask = (params) => {
	return request('post', '/assignment/endAssignment/get.do', params); // 结束任务 ✅
};

export const sTask = (params) => {
	return request('post', '/assignment/startAssignment/get.do', params, 'formData'); // 开始任务 ✅
};

export const editTaskInfo = (params, id) => {
	return request('post', `/assignment/updateAssignment/update.do?userId=${id}`, params); // 修改任务信息; ✅
};

export const deleteTask = (params) => {
	return request('post', '/assignment/deleteAssignmentById/delete.do', params, 'formData'); // 删除任务; ✅
};

export const getproList = () => {
	return request('get', '/assignment/getProjectList/get.do'); // 获取项目下拉框 ✅
};

export const getTaskInfo = (params) => {
	return request('get', '/assignment/getAssignmentById/get.do', params); // 根据任务id获取任务基本信息  ✅
};

export const getTaskList = (params) => {
	return request('get', '/assignment/getAssignmentUserList/get.do', params); // 根据用户id获取任务列表  ✅
};

export const getProTaskList = (params) => {
	return request('get', '/assignment/getAssignmentList/get.do', params); // 根据项目id获取项目下任务列表任务列表 ✅
};

export const getTaskType = () => {
	return request('get', '/type/getTypeList/get.do'); // 获取任务类型  ✅
};

export const addParentTask = (params, id) => {
	return request('post', `/assignment/insertAssignment/insert.do?userId=${id}`, params); // 添加父级任务 ✅
};

export const addChildTask = (params, id, assignmentId) => {
	return request(
		'post',
		`/assignment/addSonAssignment/insert.do?userId=${id}&assignmentId=${assignmentId}`,
		params
	); // 添加子级任务 ✅
};

export const tree = (params) => {
	return request('get', '/assignment/getAssignmentTree/get.do', params); // 任务树 ✅
};

export const sumbitTask = (params) => {
	return request('post', `/assignment/submitAssignment/get.do`, params); // 提交任务 ✅
};

export const exportList = (params) => {
	return request('get', '/assignment/getExportList/get.do', params); // 获取输出内容 ✅
};

export const processList = (params) => {
	return request('get', '/assignment/getProcessList/get.do', params); // 审核列表 ✅
};

export const executeProcess = (params) => {
	return request('post', '/assignment/executeProcess/get.do', params, 'formData'); // 执行审核 ✅
};

export const executeInfo = (params) => {
	return request('get', `/assignment/timeLine/get.do?id=${params}`); // 审核时间线 ✅
};

export const inputList = (params) => {
	return request('get', '/assignment/getInputList/get.do', params, 'formData'); // 获取输入内容 ✅
};

export const downloadExportFile = (params) => {
	return request('get', '/assignment/downloadExportFile/get.do', params, 'formData'); // 下载输出文件 ✅
};

export const downloadInputFile = (params) => {
	return request('get', '/assignment/downloadInputFile/get.do', params, 'formData'); // 下载输入文件 ✅
};

export const deleteExportName = (params) => {
	return request('post', '/assignment/deleteExport/delete.do', params, 'formData'); // 删除输出项 ✅
};

export const editExportName = (params) => {
	return request('post', '/assignment/updateExport/update.do', params); // 修改输出内容 ✅
};

export const taskNumber = (params) => {
	return request('get', `/assignment/getOngoingNum/get.do?userId=${params}`); // 获取带完成任务数量 ✅
};

export const taskList = (params) => {
	return request('get', `/assignment/refresh/get.do?userId=${params}`); // 任务刷新缓存 ✅
};

export const finishedNum = (params) => {
	return request('get', `/assignment/finish/get.do?userId=${params}`); // 获任务完成百分比
};
