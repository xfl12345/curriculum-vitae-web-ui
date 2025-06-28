<template>
  <div
    ref="templateRoot"
    style="display: flex; justify-content: space-between; white-space: nowrap; vertical-align: middle"
    :style="{ fontSize: theFontSize }"
  >
    <div
      ref="qrCodeLeftBox"
      v-resize:[!isQrCodeLeftBoxUiLoaded]="qrCodeLeftBoxResize"
      style="display: inline-block"
    >
      <url-item
        v-for="item in communityUrlList"
        :key="item"
        :the-font-size-in-pixel="theFontSizeInPixel"
        :the-url="item"
      />
    </div>
    <div v-if="isQrCodeRightBoxUiCanLoad && qrCodeRightBoxHeightInPixel !== 0">
      <vue-qr
        ref="qrCodeWeChat"
        color-light="#89D961"
        color-dark="#76269E"
        style="display: inline-block; vertical-align: top; cursor: pointer; overflow: hidden"
        :style="{ width: qrCodeRightBoxHeight, height: qrCodeRightBoxHeight }"
        :size="qrCodeRightBoxHeightInPixel"
        :margin="0"
        :text="wechatUrl"
        :logo-src="weChatHeadPhoto"
        @click="openUrl(wechatUrl)"
      />
      <div style="display: inline-block" :style="{ height: qrCodeRightBoxHeight }">
        <div
          style="height: 100%; display: flex; flex-direction: column; justify-content: space-around"
          :style="{ lineHeight: fingerEmojiFontSize }"
        >
          <div style="display: inline-block; padding: 0; vertical-align: bottom">
            <span :style="{ fontSize: fingerEmojiFontSize }">👈</span>
            <text-prettier
              style="vertical-align: inherit"
              :style="{ fontSize: funnyWelcomeBoxFontSize, lineHeight: funnyWelcomeBoxFontSize }"
              content="扫我加微信😉"
            />
          </div>
          <div style="display: inline-block; padding: 0; vertical-align: bottom">
            <text-prettier
              style="vertical-align: inherit"
              :style="{ fontSize: funnyWelcomeBoxFontSize, lineHeight: funnyWelcomeBoxFontSize }"
              content="扫我拿简历源码"
            />
            <span :style="{ fontSize: fingerEmojiFontSize }">👉</span>
          </div>
        </div>
      </div>
      <!-- <vue-qr
        ref="qrCodeCurriculumVitaeSourceCode"
        color-light="orange"
        color-dark="#0057ff"
        style="display: inline-block; vertical-align: top; cursor: pointer; overflow: hidden"
        :style="{ width: qrCodeRightBoxHeight, height: qrCodeRightBoxHeight }"
        :size="qrCodeRightBoxHeightInPixel"
        :margin="0"
        :text="curriculumVitaeSourceCodeUrl"
        @click="openUrl(curriculumVitaeSourceCodeUrl)"
      /> -->
    </div>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref, computed, watch } from "vue";
import TextPrettier from "@/components/xfl-common/vue/TextPrettier.vue";
import UrlItem from "@/components/UrlItem.vue";

const props = withDefaults(
  defineProps<{
    theFontSizeInPixel?: number;
    communityUrlList?: string[];
    wechatUrl?: string;
    weChatHeadPhoto?: string;
    curriculumVitaeSourceCodeUrl?: string;
  }>(),
  {
    theFontSizeInPixel: 16,
    communityUrlList: () => [],
    wechatUrl: "",
    weChatHeadPhoto: "",
    curriculumVitaeSourceCodeUrl: ""
  }
);

const templateRoot = ref<HTMLDivElement>();
const qrCodeLeftBox = ref<HTMLDivElement>();
const qrCodeWeChat = ref<HTMLDivElement>();
const qrCodeCurriculumVitaeSourceCode = ref<HTMLDivElement>();

const state = reactive({
  isQrCodeRightBoxUiCanLoad: false,
  isQrCodeLeftBoxUiLoaded: false,
  qrCodeLeftBoxHeightInPixel: 0
});

const qrCodeRightBoxHeightInPixel = computed(() => state.qrCodeLeftBoxHeightInPixel);
const qrCodeRightBoxHeight = computed(() => qrCodeRightBoxHeightInPixel.value + "px");
const theFontSize = computed(() => props.theFontSizeInPixel + "px");
const fingerEmojiFontSizeInPixel = computed(() => Math.ceil((qrCodeRightBoxHeightInPixel.value * 3) / 8));
const fingerEmojiFontSize = computed(() => fingerEmojiFontSizeInPixel.value + "px");
const funnyWelcomeBoxFontSize = computed(() => Math.ceil(fingerEmojiFontSizeInPixel.value * 0.6) + "px");

watch(
  () => props.theFontSizeInPixel,
  (theNew, theOld) => {
    if (theNew !== theOld) {
      state.isQrCodeRightBoxUiCanLoad = false;
    }
  }
);

const openUrl = window.open;

function qrCodeLeftBoxResize(widthAndHeight: any) {
  const myself = state;
  myself.isQrCodeRightBoxUiCanLoad = false;
  myself.qrCodeLeftBoxHeightInPixel = widthAndHeight.height;
  myself.isQrCodeRightBoxUiCanLoad = true;
}
</script>
