import { request } from '../utils/request';

export const getAdvertisement = (params) => {
	return request('post', '/api/index/getAdvertisement', params);
};
