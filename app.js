var koa = require('koa');
var wechat = require('co-wechat');
var app = koa();

app.use(wechat('kelvvwechattoken').middleware(function *(){
	var message = this.weixin;
	this.body = {
		type:'text',
		content:'nikki'
	};
});

app.listen(3000);
