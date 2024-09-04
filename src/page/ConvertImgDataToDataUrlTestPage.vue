<template>
  <div>
    <div>
      <span style="color: blue">IMG source URL </span>
      <input v-model="imgSrcURL" type="text" />
      <button type="submit" @click="downloadImg">确定</button>
    </div>
    <div style="display: flex; justify-content: space-around">
      <div :style="imgBoxRootStyle">
        <div :style="imgBoxStyle">
          <img
            ref="referenceImg"
            style="vertical-align: middle"
            :src="imgSrcURL"
            alt=""
            @load="updateDataURL"
          />
        </div>
      </div>
      <div :style="imgBoxRootStyle">
        <div :style="imgBoxStyle">
          <canvas ref="theCanvas" style="vertical-align: middle"></canvas>
        </div>
      </div>
      <div :style="imgBoxRootStyle">
        <div :style="imgBoxStyle">
          <img :src="bgDataURL" style="vertical-align: middle" alt="" />
        </div>
      </div>
    </div>
    <div>
      <span style="color: blue">IMG data URL </span>
      <pre style="white-space: pre-wrap; word-break: keep-all; overflow: auto">{{ bgDataURL }}</pre>
      <button type="button" @click="copyValue2ClipBoard">复制</button>
      <span>
        <span v-if="copyActionStatus === 'ok'" style="color: green">复制成功</span>
        <span v-if="copyActionStatus === 'failed'" style="color: red">复制失败</span>
      </span>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref } from "vue";
import { Clipboard } from "v-clipboard";
import axios from "axios";
import { VuePartialCssProperties } from "@/components/xfl-common/ts/VuePartialCssProperties";

export default defineComponent({
  setup() {
    const referenceImg = ref<HTMLImageElement>();
    const theCanvas = ref<HTMLCanvasElement>();
    const imgBoxRootStyle: VuePartialCssProperties = {
      boxSizing: "border-box",
      // border: "aqua solid 1px",
      padding: "20px",
      verticalAlign: "top",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    };
    const imgBoxStyle: VuePartialCssProperties = {
      boxSizing: "border-box",
      border: "hotpink solid 1px"
    };
    return {
      referenceImg,
      theCanvas,
      imgBoxRootStyle,
      imgBoxStyle
    };
  },
  data() {
    // type CopyActionStatusType = "idle" | "ok" | "failed";
    const copyActionStatus = "idle";
    return {
      vueMounted: false,
      copyActionStatus,
      copyActionFeedbackMessageBoxTimeoutHandle: null,
      bgDataURL: "",
      imgSrcURL: "vite.svg"
    };
  },
  computed: {},
  mounted() {
    this.vueMounted = true;
  },
  unmounted() {
    this.vueMounted = false;
  },
  methods: {
    downloadImg() {
      const myself = this;
      axios.get(myself.imgSrcURL).then(
        (axiosResponse) => {
          if (axiosResponse.status === 200) {
            console.log(axiosResponse);
            console.log(axiosResponse.data);
            console.log(axiosResponse instanceof Response);
            console.log(axiosResponse.request instanceof XMLHttpRequest);
          } else {
            //
          }
        },
        (reason) => {}
      );
    },
    updateCopyFeedbackMessage(status: string) {
      const myself = this;
      myself.copyActionStatus = status;
      clearTimeout(myself.copyActionFeedbackMessageBoxTimeoutHandle);
      myself.copyActionFeedbackMessageBoxTimeoutHandle = setTimeout(() => {
        myself.copyActionStatus = "idle";
      }, 3000);
    },
    copyValue2ClipBoard() {
      const myself = this;

      Clipboard.copy(myself.bgDataURL).then(
        () => myself.updateCopyFeedbackMessage("ok"),
        () => myself.updateCopyFeedbackMessage("failed")
      );
    },
    updateDataURL() {
      const myself = this;
      myself.bgDataURL = "";

      // https://blog.csdn.net/yaxuan88521/article/details/122794055
      // const canvasElement = document.createElement("canvas");
      const canvasElement = myself.theCanvas;
      const canvasRenderingContext2D = canvasElement.getContext("2d");
      const img = myself.referenceImg;
      canvasElement.height = img.naturalHeight;
      canvasElement.width = img.naturalWidth;
      console.log(img);
      canvasRenderingContext2D.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
      const theDataURL = canvasElement.toDataURL();

      console.log(theDataURL);
      myself.bgDataURL = theDataURL;
    }
  }
});
</script>
