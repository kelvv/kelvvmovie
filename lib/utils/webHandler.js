'use strict'
const http          = require("http");
const querystring   = require('querystring');
const parse         = require('url-parse');

let webHandler = {

}

webHandler.GetHtml = (url,cookie)=>{
	return new Promise((resove,reject) => {
            let urlDetial = parse(url, true);
            let regex = new RegExp('(?:https?:\/\/)?'+urlDetial.host,'i');
		let options = {
            host: urlDetial.host,
            path: urlDetial.href.replace(regex,''),
            headers: {
                "Cookie": cookie || ''
            }
		};

		let req = http.get(options, function(res) {
            res.setEncoding('utf-8');
            let html = '';
            res.on("data", function(chunk) {
                html=html+chunk;
                
            });
            res.on("end", function(chunk) {
                resove(html.UnicoToUtf8());
            });
		});

		req.on('error', function(e) {
            reject(e);
		});
	})
}

webHandler.Post = (url ,form , cookie)=>{
    return new Promise((resove,reject) => {
            let urlDetial = parse(url, true);
		let formData = querystring.stringify(form);
            let regex = new RegExp('(?:https?:\/\/)?'+urlDetial.host,'i');
		let contentLength = formData.length;
		
		let options = {
            host: urlDetial.host,
            path: urlDetial.href.replace(regex,''),
            method: 'POST',
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded',  
                "Content-Length": contentLength,
                "Cookie": cookie || ''
            }
		};

		let req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (body) {
                resove(body);
            });
		});
		req.on('error', function(e) {
            reject(e);
		});

		// write data to request body
		req.write(formData);
		req.end();

	})
}


module.exports = webHandler;