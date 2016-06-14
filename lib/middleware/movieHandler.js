'use strict'
const env = require('../config/env');
const webHandler = require('../utils/webHandler');
const co    = require('co');

function movieHandler(m) {
    return new Promise((resove,reject) => {
        co(function* () {
            let context = m;
            console.log(context)
            if(!context.result){
                let movieHtml = yield webHandler.GetHtml('http://www.bd-film.com/search.jspx?q='+context.searchName);
                let detialMatch =movieHtml.match(/<a\s*href="([^<>"]+?\d+\.htm)"\s*[^<>]+?target="_blank">[^<]+<\/a>\s+/);
                if(!detialMatch || detialMatch.length<=0){
                    context.send('cant find the movie');
                    return;
                }
                let movieDetialHtml = yield webHandler.GetHtml(detialMatch[1]);
                let linkMatch = movieDetialHtml.match(/<a\s*class="label label-warning"\s*id="normal_link"[\s\S]+?href="([^"]+)"/);
                if(!linkMatch||linkMatch.length<=0){
                    context.send('cant find the movie');
                    return;
                }

                let form = {
                    method : "add_task",
                    app_id : "250528",
                    source_url: linkMatch[1],
                    save_path : '/',
                    type :  '3'
                }
                let resourceName = linkMatch[1].match(/file\|\[[^\]]+\]([^\|]+)/)[1];
                let result = yield webHandler.Post(`https://${env.WANGPAN.HOST}${env.WANGPAN.DOWNLOADURL}`,form,env.WANGPAN.COOKIE);
                if(result.indexOf('task_id')>0){
                    let downlist = yield webHandler.GetHtml(`https://${env.WANGPAN.HOST}${env.WANGPAN.MOVIELISTURL}`,env.WANGPAN.COOKIE);
                    let mr =new RegExp(`\\{[^\\}]+?fs_id"\\s*:\\s*(\\d+)(?:(?!server_filename)[\\s\\S])+?"server_filename":\\s*"[^"]+?${resourceName}`, 'g'); 
                    let moviematch = downlist.match(mr);
                    let movieID = moviematch[0].match(/fs_id":(\d+)/,'ig')[1];
                    let shareForm = {
                        fid_list : `[${movieID}]`,
                        schannel: '0',
                        channel_list: '[]'
                    }
                    let shareResult = yield webHandler.Post(`https://${env.WANGPAN.HOST}${env.WANGPAN.SHAREURL}`,shareForm,env.WANGPAN.COOKIE);
                    context.send(`已为您准备好[${resourceName}]，请点击观看－－>\n \n ${shareResult.match(/"shorturl":"([^"]+)/)[1].replace(/\\/ig,'')} \n \n --祝你生活愉快`);
                    resove();
                }
            }
        })
    })
}

module.exports = movieHandler;


