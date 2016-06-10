var koa = require('koa');
var wechat = require('co-wechat');
var app = koa();

app.use(wechat('kelvvwechattoken').middleware(function *() {
	var message = this.weixin;
	this.body = 'kelvv and nikki  https://pan.baidu.com/s/1i5IvWl3';
}));

app.listen(443);
