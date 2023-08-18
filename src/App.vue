<template>
  <el-container ref="container" class="layout-container-demo" style="height: auto;">
    <el-container>
      <el-header style="font-size: 12px; height: 25px;padding-left:0; padding-right: 0;margin-bottom: 10px;">
        <div style="display: flex; flex-direction: row; justify-content: space-between;">
          <div>
            <el-button style="padding: 5px 9px 5px 9px; border: 0;" @click="fixedChange">
              <svg v-if="!fixedStatus" t="1688104414324" class="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="5030" width="16" height="16">
                <path
                    d="M393.846154 64.174932l117.454119 0.399843H512.499805l117.454119-0.399843-10.395939 10.395939c-18.89262 18.89262-28.488872 44.982429-26.28973 71.472081l20.292073 250.502148c2.998829 36.68567 18.092932 72.171808 42.483405 99.661069l34.186646 38.684889-122.252245-0.899648-55.478329-0.399844h-0.99961l-55.478329 0.399844-122.452167 0.799687 34.186646-38.684888c24.390472-27.589223 39.484576-62.9754 42.483405-99.66107l20.292074-250.402187c2.199141-26.589613-7.397111-52.679422-26.289731-71.472081l-10.395939-10.395939m281.889887-64.174932h-0.199922L512.399844 0.599766h-0.799688L348.36392 0h-0.199922c-20.891839 0-39.684498 13.494729-45.582194 33.58688-4.098399 13.994533-1.899258 30.887934 17.79305 47.581414l38.584927 38.584927c5.597813 5.597813 8.39672 13.294807 7.796955 21.091761L346.464662 391.247169c-1.899258 23.190941-11.195627 45.08239-26.589613 62.475596l-61.87583 69.872706c-8.696603 9.796173-13.894572 22.291292-14.394377 35.386177-0.299883 8.996486 1.599375 18.89262 8.596642 27.28934 6.897306 8.296759 17.293245 12.894963 27.989067 12.894963h0.299882l175.931277-1.199532 55.178446 422.834831 0.399844 3.098789 0.399844-3.098789 55.178446-422.834831 175.931277 1.199532h0.299882c10.795783 0 21.191722-4.598204 27.989067-12.894963 6.897306-8.39672 8.796564-18.292854 8.596642-27.28934-0.399844-13.094885-5.697774-25.590004-14.394377-35.386177l-61.87583-69.872706c-15.393987-17.393206-24.690355-39.284654-26.589613-62.475596l-20.292074-250.402187c-0.599766-7.796954 2.199141-15.593909 7.796955-21.091761l38.584927-38.584927c19.692308-16.693479 21.891449-33.58688 17.79305-47.581414-5.997657-19.992191-24.790316-33.58688-45.682155-33.58688z"
                    p-id="5031"></path>
              </svg>

              <svg v-if="fixedStatus" t="1688105979246" class="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="5694" width="16" height="16">
                <path
                    d="M702.725498 84.067161L822.778602 204.919953l0.099961 0.099961 0.099961 0.099961 0.699727 0.699727 0.099961 0.099961 0.099961 0.099961L944.531043 325.872706h-47.581414c-28.188989 0-54.878563 12.295197-73.071456 33.786802L629.55408 588.170246c-26.789535 31.4877-42.883249 71.472081-45.382272 112.755955l-5.397892 89.265131-340.367044-340.467006 89.265131-5.397891c41.183913-2.499024 81.268255-18.592737 112.755955-45.382273l228.510738-194.324092c21.491605-18.292854 33.786802-44.882468 33.786802-73.071456V84.067161zM690.33034 4.598204c-8.996486 0-18.092932 2.199141-26.389692 6.697384-15.294026 8.39672-27.689184 24.490433-25.19016 55.178446v65.07458c0 9.39633-4.098399 18.292854-11.295588 24.390472L398.944162 350.263178c-21.091761 17.992971-47.481453 28.588832-75.170636 30.288169l-111.25654 6.697384c-15.593909 0.899649-30.588052 6.997267-41.983601 17.693089-7.796954 7.397111-14.594299 17.293245-15.79383 30.288168-1.199531 12.795002 3.698555 25.390082 12.795002 34.486529l0.199922 0.199922 149.541585 147.542366L6.897306 1021.001171l-2.299102 2.998829 2.998828-2.299102 403.542367-310.378758 147.542366 149.541585 0.199922 0.199922c8.196798 8.196798 19.192503 12.994924 30.688012 12.994924 1.299492 0 2.598985-0.099961 3.798517-0.199922 12.894963-1.199531 22.891058-7.996876 30.288168-15.793831 10.695822-11.395549 16.79344-26.389692 17.693089-41.9836l6.697384-111.25654c1.699336-27.689184 12.295197-54.078875 30.288168-75.170637L872.659118 401.143303c6.097618-7.197189 14.994143-11.295588 24.390472-11.295587h65.07458c2.698946 0.199922 5.29793 0.299883 7.796955 0.299883 25.689965 0 39.784459-11.49551 47.381491-25.490043 11.995314-21.891449 7.497071-49.180789-10.096056-66.773917l-0.099961-0.099961-138.245998-137.346349-0.699726-0.699727L730.814526 21.591566l-0.099961-0.099961c-10.995705-10.995705-25.590004-16.893401-40.384225-16.893401z"
                    p-id="5695" fill="#127ed7"></path>
              </svg>
            </el-button>
          </div>
          <div id="drag-region" style="flex-grow:1"></div>
          <div class="toolbar">
            <el-dropdown trigger="click">
              <el-button style="padding: 5px 9px 5px 9px; border: 0;">
                <el-icon>
                  <setting/>
                </el-icon>
              </el-button>


              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item style="padding-right: 0">
                    <router-link style="padding-right: 16px" to="/" class="custom-link">首页</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item style="padding-right: 0">
                    <router-link style="padding-right: 16px" to="/translatorSettings" class="custom-link">翻译
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item style="padding-right: 0">
                    <router-link style="padding-right: 16px" to="/OCRSettings" class="custom-link">OCR</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item style="padding-right: 0">
                    <router-link style="padding-right: 16px" to="/generalSettings" class="custom-link">通用
                    </router-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

        </div>

      </el-header>


      <el-main>

        <router-view>
        </router-view>

      </el-main>

    </el-container>
  </el-container>

</template>



<script >
let isDragging = false;
let mousePosition = {x: 0, y: 0};
export default {
  data() {
    return {
      logs: [],
      fixedStatus: false,
    }
  },
  methods: {
    fixedChange() {
      // 设置窗口置顶
      this.fixedStatus = !this.fixedStatus
      window.ipcRenderer.send("windowTop", this.fixedStatus)
    },
    checkScrollbar() {
      // 检测是否出现滚动条
      const container = this.$refs.container;
      if (container.scrollHeight > container.clientHeight) {
        console.log('Scrollbar is visible');
      } else {
        console.log('Scrollbar is not visible');
      }
    }

  },
  created() {
    if (window.ipcRenderer) {
      window.ipcRenderer.on('log', (event, arg) => {
        console.log('接收到日志:', arg)
      })

      window.ipcRenderer.on("buildLog", (event, arg) => {
        this.logs.unshift({level: arg.level, info: arg.info})
      })
      window.ipcRenderer.send("getWindowTop")
      window.ipcRenderer.once("windowTop", (event, top) => {
        this.fixedStatus = top
      })
    }

    setTimeout(() => {

          // 创建支持窗口拖转到div
          const dragHandle = document.getElementById('drag-region');

          dragHandle.addEventListener('mousedown', (event) => {
            isDragging = true;
            mousePosition.x = event.screenX;
            mousePosition.y = event.screenY;
            window.ipcRenderer.send('drag-start');
          });

          document.addEventListener('mousemove', (event) => {
            if (isDragging) {
              let deltaX = event.screenX - mousePosition.x;
              let deltaY = event.screenY - mousePosition.y;
              window.ipcRenderer.send('dragging', {deltaX, deltaY});
            }
          });

          document.addEventListener('mouseup', () => {
            if (isDragging) {
              isDragging = false;
              window.ipcRenderer.send('drag-end');

            }
          });
        }, 1000
    )

  },
  beforeUnmount() {
    window.ipcRenderer.removeHandler('log')
    window.ipcRenderer.removeHandler('buildLog')
    window.ipcRenderer.removeHandler('ResultsReceive')

  }


}

if (window.require && !window.ipcRenderer) {
  window.ipcRenderer = window.require('electron').ipcRenderer
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

.router-link-exact-active,
.router-link-active {
  text-decoration: none; /* 去掉下划线 */
  color: inherit; /* 继承父元素的颜色 */
}

.custom-link {
  text-decoration: none;
  color: inherit;
}
</style>
