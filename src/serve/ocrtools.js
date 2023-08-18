const axios = require('axios');
var TOKEN

function getAccessTokenBaiduOCR() {

    let options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + TOKEN.OCR.Baidu.AK + '&client_secret=' + TOKEN.OCR.Baidu.SK,
    }
    return new Promise((resolve, reject) => {
        axios(options)
            .then((response) => {
                resolve(response.data.access_token);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

async function OCRBaidu(image) {
    if (!TOKEN.OCR.Baidu.TOKEN) {
        console.log("new Token")
        TOKEN.OCR.Baidu.TOKEN = await getAccessTokenBaiduOCR();
    }

    var options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token=' + TOKEN.OCR.Baidu.TOKEN,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        data: {image}

    };

    return new Promise((resolve, reject) => {
        axios(options)
            .then((response) => {
                console.log('words', response.data);
                resolve(response.data.words_result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const OCRLocal = imageBase64 => {
    return new Promise(resolve => {
        fetch(TOKEN.OCR.Local.URI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageBase64
            })
        })
            .then(response => response.json())
            .then(data => {
                resolve(data.data.res)
            })
            .catch(err => {
                resolve(err)
            })
    })


}

async function OCR(token, imageBase64) {
    TOKEN = token
    if (TOKEN.OCR.Local.OPEN && TOKEN.OCR.Local.URI) {
        try {
            let result = await OCRLocal(imageBase64)
            console.log('ocrResult', result.join(","))
            return {success: true, value: result.join(",")}
        } catch (e) {
            return {success: false, value: "服务异常请检查！"}
        }

    } else if (TOKEN.OCR.Baidu.OPEN && TOKEN.OCR.Baidu.AK && TOKEN.OCR.Baidu.SK) {
        try {
            imageBase64 = 'data:image/png;base64,' + imageBase64;
            let result = await OCRBaidu(imageBase64)
            result = result.map(ele => ele.words).join(',')
            console.log('ocrResult', result)
            return {success: true, value: result, token: TOKEN.OCR.Baidu.TOKEN}
        } catch (e) {
            return {success: false, value: "服务异常请检查Key！"}

        }

    }
    return "请配置服务！"

}


module.exports = OCR;
