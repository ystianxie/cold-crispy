<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane v-for="(platform,key) in platforms" :key="key">
      <template #label>
        <el-image :src="platform.icon" fit="cover"
                  style="width: 20px; height: 20px;"/>
        <div>{{ platform.label }}</div>
      </template>
      <div class="tab-content">
        <div class="token-row" v-for="(value,token) in platform.token" :key="token">
          <div class="token-label-row">
            <el-text>{{ token === "AK" ? "App Key" : token === "URI" ? token : "Secret Key" }}:</el-text>
          </div>
          <el-input
              v-model="platform.token[token]"
              type="password"
              placeholder=""
              show-password
          />
        </div>
        <div class="save-row">
          <el-tag
              effect="dark"
              round
          >
            {{ platform.tag }}
          </el-tag>
          <el-switch v-model="platform.open"/>
          <el-button type="success" round @click="saveSetting(key)">保存</el-button>
        </div>
      </div>
    </el-tab-pane>

  </el-tabs>

</template>
<script >
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      platforms: {
        Local: {
          label: "本地服务",
          token: {URI: ""},
          open: false,
          tag: "自建",
          icon: require("@/assets/OCR.png")
        },
        Baidu: {
          label: "百度智能云",
          token: {AK: "",SK:""},
          open: false,
          tag: "秘钥",
          icon: require("@/assets/百度.png")
        },

      }
    }
  },
  methods: {
    saveSetting(platform) {
      let platform_data = this.platforms[platform]
      let data = {platform, token: {...platform_data.token}, open: platform_data.open}
      console.log(data)
      window.ipcRenderer.send("settingOCR", data)
      this.$router.replace('/');
      ElMessage({
        message: '保存成功!',
        type: 'success',
      })
    }
  },
  created() {
    window.ipcRenderer.send("GetSettingOCR", "")
    window.ipcRenderer.once("extractSettingOCR", (e, data) => {
      for (let platform in this.platforms) {
        for (let key in this.platforms[platform].token) {
          this.platforms[platform].token[key] = data[platform][key]
        }
        this.platforms[platform].open = data[platform].OPEN
      }
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