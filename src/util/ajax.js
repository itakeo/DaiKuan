import Taro from '@tarojs/taro'
import des3_encrypt from './des3.js'
export default function Ajax(url,b){
	Taro.showLoading({
		title: 'loading'
	});
    let _param = {};
    let jsonstr = JSON.stringify(b || {});
    _param.inputparam = des3_encrypt(jsonstr);
	return new Promise((resolve, reject) => {
    	Taro.request({
    		method: 'GET',
    		url: url,
    		data: _param,
    		success : res => {
    			Taro.hideLoading();
    			resolve(res.data);
    		},
    		fail : res => {
    			Taro.hideLoading();
    			reject(res);
    		}
    	});
    });
}