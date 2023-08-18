const {app, Menu, Tray, globalShortcut, BrowserWindow} = require('electron')
const {ipcMain, clipboard} = require('electron')
const {execFile, exec, execSync} = require('child_process')
const settings = require('electron-settings');
const axios = require('axios');
const path = require('path');
const OCR = require(path.join(__dirname, "./src/serve/ocrtools"))
const translator = require(path.join(__dirname, "./src/serve/translator"))

// const VueJS = path.join(
//     os.homedir(),
//     '/Library/Application Support/Microsoft Edge/Default/Extensions/olofadcdnkkjdfgjcmjaadnlehnnihnl/6.5.0_0'
// )
//

const indexPath = path.join(__dirname, '/dist/index.html')

app.commandLine.appendSwitch('wm-window-animations-disabled')

var translator_baidu = settings.getSync("translator_Baidu") || {}
var translator_xiaoniu = settings.getSync("translator_Xiaoniu") || {}
var translator_ali = settings.getSync("translator_Ali") || {}
var ocr_baidu = settings.getSync("ocr_Baidu") || {}
var ocr_local = settings.getSync("ocr_Local") || {}
var TOKEN = {
    OCR: {
        Baidu: {
            AK: ocr_baidu.AK || "",
            SK: ocr_baidu.SK || "",
            TOKEN: ocr_baidu.TOKEN || "",
            OPEN: ocr_baidu.OPEN || false,
        },
        Local: {
            URI: ocr_local.URI || "",
            OPEN: ocr_local.OPEN || false,
        }
    },
    translator: {
        Xiaoniu: {
            AK: translator_xiaoniu.AK || "",
            OPEN: translator_xiaoniu.OPEN || false,
        },
        Baidu: {
            AK: translator_baidu.AK || "",
            SK: translator_baidu.SK || "",
            SALT: "cold-crispy",
            OPEN: translator_baidu.OPEN || false,
        },
        Ali: {
            AK: translator_ali.AK || "",
            SK: translator_ali.SK || "",
            OPEN: translator_ali.OPEN || false,
        }
    }
}

var mainWindow
var windowTop = false

var ShortcutKeys = {
    awaken: settings.getSync("key_awaken") || "",
    ocr: settings.getSync("key_ocr") || "",
    selection: settings.getSync("key_selection") || ""
}
if (process.platform === "darwin") {
    ShortcutKeys.awaken = ShortcutKeys.awaken ? ShortcutKeys.awaken : "⌥+F"
    ShortcutKeys.ocr = ShortcutKeys.ocr ? ShortcutKeys.ocr : "⌥+G"
    ShortcutKeys.selection = ShortcutKeys.selection ? ShortcutKeys.selection : "⌥+H"
} else {
    ShortcutKeys.awaken = ShortcutKeys.awaken ? ShortcutKeys.awaken : "Alt+F"
    ShortcutKeys.ocr = ShortcutKeys.ocr ? ShortcutKeys.ocr : "Alt+S"
    ShortcutKeys.selection = ShortcutKeys.selection ? ShortcutKeys.selection : "Ctrl+Alt+D"
}


function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 640,
        show: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false,
            // preload: path.join(__dirname, '/dist/preload.js')
        }
    })
    // mainWindow.loadURL('http://localhost:8081/')
    // mainWindow.loadURL(`data:text/html,<video src="${stream.toDataURL()}" autoplay></video>`);

    mainWindow.loadURL(`file://${indexPath}`)

    mainWindow.on('blur', windowHide)


    mainWindow.on('closed', function () {
        mainWindow = null
    })
    mainWindow.webContents.on('before-input-event', (event, input) => {
        // if (input.type === "keyDown" && input.key === "F12") {
        //     if (mainWindow.webContents.isDevToolsOpened()) {
        //         mainWindow.webContents.closeDevTools();
        //     } else {
        //         mainWindow.webContents.openDevTools();
        //     }
        // }
        if (input.type === "keyDown" && input.key == "Escape") {
            mainWindow.hide()
        }
    })


}

var tray = null
app.on('ready', () => {
    // 创建一个 Tray 对象，并设置图标路径
    tray = new Tray(path.join(__dirname, '/src/assets/雪花-16.png'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示', type: 'normal', click: awakenWindow
        },
        {type: 'separator'},
        {label: '退出', role: 'quit'}
    ])
    tray.setContextMenu(contextMenu)
    tray.setToolTip('翻译坤')
    tray.on("double-click", awakenWindow)

})


app.whenReady().then(async () => {
    // 加载vue.js
    // await session.defaultSession.loadExtension(VueJS)
    // 创建主窗体
    createWindow()

    globalShortcut.register(shortcutKeysFormat(ShortcutKeys.ocr), getScreenShots);
    globalShortcut.register(shortcutKeysFormat(ShortcutKeys.selection), selectionWords);
    globalShortcut.register(shortcutKeysFormat(ShortcutKeys.awaken), awakenWindow)


})


app.on('will-quit', () => {
    // app退出时注销所有快捷键
    globalShortcut.unregisterAll()
})


app.whenReady().then(() => {
    // 设置mac系统dock栏图标
    if (process.platform === 'darwin') {
        const dockIconPath = path.join(__dirname, 'src/assets', '雪花-128.png');
        app.dock.setIcon(dockIconPath);
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

// 检查应用是否已经在运行
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    // 如果已经有一个实例在运行，则退出应用
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
    }
    app.quit()
}

function shortcutKeysFormat(key) {
    console.log("格式化快捷键：", key);
    key = key.replace("⇧", "Shift")
    key = key.replace("⌃", "Control")
    key = key.replace("⌥", "Option")
    key = key.replace("⌘", "Command")
    return key
}


// 截图方法windows
const screenWindow = () => {
    // eslint-disable-next-line no-undef
    clipboard.clear()
    let url = path.join(__dirname, '../tools/PrintScr.exe')
    mainWindow.webContents.send('log', url)
    const screen_window = execFile(url)
    screen_window.on('exit', async (code) => {
        if (code) {
            const pngs = clipboard.readImage().toPNG()
            const imgs_base64 = pngs.toString('base64')
            if (imgs_base64) {
                let ocrResult = await OCR(TOKEN, imgs_base64)
                console.log('oc', ocrResult);
                if (ocrResult.token && ocrResult.token !== TOKEN.OCR.Baidu.TOKEN) {
                    TOKEN.OCR.Baidu.TOKEN = ocrResult.token;
                    await settings.set("ocr_Baidu", TOKEN.OCR.Baidu)
                }
                delete ocrResult.token
                mainWindow.webContents.send('InputReceive', ocrResult)
                mainWindow.setAlwaysOnTop(true);
                mainWindow.show()
                mainWindow.focus()
                mainWindow.setAlwaysOnTop(false);

            }
        }
    })
}

// 截图方法mac
const handleScreenShots = () => {
    clipboard.clear()
    exec('screencapture -i -c', async (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        const pngs = clipboard.readImage().toPNG()
        const imgs_base64 = pngs.toString('base64')
        if (imgs_base64) {
            let ocrResult = await OCR(TOKEN, imgs_base64)
            console.log('oc', ocrResult);
            if (ocrResult.token && ocrResult.token !== TOKEN.OCR.Baidu.TOKEN) {
                TOKEN.OCR.Baidu.TOKEN = ocrResult.token;
                await settings.set("ocr_Baidu", TOKEN.OCR.Baidu)
            }
            delete ocrResult.token
            mainWindow.webContents.send('InputReceive', ocrResult)
            mainWindow.show()
        }

    })

}

function getScreenShots() {
    if (process.platform === 'darwin') {
        handleScreenShots()
    } else {
        screenWindow()
    }
}

// 划词方法windows
const selectionWords = () => {
    clipboard.clear()
    // 外层确认按键已经松开
    setTimeout(() => {
        let url = path.join(__dirname, '../tools/nircmd.exe')
        let command_line = '"' + url + '" sendkeypress ctrl+c'
        execSync(command_line)
        // 内层确认复制已经完成
        setTimeout(() => {
            const newClipboard = clipboard.readText();
            mainWindow.webContents.send('InputReceive', {success: true, value: newClipboard})
            mainWindow.setAlwaysOnTop(true);
            mainWindow.show()
            mainWindow.focus()
            mainWindow.setAlwaysOnTop(false);
        }, 0)

    }, 500)


}

ipcMain.on("translator", (e, data) => {
    console.log(data);
    translator(TOKEN, e, data)

})

ipcMain.on("readAloud", (e, data) => {
    console.log(data);
    axios.get("https://fanyi.baidu.com/gettts", {
        "params": {
            "lan": data.lang,
            "text": data.text,
            "spd": data.lang === "zh" ? "5" : "3",
            "source": "web"
        },
        "headers": {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Dnt": "1",
            "Pragma": "no-cache",
            "Range": "bytes=0-",
            "Referer": "https://fanyi.baidu.com/",
            "Sec-Fetch-Dest": "audio",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36/9uiP7EnX-09",
        },
        responseType: 'arraybuffer'
    }).then(response => {

        const base64String = response.data.toString('base64');
        const result = {source: data.source, value: base64String}
        e.reply("AudioReceive", result)
    })
        .catch(error => {
            console.error(error);
        });
})


ipcMain.on("windowTop", (event, top) => {
    console.log("窗口置顶：", top);
    windowTop = top
    if (windowTop) {
        mainWindow.removeListener("blur", windowHide)
    } else {
        mainWindow.on("blur", windowHide)
    }
    mainWindow.setAlwaysOnTop(top);

})
ipcMain.on("getWindowTop", (event) => {
    event.reply("windowTop", windowTop)

})

let dragStartBounds; // 记录拖动开始时窗口的位置和大小


ipcMain.on('drag-start', (event) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    dragStartBounds = currentWindow.getBounds();
});

ipcMain.on('dragging', (event, {deltaX, deltaY}) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    const {x, y} = dragStartBounds;
    currentWindow.setPosition(x + deltaX, y + deltaY);
});

ipcMain.on('drag-end', () => {
    dragStartBounds = null;
});

ipcMain.on('adjust-window-size', (event, needHeight) => {
    // 调整窗口大小逻辑
    const currentWindow = BrowserWindow.getFocusedWindow();
    if (currentWindow) {
        const [width, height] = currentWindow.getContentSize();
        if (height > needHeight) return
        currentWindow.setContentSize(width, needHeight);
    }
});


function windowHide() {
    mainWindow.webContents.send('hide', true)
    mainWindow.hide()
}

function awakenWindow() {
    if (mainWindow === null) createWindow()
    mainWindow.show()
    mainWindow.webContents.send("InputReceive", {success: false})
}

ipcMain.on("settingShortcutKeys", async (event, data) => {
    //  修改快捷键设置
    if (ShortcutKeys[data.name] === data.keyCode) {
        return
    }
    await settings.set('key_' + data.name, data.keyCode);
    globalShortcut.unregister(shortcutKeysFormat(ShortcutKeys[data.name]))
    if (data.name === "awaken") {
        globalShortcut.register(shortcutKeysFormat(data.keyCode), awakenWindow)
    } else if (data.name === "ocr") {
        globalShortcut.register(shortcutKeysFormat(ShortcutKeys.ocr), getScreenShots);
    } else if (data.name === "selection") {
        globalShortcut.register(shortcutKeysFormat(ShortcutKeys.selection), selectionWords);
    }
    ShortcutKeys[data.name] = data.keyCode
})
ipcMain.on("GetSettingShortcutKeys", (event, data) => {
    //  获取快捷键设置
    event.reply("extractSettingShortcutKeys", ShortcutKeys)
})
ipcMain.on("settingTranslator", async (event, data) => {
    // 修改翻译token设置
    Object.assign(TOKEN.translator[data.platform], data.token)
    TOKEN.translator[data.platform].OPEN = data.open
    if (data.platform === "Baidu") {
        TOKEN.translator[data.platform] = "cold-crispy"
    }
    await settings.set("translator_" + data.platform, TOKEN.translator[data.platform])
    console.log("更新了翻译平台api:", data)
})
ipcMain.on("GetSettingTranslator", (event, data) => {
    // 获取翻译token设置
    let value = {...TOKEN.translator}
    value.Baidu.SALT = ""
    console.log("返回值", value)
    event.reply("extractSettingTranslator", value)
})
ipcMain.on("GetTranslatorEnabled", (event, data) => {
    // 获取翻译token设置
    let translatorEnabled = [];
    for (const key in TOKEN.translator) {
        if (TOKEN.translator[key].OPEN === true) {
            translatorEnabled.push(key);
        }
    }

    event.reply("extractTranslatorEnabled", translatorEnabled)
})

ipcMain.on("settingOCR", async (event, data) => {
    // 修改OCR设置
    Object.assign(TOKEN.OCR[data.platform], data.token)
    TOKEN.OCR[data.platform].OPEN = data.open
    await settings.set("ocr_" + data.platform, TOKEN.OCR[data.platform])
    console.log("更新了OCR平台api:", data)

})
ipcMain.on("GetSettingOCR", (event, data) => {
    //  获取OCR设置
    let value = {...TOKEN.OCR}
    value.Baidu.TOKEN = ""
    console.log("返回值", value)
    event.reply("extractSettingOCR", value)
})