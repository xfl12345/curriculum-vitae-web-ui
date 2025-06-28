<template>
  <div
    v-if="theIsPanelOpened"
    ref="templateRoot"
    style="
      /*top: 0;*/
      /*left: 0;*/
      /*right: 0;*/
      /*overflow: auto;*/
      position: absolute;
      /*position: fixed;*/
      z-index: 9999;
      background-color: rgba(0, 0, 0, 0.5);
      /*min-width: 1000px;*/
      /*min-height: 500px;*/
      /*height: 100%;*/
      /*width: 100%;*/
      /*height: 100%;*/
      /*width: 100%;*/
    "
    :style="{ width: uiCalculation.fullPage.width, height: uiCalculation.fullPage.height }"
    @click="closePanel"
  >
    <div style="width: 100%; height: 100%; position: relative">
      <div
        ref="contentBox"
        style="
          position: absolute;
          top: 2px;
          left: 2px;
          width: 90vw;
          background-color: rgba(0, 0, 0, 0.8);
          border: 1px dashed hotpink;
          color: white;
        "
        :style="contentBoxStyle"
        @click.stop=""
      >
        <div style="display: flex; justify-content: space-between">
          <div>
            <span style="color: aqua">恭喜你发现了彩蛋！！！</span>
            <span>🌼🎉✨✨✨</span>
          </div>
          <div></div>
          <div>
            <button
              style="cursor: pointer; font-size: inherit"
              :style="{ borderRadius: theFontSize }"
              @click="$emit('refreshCvData')"
            >
              刷新简历数据
            </button>
            <button
              style="cursor: pointer; font-size: inherit"
              :style="{ borderRadius: theFontSize }"
              @click="$emit('jump2IndexPage')"
            >
              前往导航页面
            </button>
            <button
              style="cursor: pointer; font-size: inherit"
              :style="{ borderRadius: theFontSize }"
              @click="closePanel"
            >
              关闭彩蛋面板
            </button>
          </div>
        </div>
        <br />
        <br />

        <div>当前缩放倍率（拖动下方滚动条可以实时调节）：{{ theRootScale }}</div>
        <div style="display: flex">
          <div style="flex-grow: 1; box-sizing: border-box; padding-left: 6px; padding-right: 6px">
            <n-config-provider
              :theme="null"
              :theme-overrides="{
                common: {
                  lineHeight: 'normal'
                }
              }"
            >
              <n-global-style />
              <n-space vertical>
                <n-slider
                  v-model:value="theRootScale"
                  :step="0.5"
                  :min="0.5"
                  :max="30"
                  :marks="{ 4.5: '最小值' }"
                />
              </n-space>
            </n-config-provider>
          </div>
          <button
            style="cursor: pointer; font-size: inherit"
            :style="{
              borderRadius: theFontSize
            }"
            @click="$emit('resetRootScale')"
          >
            复位
          </button>
        </div>
        <!-- TODO 设计实现 debug 模式切换 -->
        <br />
        <br />
        <div>
          提示：网页版简历里的二维码是可以点击的！<br /><br />碎碎念：这个网页版简历还有好多没搞好的地方。例如动态标注缩放的最大值和最小值。毕竟不同设备、不同浏览器显示出来的效果不一定一致，需要动态检测
          二维码部分 DOM 的实际宽度（减少缩放倍率到整体不撑破的情况记为最小值）以及 HTML body DOM
          的实际宽度（增加缩放倍率到整体不被浏览器窗口遮盖内容的情况记为最大值）来动态设定缩放倍率的最大值和最小值。
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref } from "vue";
import { useGlobalStore } from "@/store";
import { NConfigProvider, NGlobalStyle, NSlider, NSpace } from "naive-ui";
import type { VuePartialCssProperties } from "@/components/xfl-common/ts/VuePartialCssProperties";

// noinspection JSSuspiciousNameCombination
export default defineComponent({
  components: {
    NGlobalStyle,
    NSlider,
    NConfigProvider,
    NSpace
  },
  props: {
    rootScale: {
      type: Number,
      required: true
    },
    isPanelOpened: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update:rootScale", "update:isPanelOpened", "jump2IndexPage", "resetRootScale", "refreshCvData"],
  setup(props, ctx) {
    const store = useGlobalStore();
    const templateRoot = ref<HTMLDivElement>();

    return {
      templateRoot,
      store
    };
  },
  data() {
    return {};
  },
  computed: {
    theFontSizeInPixel() {
      return this.store.theFontSizeInPixel;
    },
    theFontSize() {
      return this.theFontSizeInPixel + "px";
    },
    theRootScale: {
      get() {
        return this.rootScale;
      },
      set(value: string) {
        this.$emit("update:rootScale", value);
      }
    },
    theIsPanelOpened: {
      get() {
        return this.isPanelOpened;
      },
      set(value: string) {
        this.$emit("update:isPanelOpened", value);
      }
    },
    uiCalculation() {
      const myself = this;
      const fullPage = {
        width: myself.store.globalState.uiCalculation.document.body.scrollWidth + "px",
        height: myself.store.globalState.uiCalculation.document.body.scrollHeight + "px"
      };

      return {
        fullPage
      };
    },
    contentBoxMinWidthInPixel() {
      return this.theFontSizeInPixel * 16;
    },
    contentBoxStyle() {
      const myself = this;
      const minHeightInPixel = 300;
      const minWidthInPixel = 800;

      const theStyle: VuePartialCssProperties = {
        fontSize: myself.theFontSize,
        minWidth: myself.contentBoxMinWidthInPixel + "px"
      };

      return theStyle;
    }
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    const myself = this;
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeUnmount() {},
  unmounted() {},
  methods: {
    closePanel() {
      this.theIsPanelOpened = false;
    }
  }
});
</script>
