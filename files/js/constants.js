var constants = (window.constants || {});

//0未发布 1 发布 2 报名截止 3 任务分配 4数据处理 5 任务完成
constants.TASKSTATUS = {	//任务状态
		"0" : "未发布",
		"1" : "已发布",
		"2"	: "报名截止",
		"3"	: "任务分配",
		"4"	: "数据处理",
		"5"	: "任务完成"
	};
/** 
学历
{"value": "3", "name":"博士及以上"},
{"value": "2", "name":"硕士"},
{"value": "1", "name":"学士"},
{"value": "0", "name":"高中及以下"},
**/
constants.TALENT_DEGREE_LIST = [0, 1, 2, 3, 4]

constants.TALENT_DEGREE ={
		0:"高中及以下",
		1:"专科",
		2:"本科",
		3:"硕士",
		4:"博士及以上",
} 

/** 
任务状态
{"name":"未发布", "value":"0"},
{"name":"已发布", "value":"1"},
{"name":"报名截止", "value":"2"},
{"name":"任务分配", "value":"3"},
{"name":"数据处理", "value":"4"},
{"name":"任务完成", "value":"5"}
**/
constants.SUB_TASK_STATUS = ['0', '1', '2', '3', '4', '5']


constants.TALENT_GENDER = {	//性别
		"0" 	: "男",
		"1" 	: "女"
};



/**
 *   报名状态
 *   {"name":"领取失败", "value": '-1'},
    {"name":"未处理", "value": '0'},
    {"name":"处理中", "value": '1'},
    {"name":"领取成功", "value": '2'},
 **/
constants.APPLICATION_STATUS=["-2", "-1", "0", "1", "2"]

constants.APPLICATION_STATUSM = {
		'-2':"领取失败",
		'-1':"中途放弃",
		'0':"未处理",
		"1":"处理中",
		"2":"领取成功"
}        
/**
 * 文件类型
 */
constants.DOCUMENT_TYPE = {	
		"0":  "简历",
	    "1":  "报名表",
	    "2":  "实例成果",
	    "3":  "中期报告",
	    "4":  "结果报告",
	    "5":  "初期结果",
	    "6":  "最终结果",
	};

constants.USER_PROCESS_STATUS = ["0", "1", "2", "3", "4", "5", "6"]


/**  
判断输入框中输入的日期格式为yyyy-mm-dd和正确的日期  
**/
constants.checkDate = function(date){
	var reg = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/; 
	if (!reg.test(date)){  
		return true;  
	}  
	return false;  
}

constants.AsyncState = [0, 1, 2]
