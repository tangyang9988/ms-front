export const validateNumber = (rule, value, callback) => {
	let reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
	value = Number(value)
	if(value === '') {
		callback(new Error('必填项不能为空'));
	} else if(!reg.test(value)) {
		callback(new Error('请输入一个数字'));
	} else {
		callback();
	}
};
export const validateInter = (rule, value, callback) => {
	let reg = /^[0-9]*[1-9][0-9]*$/
	value = Number(value)
	if(value === '') {
		callback(new Error('必填项不能为空'));
	} else if(!reg.test(value)) {
		callback(new Error('请输入一个正整数'));
	} else {
		callback();
	}
};
export const isMobile = (rule, value, callback) => {
	let reg = /^1[3456789]\d{9}$/
	value = Number(value)
	if(value === '') {
		callback(new Error('必填项不能为空'));
	} else if(!reg.test(value)) {
		callback(new Error('请输入正确的手机号码'));
	} else {
		callback();
	}
};
export const isIdCard = (rule, value, callback) => {
	let reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
	value = Number(value)
	if(value === '') {
		callback(new Error('必填项不能为空'));
	} else if(!reg.test(value)) {
		callback(new Error('请输入正确的身份证号码'));
	} else {
		callback();
	}
};

export const logitude = (rule, value, callback) => {
	let reg = /^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/
	value = Number(value)
	if(value === '') {
		callback(new Error('必填项不能为空'));
	} else if(!reg.test(value)) {
		callback(new Error('经度范围:-180～180'));
	} else {
		callback();
	}
};

export const latitude = (rule, value, callback) => {
	let reg = /^[\-\+]?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$/
	value = Number(value)
	if(value === '') {
		callback(new Error('必填项不能为空'));
	} else if(!reg.test(value)) {
		callback(new Error('纬度范围:-90～90'));
	} else {
		callback();
	}
};

export const systemName = (rule, value, callback) => {
	var len = 0;
	for(var i = 0; i < value.length; i++) {
		var c = value.charCodeAt(i);
		if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
			len++;
		} else {
			len += 2;
		}
	}
	if(len==0) {
		callback(new Error('系统名称不能为空'));
	} else if(len>32) {
		callback(new Error('系统名称不能超过16个中文汉字或32个英文字母'));
	} else {
		callback();
	}
};