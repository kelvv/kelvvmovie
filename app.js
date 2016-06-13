require('./lib/utils/stringExt');
const koa = require('koa');
const wechat = require('co-wechat');
const app = koa();
const fs 		= require('fs-extra');
fs.mkdirpSync(process.cwd() + '/logs');
const applogger = require('./lib/utils/log').get('app');
const movieHandler = require('./lib/middleware/movieHandler');
const env = require('./lib/config/env');

/*app.use(wechat('kelvvwechattoken').middleware(function *() {
	var message = this.weixin;
	var resulturl = '';
	
	this.body = '已为您找到观看地址：'+resulturl;
}));*/

app.use(function *(next) {
	if(this.originalUrl==='/favicon.ico'){
		return;
	}
	yield next;
})

app.use(function *(next){
	var searchName = '爱丽丝梦游仙境2';
	this.searchName = searchName;
	let context = this;
	this.send = (body) => {
		context.status = 200;
		context.body = body;
	}
	yield next;
});

app.use(movieHandler());

app.listen(env.PORT || 9302);
applogger.info('-----------app is listening in 9302------------');
