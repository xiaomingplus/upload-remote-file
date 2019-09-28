const Upload = require('./index')
const upload = new Upload()
    upload.request({
        url:"http://127.0.0.1:8080/api/v2/torrents/add",
        formData:{
            fileselect:[upload.getReadStream('https://yts.lt/torrent/download/8412B407FBA6EF4F43CC8458F8D77BE22CC57967')],
        }
    }).then(data=>{
        console.log('statusCode',data.statusCode);
        console.log('body  ',data.body);
    }).catch(e=>{
        console.log('e',e);
    })
