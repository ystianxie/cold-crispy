<template>
  <!-- 文本输入框 -->
  <div style="margin-top: 5px; background-color: #f6f6f6; border: 1px solid #dadada;  border-radius: 10px;">
    <el-input ref="mainInput" v-model="inputText" placeholder="" resize="none" type="textarea" rows="3"
              @keydown.enter.prevent="build" @input="initParams"/>
    <div>
      <el-button size="small" plain style="padding:0 4px; " @click="readAloud(inputText, 'input')">
        <el-image fit="scale-down" :src="require('@/assets/喇叭.png')"/>
      </el-button>

      <el-button size="small" plain style="padding:0 8px; margin-left: 5px;" @click="copyText(inputText)">
        <el-icon>
          <CopyDocument/>
        </el-icon>
      </el-button>

      <el-dropdown trigger="click" v-if="recognizeLanguage" @command="currentLanguageChange">
        <el-button size="small" round class="display-text">识别为<span style="color: blue;">{{
            recognizeLanguage
          }}</span>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu v-for="(lang, index) in languageOptions" :key="index">
            <el-dropdown-item :command="lang" :title="lang.code">{{
                lang.title === "自动" ? "自动选择" : lang.title
              }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 语言选择框 -->
  <div class="language_frame">
    <el-dropdown @command="currentLanguageChange" trigger="click">
      <div class="display-text" style="width: 75px;">{{ currentLanguage.title }}
        <el-icon>
          <arrow-down/>
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu v-for="(lang, index) in languageOptions" :key="index">
          <el-dropdown-item :command="lang" :title="lang.code">{{
              lang.title === "自动" ? "自动检测" : lang.title
            }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-button size="small" plain style="padding:0 8px; margin-left: 5px;" @click="languageInterchange">
      <el-icon>
        <Switch/>
      </el-icon>
    </el-button>

    <el-dropdown @command="translateLanguageChange" trigger="click">
            <span class="display-text" style="width: 75px;">{{ translateLanguage.title }}
              <el-icon><arrow-down/></el-icon>
            </span>
      <template #dropdown>
        <el-dropdown-menu v-for="(lang, index) in languageOptions" :key="index">
          <el-dropdown-item :command="lang" :title="lang.code">{{
              lang.title === "自动" ? "自动选择" : lang.title
            }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <!-- 翻译结果框 -->
  <div class="result_frame">
    <el-collapse v-model="activeNames">
      <el-collapse-item style="margin-bottom: 10px;"
                        v-for="(translator, key) in Object.values(translators).filter(ele => ele.enable)" :key="key"
                        :name="translator.title" :disabled="!translator.value">
        <template #title>
          <div style="margin-left: 10px;display: flex;">
            <el-image :src="translator.icon" fit="cover"
                      style="width: 20px; height: 20px;"/>
          </div>
          <div class="display-text">{{ translator.title }}</div>
        </template>
        <div style="display: flex; flex-direction: column; ">
          <div class="display-text" style="white-space: pre-line;">
            {{ translator.value }}

          </div>
          <div style="margin: 10px 0 0 10px;">
            <el-button size="small" plain style="padding:0 4px; ">
              <el-image fit="scale-down" :src="require('@/assets/喇叭.png')" @click="readAloud(translator.value, translator
                      .title)"/>
            </el-button>
            <el-button size="small" plain style="padding:0 5px; margin-left: 5px;"
                       @click="copyText(translator.value)">
              <el-icon>
                <CopyDocument/>
              </el-icon>
            </el-button>
            <el-button size="small" plain style="padding:0 8px; margin-left: 5px;"
                       @click="copyText(translator.value, '_')">_
              <el-icon>
                <CopyDocument/>
              </el-icon>
            </el-button>
            <el-button size="small" plain style="padding:0 8px; margin-left: 5px;"
                       @click="copyText(translator.value, 'aA')">aA
              <el-icon>
                <CopyDocument/>
              </el-icon>
            </el-button>
            <el-button size="small" plain style="padding:0 8px; margin-left: 5px;"
                       @click="copyText(translator.value, 'Aa')">Aa
              <el-icon>
                <CopyDocument/>
              </el-icon>
            </el-button>
          </div>

        </div>


      </el-collapse-item>
    </el-collapse>
  </div>
  <div class="slogan">寒酥压疏影，扶摇载纤凝。</div>

</template>

<script>
import {franc} from 'franc-min';
import lodash from 'lodash';
import camelCase from 'camelcase';


export default {
  data() {
    return {
      activeNames: ['提示'],
      inputText: "",
      recognizeLanguage: "",
      translateResults: [],
      audios: {},
      translators: {
        Prompt: {
          title: "提示",
          value: "OCR:option+G",
          icon: require("@/assets/提示.png"),
          enable: true
        },
        Baidu: {
          title: "百度翻译",
          value: "",
          icon: require("@/assets/百度.png"),
          enable: false
        },
        Xiaoniu: {
          title: "小牛翻译",
          value: "",
          icon: require("@/assets/小牛.png"),
          enable: false

        },
        Ali: {
          title: "阿里翻译",
          value: "",
          icon: require("@/assets/阿里.png"),
          enable: false
        }
      },
      currentLanguageBrief: "",
      currentLanguage: {title: "自动检测", code: "auto"},
      translateLanguageBrief: "",
      translateLanguage: {title: "自动选择", code: "auto"},
      languageOptions: {
        auto: {code: "auto", title: "自动"},
        cmn: {code: "zh", title: "中文简体", audioCode: 'zh'},
        cht: {code: "cht", title: "中文繁体", audioCode: 'zh'},
        eng: {code: "en", title: "英语", audioCode: 'en'},
        jpn: {code: "ja", title: "日语", audioCode: 'jp'},
        kor: {code: "ko", title: "韩语", audioCode: 'kor'},
        rus: {code: "ru", title: "俄语", audioCode: 'ru'},
        tha: {code: "th", title: "泰语", audioCode: 'th'}
      }
    }
  },
  methods: {
    build: lodash.debounce(function () {
      // 开始翻译
      this.$router.replace("/")
      this.activeNames = []
      this.translateLanguageBrief = ""
      this.translators.Prompt.enable = false
      if (!this.inputText) return
      let translatorData = {
        fromText: this.currentLanguage.code,
        from: this.currentLanguage.code,
        to: this.translateLanguage.code,
        text: this.inputText
      }

      if (translatorData.from === "auto") {
        if (countChineseCharacters(this.inputText) >= this.inputText.length * 0.7) {
          translatorData.from = "cmn"
        } else if (countChineseCharacters(this.inputText) >= countWords(this.inputText) * 2) {
          translatorData.from = "cmn"
        } else {
          let langCode = franc(this.inputText, {minLength: 2, only: Object.keys(this.languageOptions)})
          console.log('识别语言：', langCode);
          if (langCode === "und") langCode = "eng"
          translatorData.from = langCode
        }
        this.recognizeLanguage = this.languageOptions[translatorData.from].title
        this.currentLanguageBrief = this.languageOptions[translatorData.from].audioCode
        translatorData.from = this.languageOptions[translatorData.from].code
      } else {
        this.recognizeLanguage = ""
      }
      if (translatorData.to === "auto") {
        if (["zh", "cht"].indexOf(translatorData.from) === -1) {
          translatorData.to = "cmn"
        } else {
          translatorData.to = "eng"
        }
        console.log(translatorData.from, translatorData.to);
        this.translateLanguageBrief = this.languageOptions[translatorData.to].audioCode
        translatorData.to = this.languageOptions[translatorData.to].code

      }
      this.translateLanguageBrief = this.translateLanguageBrief ? this.translateLanguageBrief : this.translateLanguage.audioCode
      console.log("检测语言：", this.currentLanguageBrief, this.translateLanguageBrief);

      window.ipcRenderer.send("translator", translatorData)

    }, 1000, {'leading': true, 'trailing': false}),
    readAloud: lodash.debounce(function (text, source) {
      // 开始朗读
      if (!text) return
      let text_language = this.currentLanguageBrief
      if (source === "input") {
        if (!text_language) {
          if (countChineseCharacters(text) >= text.length * 0.7) {
            text_language = "zh"
          } else {
            let langCode = franc(text, {minLength: 1, only: Object.keys(this.languageOptions)})
            console.log("识别语言", text, langCode);
            if (langCode === "und") langCode = "eng"
            text_language = this.languageOptions[langCode].audioCode
          }
        }
      } else {
        text_language = this.translateLanguageBrief
      }

      window.ipcRenderer.send("readAloud", {
        source: source,
        text: text,
        lang: text_language
      })
      window.ipcRenderer.once("AudioReceive", (e, data) => {
        const audio_buffer = base64ToBuffer(data.value)
        this.playAudioFromBuffer(audio_buffer); // 调用播放函数

      })
    }, 1000, {'leading': true, 'trailing': false}),
    initParams() {
      // 每次键入值时重置语言记录
      this.currentLanguageBrief = ""
    },
    currentLanguageChange(language) {
      // 当前语言设置
      let language_ = {code: language.code, title: language.title === "自动" ? "自动检测" : language.title}
      console.log("输入语言更改为:" + language_.title);
      this.currentLanguage = language_
      this.activeNames = []
      this.build()
    },
    translateLanguageChange(language) {
      // 翻译语言设置
      let language_ = {code: language.code, title: language.title === "自动" ? "自动选择" : language.title}
      console.log("输出语言更改为:" + language_.title);
      this.translateLanguage = language_
      this.activeNames = []
      this.build()
    },
    languageInterchange() {
      // 语言互换功能
      let language = this.translateLanguage
      if (language.code === "auto") language.title = "自动检测"
      this.translateLanguage = this.currentLanguage
      if (this.translateLanguage.code === "auto") this.translateLanguage.title = "自动选择"
      this.currentLanguage = language
    },
    async copyText(textToCopy, format) {
      // 拷贝结果
      if (!textToCopy) return
      if (format === '_') {
        textToCopy = textToCopy.replace(/\s/g, "_")
      } else if (format === "aA") {
        textToCopy = camelCase(textToCopy)
      } else if (format === "Aa") {
        textToCopy = camelCase(textToCopy, {pascalCase: true})
      }

      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      console.log('已成功复制到剪贴板');
    },
    playAudioFromBuffer(buffer) {
      // 播放音频
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.decodeAudioData(buffer, decodedData => {
        const source = audioContext.createBufferSource();
        source.buffer = decodedData;
        source.connect(audioContext.destination);
        source.start(0);
      });
    },
  },
  created() {
    if (window.ipcRenderer) {
      window.ipcRenderer.on('InputReceive', (event, data) => {
        console.log(data);
        this.$refs.mainInput.focus()
        if (data.success) {
          this.inputText = data.value
          this.currentLanguage = {title: "自动检测", code: "auto"}
          this.translateLanguage = {title: "自动选择", code: "auto"}
          this.build()
        }
      })
      window.ipcRenderer.on("ResultsReceive", (event, data) => {
        console.log(data);
        this.translators.Prompt.enable = false
        this.activeNames.push(this.translators[data.name].title)
        if (data.text) {
          this.inputText = data.text
        }
        this.translators[data.name].value = data.value
        setTimeout(checkScrollbar, 300)
      })
      window.ipcRenderer.send("GetSettingShortcutKeys", "")
      window.ipcRenderer.once("extractSettingShortcutKeys", (e, setting_info) => {
        let val = "呼出：" + setting_info.awaken
        val += "\n划词：" + setting_info.selection
        val += "\n识别：" + setting_info.ocr
        val += "\n操作慢点嘛！"
        this.translators.Prompt.value = val
        this.activeNames = ["提示"]
      })
      window.ipcRenderer.send("GetTranslatorEnabled", "")
      window.ipcRenderer.once("extractTranslatorEnabled", (e, enabled_translator) => {
        for (let key of enabled_translator) {
          console.log("开启平台：", key)
          this.translators[key].enable = true
        }
      })
    }
    setInterval(() => {
      this.$refs.mainInput.focus()
    }, 5000)
  }


}

if (window.require && !window.ipcRenderer) {
  window.ipcRenderer = window.require('electron').ipcRenderer
}


function countChineseCharacters(text) {
  var reg = /[\u4e00-\u9fa5]/g; // 匹配中文字符的正则表达式
  var matches = text.match(reg); // 获取所有匹配项

  return matches ? matches.length : 0
}

function countWords(str) {
  // 使用正则表达式匹配有效的单词
  var words = str.match(/\b\w+\b/g);

  // 返回单词数量
  return words ? words.length : 0;
}

function base64ToBuffer(base64) {
  const binaryString = window.atob(base64);
  const length = binaryString.length;
  const buffer = new ArrayBuffer(length);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }

  return buffer;
}

function checkScrollbar() {
  const body = document.getElementById("app");
  console.log(body.clientHeight);
  window.ipcRenderer.send("adjust-window-size", body.clientHeight + 30)
}


</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  /* background-color: var(--el-color-primary-light-7); */
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}

.language_frame {
  margin: 20px 0px 20px 0px;
  padding: 5px 0 5px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #f6f6f6;
  border-radius: 5px;
  border: 1px solid #dadada;
}

::v-deep .el-textarea__inner {
  background-color: #f6f6f6;
}

.display-text {
  color: #292929;
  margin-left: 10px;
}


.result_frame_items {
  /* background-color: #f6f6f6; */
  margin-bottom: 10px;
}

::v-deep .el-collapse-item__wrap {
  /* background-color: #f5f5f5; */
  background-color: #f6f6f6;
}

::v-deep .el-collapse-item__header {
  /* background-color: #efefef; */
  background-color: #f1f1f1;
}

::v-deep .el-collapse-item {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #dadada;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 10px;
}

/* ::v-deep .el-input__inner {
  border: none;
  box-shadow: none;
} */

.slogan {
  position: fixed;
  bottom: 0;
  right: 0;
  width: auto;
  height: auto;
  font-size: 1em;
  padding-right: 0;
  color: #b7b6b6;
}
</style>
