'use strict'
require('./lib/utils/stringExt');
const koa = require('koa');
const wechat = require('co-wechat');
const app = koa();
const fs 		= require('fs-extra');
fs.mkdirpSync(process.cwd() + '/logs');
const applogger = require('./lib/utils/log').get('app');
const movieHandler = require('./lib/middleware/movieHandler');
const env = require('./lib/config/env');

app.use(function *() {
	if(this.originalUrl==='/favicon.ico'){
		return;
	}
	this.searchName = '致命呼叫/危情911';
	let context = this;
	this.send = (body) => {
		context.status = 200;
		context.body = body;
	}
	yield movieHandler(context);
})
/*
app.use(wechat('kelvvwechattoken').middleware(function *() {
	if(this.originalUrl==='/favicon.ico'){
		return;
	}
	var message = this.weixin;
	this.searchName = message;
	let context = this;
	this.send = (body) => {
		context.status = 200;
		context.body = body;
	}
	yield movieHandler(context);
}));
*/

app.listen(env.PORT || 9302);
applogger.info('-----------app is listening in 9302------------');
