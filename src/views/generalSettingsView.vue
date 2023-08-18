<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane>
      <template #label>
        <el-image :src="require('@/assets/键盘.png')" fit="cover"
                  style="width: 20px; height: 20px;"/>
        <div>快捷键</div>
      </template>
      <div class="tab-content">
        <div class="token-row" v-for="(data,key) in appShortcutKeys" :key="key">
          <div class="token-label-row">
            <el-text>{{ data.title }}:</el-text>
          </div>
          <el-input v-model="data.keyCode" :placeholder="data.title" @keydown="handleShortcut($event,data)"
                    @input="showKeyInput($event,data)" @blur="confirmShowKey($event,data)">
          </el-input>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane>
      <template #label>
        <el-image :src="require('@/assets/其它通用.png')" fit="cover"
                  style="width: 20px; height: 20px;"/>
        <div>其他</div>
      </template>
      <div>在写了！在写了！</div>

    </el-tab-pane>
  </el-tabs>


</template>
<script>
export default {
  data() {
    return {
      appShortcutKeys: {
        awaken: {name: "awaken", title: "唤醒", keyCode: "", oldKeyCode: "", legal: false},
        selection: {name: "selection", title: "划词", keyCode: "", oldKeyCode: "", legal: false},
        ocr: {name: "ocr", title: "OCR", keyCode: "", oldKeyCode: "", legal: false}
      },
      shortcutKeys: [],
      systemType: "Mac"
    }

  },
  methods: {
    handleShortcut(event, ability) {
      console.log(event);
      console.log(ability)
      if (ability.legal) {
        ability.oldKeyCode = ability.keyCode;
      }
      ability.keyCode = null
      this.shortcutKeys = []
      ability.legal = false
      let macCommandError = false
      let shortcutKeysLegalTemp = false
      event.preventDefault();
      if (navigator.platform.indexOf('Win') === 0) {
        if (event.shiftKey) {
          this.shortcutKeys.push("Shift")
        }
        if (event.ctrlKey) {
          this.shortcutKeys.push("Ctrl")
        }
        if (event.altKey) {
          this.shortcutKeys.push("Alt")
        }
      } else {
        if (event.shiftKey) {
          this.shortcutKeys.push("⇧")
        }
        if (event.ctrlKey) {
          this.shortcutKeys.push("⌃")
        }
        if (event.altKey) {
          this.shortcutKeys.push("⌥")
        }
        if (event.metaKey) {
          this.shortcutKeys.push("⌘")
          if (event.keyCode === 91 || event.keyCode === 93) {
            macCommandError = true
          }
        }
      }
      if (this.shortcutKeys.length >= 1) shortcutKeysLegalTemp = true
      if (event.keyCode && !macCommandError && event.keyCode >= 32 && event.keyCode <= 126) {
        let keyCode = String.fromCharCode(event.keyCode)
        this.shortcutKeys.push(keyCode)
        if (shortcutKeysLegalTemp) ability.legal = true
      }
      ability.keyCode = this.shortcutKeys.join("+")
      console.log(ability.keyCode);
    },
    showKeyInput(value, ability) {
      if (!this.shortcutKeys.includes(value)) {
        ability.keyCode = "";
      }
    },
    confirmShowKey(event, ability) {
      if (ability.keyCode === ability.oldKeyCode) {
        return
      }
      if (!ability.legal) {
        ability.keyCode = ability.oldKeyCode
        return
      }
      window.ipcRenderer.send("settingShortcutKeys", {...ability})
    },
  },
  created() {
    if (navigator.platform.indexOf('Win') === 0) {
      this.systemType = "Win"
    } else {
      this.systemType = "Mac"
    }
    window.ipcRenderer.send("GetSettingShortcutKeys", "")
    window.ipcRenderer.once("extractSettingShortcutKeys", (e, setting_info) => {
      console.log(setting_info)
      this.appShortcutKeys.awaken.keyCode = setting_info.awaken
      this.appShortcutKeys.awaken.oldKeyCode = setting_info.awaken
      this.appShortcutKeys.selection.keyCode = setting_info.selection
      this.appShortcutKeys.selection.oldKeyCode = setting_info.selection
      this.appShortcutKeys.ocr.keyCode = setting_info.ocr
      this.appShortcutKeys.ocr.oldKeyCode = setting_info.ocr
    })
  }
}
</script>
<style scoped>


.token-row {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 10px;
}

.token-label-row {
  display: flex;
  white-space: nowrap;
  width: 120px;
}

.save-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.save-row div {
  margin-left: 10px;
  margin-right: 10px;

}

</style>