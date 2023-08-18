const axios = require('axios');
const crypto = require('crypto');
const alicloud = require('@alicloud/pop-core');
var TOKEN

async function xiaoniu(event, translate_data) {
    if (translate_data.from === translate_data.to){
        let result = {name: "Xiaoniu", "value": translate_data.text}
        event.sender.send("ResultsReceive", result)
        return
    }
    const url = 'http://api.niutrans.com/NiuTransServer/translation';
    const data = {
        from: translate_data.from,
        to: translate_data.to,
        apikey: TOKEN.translator.Xiaoniu.AK,
        src_text: translate_data.text
    };

    axios.post(url, data)
        .then(response => {
            let resp = response.data
            let result = {name: "Xiaoniu", "value": resp.error_msg || resp.tgt_text}
            event.sender.send("ResultsReceive", result)
        })
        .catch(error => {
            console.error(error);
            let result = {name: "Xiaoniu", "value": "网络异常，请重试！"}
            event.sender.send("ResultsReceive", result)

        });

}

async function baidu(event, translate_data) {
    let translate_from = translate_data.fromText === "auto" ? translate_data.fromText : translate_data.from
    let correctionList = {
        "ko": "kor",
        "fr": "fra"
    }
    translate_from =  correctionList[translate_from] || translate_from
    let translate_to = correctionList[translate_data.to] ||translate_data.to
    if (translate_from === translate_to){
        let result = {name: "Baidu", "value": translate_data.text}
        event.sender.send("ResultsReceive", result)
        return
    }
    let textToEncrypt = TOKEN.translator.Baidu.AK + translate_data.text + TOKEN.translator.Baidu.SALT + TOKEN.translator.Baidu.SK;
    const md5Hash = crypto.createHash('md5');
    md5Hash.update(textToEncrypt);
    const sign = md5Hash.digest('hex');
    let options = {
        'method': 'POST',
        'url': 'https://api.fanyi.baidu.com/api/trans/vip/translate',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        "params": {
            "q": translate_data.text,
            "from": translate_from,
            "to": translate_to,
            "appid": TOKEN.translator.Baidu.AK,
            "salt": TOKEN.translator.Baidu.SALT,
            "sign": sign
        },

    };

    axios(options)
        .then(response => {
            console.log('baidu', response.data);
            let data = response.data.trans_result
            if (data) data = data[0]
            let result = {name: "Baidu", "value": data.dst}
            event.sender.send("ResultsReceive", result)
        })
        .catch(error => {
            console.error(error);
            event.sender.send("log", error)
            let result = {name: "Baidu", "value": "网络异常，请重试！"}
            event.sender.send("ResultsReceive", result)

        });

}

async function ali(event, translate_data) {
    let correctionList = {
        "cht": "zh-tw",
        "fr": "fra"
    }
    let translate_from =  correctionList[translate_data.from] || translate_data.from
    let translate_to = correctionList[translate_data.to] ||translate_data.to
    if (translate_from === translate_to){
        let result = {name: "Ali", "value": translate_data.text}
        event.sender.send("ResultsReceive", result)
        return
    }
    var client = new alicloud({
        accessKeyId: TOKEN.translator.Ali.AK,
        accessKeySecret: TOKEN.translator.Ali.SK,
        endpoint: 'https://mt.cn-hangzhou.aliyuncs.com',
        apiVersion: '2018-10-12'
    });
    var params = {
        "FormatType": "text",
        "SourceLanguage": translate_from,
        "TargetLanguage": translate_to,
        "SourceText": translate_data.text,
        "Scene": "general"
    }

    var requestOption = {
        method: 'POST',
        formatParams: false,

    };

    client.request('TranslateGeneral', params, requestOption).then((result) => {
        console.log(result);
        result = {name: "Ali", value: result.Data.Translated}
        event.sender.send("ResultsReceive", result)
    }, (ex) => {
        console.log(ex);
        let result = {name: "Ali", value: "网络异常，请重试！"}
        event.sender.send("ResultsReceive", result)
    })
}

function translator(token, event, data) {
    TOKEN = token
    if (TOKEN.translator.Xiaoniu.OPEN && TOKEN.translator.Xiaoniu.AK) {
        xiaoniu(event, data)
    }
    if (TOKEN.translator.Baidu.OPEN && TOKEN.translator.Baidu.AK && TOKEN.translator.Baidu.SK) {
        baidu(event, data)
    }
    if (TOKEN.translator.Ali.OPEN && TOKEN.translator.Ali.AK && TOKEN.translator.Ali.SK) {
        ali(event, data)
    }
}

module.exports = translator