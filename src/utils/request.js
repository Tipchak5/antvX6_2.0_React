import axios from 'axios';
import qs from 'qs';

const baseUrl = 'https://api.yanshi.com/7304'; // 公司
const apiToken = localStorage.getItem('token');

axios.defaults.timeout = 5000;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + apiToken;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 添加请求拦截器
axios.interceptors.request.use(
	(config) => {
		const apiToken = localStorage.getItem('token');

		// 判断接口是否为登录接口

		if (apiToken) {
			config.headers.Authorization = apiToken;
		}  else {
			console.log('没有token');
		}

		return config;
	},
	(error) => {
		console.log(error);
		return Promise.reject(error);
	}
);

// 响应拦截
axios.interceptors.response.use(
	(config) => {
		return config;
	},
	(error) => {
		const stutas = error.response && error.response.status;
		if (stutas === 400) {
		}
		if (stutas === 424) {
			// 清空数据
			localStorage.clear();
			sessionStorage.clear();
		}
		if (stutas === 403) {
		}
		if (stutas === 404) {
		}
		if (stutas === 500) {
		}
		if (stutas === 503) {
		}
		return Promise.reject(error);
	}
);

// 定义统一的请求函数
export const request = (method, url, data = {}, type) => {
	const resData = type === 'formData' ? qs.stringify(data) : data;
	const config = {
		method: method,
		url: baseUrl + url,
		...(method === 'get' || method === 'delete'
			? { params: data }
			: { data: resData }),
	};

	return axios
		.request(config)
		.then((response) => {
			// 在这里可以对响应进行拦截、转换和处理
			return response.data;
		})
		.catch((error) => {
			// 在这里可以处理请求发生的错误
			// console.log(error);
			throw error;
		});
};
