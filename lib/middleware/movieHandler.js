const env = require('../config/env');
const webHandler = require('../utils/webHandler');

function movieHandler() {
    return function *(next) {
        if(!this.result){
            let movieHtml = yield webHandler.GetHtml('http://www.bd-film.com/search.jspx?q='+this.searchName);
            let detialMatch =movieHtml.match(/<a\s*href="([^<>"]+?\d+\.htm)"\s*[^<>]+?target="_blank">[^<]+<\/a>\s+/);
            if(!detialMatch || detialMatch.length<=0){
                this.send('cant find the movie');
                return;
            }
            let movieDetialHtml = yield webHandler.GetHtml(detialMatch[1]);
            let linkMatch = movieDetialHtml.match(/<a\s*class="label label-warning"\s*id="normal_link"[\s\S]+?href="([^"]+)"/);
            if(!linkMatch||linkMatch.length<=0){
                this.send('cant find the movie');
                return;
            }

            let form = {
                method : "add_task",
                app_id : "250528",
                source_url: linkMatch[1],
                save_path : '/',
                type :  '3'
            }
            let result = yield webHandler.Post(`https://${env.WANGPAN.HOST}${env.WANGPAN.DOWNLOADURL}`,form,env.WANGPAN.COOKIE);
            if(result.indexOf('task_id')>0){
                let downlist = yield webHandler.GetHtml(`https://${env.WANGPAN.HOST}${env.WANGPAN.MOVIELISTURL}`,env.WANGPAN.COOKIE);
                let mr =new RegExp(`\\{[^\\}]+?fs_id"\\s*:\\s*(\\d+)(?:(?!server_filename)[\\s\\S])+?"server_filename":\\s*"[^"]+?${this.searchName}`, 'g'); 
                let moviematch = downlist.match(mr);
                let movieID = moviematch[0].match(/fs_id":(\d+)/,'ig')[1];
                let shareForm = {
                    fid_list : `[${movieID}]`,
                    schannel: '0',
                    channel_list: '[]'
                }
                let shareResult = yield webHandler.Post(`https://${env.WANGPAN.HOST}${env.WANGPAN.SHAREURL}`,shareForm,env.WANGPAN.COOKIE);
                this.send(`已为您准备好电影，请点击观看－－>\n \n ${shareResult.match(/"shorturl":"([^"]+)/)[1].replace(/\\/ig,'')} \n \n --祝你生活愉快`);
            }
        }
        yield next;
    }
}

module.exports = movieHandler;


