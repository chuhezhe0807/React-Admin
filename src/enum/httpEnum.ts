// 请求相关枚举

// 请求配置
export enum ResuleEnum {
  SUCCESS = 200,
  ERROR = 500,
  OVERRUE = 599,
  TIMEOUT = 10000,
  TYPE = 'success'
}

// 请求方法
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  PATCH = 'GET'
}

// 常用的contentType类型
export enum ContentEnum {
	// json
	JSON = "application/json;charset=UTF-8",
	// text
	TEXT = "text/plain;charset=UTF-8",
	// form-data 一般配合qs
	FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
	// form-data 上传
	FORM_DATA = "multipart/form-data;charset=UTF-8"
}