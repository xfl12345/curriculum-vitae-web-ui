<template>
  <div ref="templateRoot" :class="[myVueStyle.root]">
    <div v-if="debugMode" style="position: fixed; top: 0; left: 0; border: hotpink dashed 1px; z-index: 1">
      {{ JSON.stringify(stateWindow) }}
    </div>
    <div :class="[myVueStyle.content]">
      <div>
        <circle-progress-bar
          v-slot="slotProps"
          sizing-type="border"
          :progress="progress"
          :progress-max="PROGRESS_MAX"
          :rounded="true"
          :dom-square-box-width="circleProgressBarWidthInPixel"
          :stroke-width-in-pixel="circleProgressBarStrokeWidthInPixel"
          :color-filled="circleProgressBarColorArray"
          :transition-duration-in-seconds="0.3"
          @reached="onOneHundredReached"
        >
          <div :class="[myVueStyle.fillParent]">
            <div v-if="isShowPercentageBox" :class="[myVueStyle.fillParent]">
              <div
                :class="[myVueStyle.circleProgressBarPanel]"
                :style="{
                  // opacity: slotProps.isLimitReached ? 0 : 1,
                  height: slotProps.isLimitReached ? '100%' : '50%',
                  // transform: slotProps.isLimitReached ? undefined : 'scale(1, 1.75)',
                  fontSize: slotProps.innerBoxWidthInPixel / (slotProps.isLimitReached ? 2.2 : 2.5) + 'px',
                }"
              >
                <div
                  :class="[myVueStyle.circleProgressBarPanelBody]"
                  :style="[slotProps.isLimitReached ? { height: '100%' } : undefined]"
                >
                  <div
                    :style="[
                      slotProps.isLimitReached
                        ? {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }
                        : undefined,
                    ]"
                  >
                    <span style="">{{ slotProps.percentage + '%' }}</span>
                  </div>
                </div>
              </div>
              <div
                style="height: 50%; width: 100%; text-align: center"
                :style="{ fontSize: slotProps.innerBoxWidthInPixel / 20 + 'px' }"
              >
                <span style="white-space: pre-wrap">{{ checkItemNameList[checkItemIndex] }}</span>
                <br />
                <div :style="{ opacity: checkItemIndex === 1 ? 1 : 0 }">
                  <div v-if="!fontDetection.isNeedToLoadExtraFont">
                    <span>字体名称：[{{ fontDetection.currentItem.fontName }}]</span>
                    <br />
                    <div>
                      是否支持：[<span
                        :style="{ color: fontDetection.currentItem.isSupport ? 'darkGreen' : 'red' }"
                        >{{ fontDetection.currentItem.isSupport ? '是' : '否' }}</span
                      >]
                    </div>
                  </div>
                  <div v-if="fontDetection.isNeedToLoadExtraFont">{{ fontDetection.loadFontMessage }}</div>
                  <div v-if="!fontDetection.isAllRescueFailed" style="display: inline">
                    <span style="vertical-align: top">字体预览：</span>
                    <canvas
                      ref="canvas4font"
                      :height="slotProps.innerBoxWidthInPixel / 10"
                      :width="slotProps.innerBoxWidthInPixel / 10"
                      style="border: blue solid 1px; vertical-align: text-top"
                    />
                  </div>
                  <div v-if="fontDetection.isAllRescueFailed">
                    <button @click="onAllDone">Yes! Go on!</button>
                  </div>
                </div>
              </div>
            </div>
            <center-box v-if="!isShowPercentageBox">
              <svg
                :width="slotProps.innerBoxWidthInPixel * 0.8"
                :height="slotProps.innerBoxWidthInPixel * 0.6"
              >
                <svg-right-picture-path
                  :offset-x="slotProps.innerBoxWidthInPixel * 0.8 * 0.05"
                  :offset-y="slotProps.innerBoxWidthInPixel * 0.6 * 0.05"
                  :width="slotProps.innerBoxWidthInPixel * 0.8 * 0.9"
                  :height="slotProps.innerBoxWidthInPixel * 0.6 * 0.9"
                  :props-css-style="{
                    fill: 'transparent',
                    strokeWidth: circleProgressBarStrokeWidthInPixel + 'px',
                    stroke: 'aqua',
                    animationTimingFunction: 'liner',
                    transitionDuration: '1s',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                  }"
                />
              </svg>
            </center-box>
          </div>
        </circle-progress-bar>
        <div v-if="exhibition">
          <button @click="jumpTarget">点我继续转跳</button>
          <button @click="resetProgressAndRun">点我再看一遍</button>
        </div>
        <div v-if="debugMode">
          <br />
          <input v-model="progress" type="number" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onBeforeMount, onMounted, toRaw } from 'vue'
import { useGlobalStore } from '@/store'
import { useRouter } from 'vue-router'
import tinygradient from 'tinygradient'
import CircleProgressBar from '@/components/xfl-common/vue/CircleProgressBar.vue'
import CenterBox from '@/components/xfl-common/vue/CenterBox.vue'
import SvgRightPicturePath from '@/components/xfl-common/vue/SvgRightPicturePath.vue'
import { applyNewFont2GlobalDom, SupportedFontFamilyDetector } from '@/components/xfl-common/ts/FontUtils'

// 引入全局状态和路由
const store = useGlobalStore()
const router = useRouter()

// 定义响应式引用
const templateRoot = ref<HTMLDivElement | null>(null)
const canvas4font = ref<HTMLCanvasElement | null>(null)

// 定义数据
const exhibition = ref(false)
const canMount = ref(true)
const debugMode = ref(false)
const progress = ref(0)

const isAllAnimateFinishedValue = ref(false)
const isAllAnimateFinished = computed({
  get() {
    return progress.value === PROGRESS_MAX && isAllAnimateFinishedValue.value
  },
  set(value) {
    isAllAnimateFinishedValue.value = progress.value === PROGRESS_MAX && value
  },
})
const PROGRESS_MAX = 100
const circleProgressBarColorArray = ref(
  tinygradient('red', 'aqua')
    .hsv(PROGRESS_MAX + 1, 'long')
    .map((item) => item.toHexString())
)
const checkItemIndex = ref(0)
const checkItemNameList = ['正在检查您的浏览器，请稍等……', '正在检查浏览器对字体支持的情况']
const isShowPercentageBox = ref(true)
const isMounted = ref(false)

// 使用 reactive 定义复杂对象
const fontDetection = reactive({
  currentItem: {
    fontName: '',
    isSupport: false,
  },
  isNeedToLoadExtraFont: false,
  loadFontMessage: '',
  isAllRescueFailed: false,
})

// 定义计算属性
const stateWindow = computed(() => ({
  innerWidth: store.globalState.uiCalculation.window.innerWidth,
  innerHeight: store.globalState.uiCalculation.window.innerHeight,
}))

const circleProgressBarWidthInPixel = computed(() => {
  let result = 1000
  if (isMounted.value && 'clientWidth' in document.body) {
    result = Math.min(stateWindow.value.innerWidth, stateWindow.value.innerHeight)
    result -= parseInt(getComputedStyle(templateRoot.value!).paddingTop, 10) << 1
  }
  return result
})

const circleProgressBarWidth = computed(() => circleProgressBarWidthInPixel.value + 'px')

const circleProgressBarStrokeWidthInPixel = computed(() => {
  const circleWidth = circleProgressBarWidthInPixel.value
  let result
  if (circleWidth >= 900) {
    result = 40
  } else if (circleWidth > 200) {
    result = circleWidth / 30
  } else {
    result = 4
  }
  return result
})

function startProgress() {
  checkItemIndex.value += 1
  const fontList = store.globalState.diyFontFamilyList
  const detector = new SupportedFontFamilyDetector()
  if (canvas4font.value) {
    detector.selectedFontCanvas = canvas4font.value
    detector.testChar = 'a'
    detector.defaultFontCanvas.width = detector.selectedFontCanvas.width
    detector.defaultFontCanvas.height = detector.selectedFontCanvas.height
  }

  const progressUnit = PROGRESS_MAX / (fontList.length + 1)
  const supportFontStatus: Record<string, boolean> = {}
  let i = 0

  const checkFont = () => {
    if (i >= fontList.length) {
      console.log(toRaw(store.globalState.diyFontFamilyList))
      if (Object.values(supportFontStatus).filter((value) => value).length === 0) {
        fontDetection.loadFontMessage = '由于所有字体均不支持，正在下载额外字体'
        fontDetection.isNeedToLoadExtraFont = true
        const fontName = 'FangZhengKaiTi'
        applyNewFont2GlobalDom(fontName, 'url(static/font/FZ_KAITI_ZH_HANS.woff2)').then(() => {
          fontDetection.loadFontMessage = '下载成功，并已应用。正在检测能否渲染。'
          store.addFontFamily(fontName)
          if (detector.isSupported(fontName)) {
            onAllDone()
          } else {
            onFailed()
            fontDetection.isAllRescueFailed = true
            fontDetection.loadFontMessage =
              '渲染失败。因浏览器不能正常显示字体，界面布局可能混乱，是否继续访问？'
            console.log('Apply new font failed.')
          }
        })
      } else {
        onAllDone()
      }
      return
    }

    const fontName = fontList[i]
    fontDetection.currentItem.fontName = fontName
    const isSupport = detector.isSupported(fontName)
    fontDetection.currentItem.isSupport = isSupport
    supportFontStatus[fontList[i]] = isSupport

    const targetProgress = progress.value + progressUnit
    const updateProgress = () => {
      if (progress.value < targetProgress) {
        progress.value += 1
        setTimeout(updateProgress, 20)
      } else {
        i += 1
        checkFont()
      }
    }
    updateProgress()
  }

  checkFont()
}

// 生命周期钩子
onBeforeMount(() => {
  const routeExhibition = router.currentRoute.value.query.exhibition as string | undefined
  exhibition.value = routeExhibition ? JSON.parse(routeExhibition) : false
  if (!exhibition.value && store.globalState.browserInitiated) {
    canMount.value = false
    router.push({ name: 'cv' })
  }
})

onMounted(() => {
  if (!canMount.value) return
  isMounted.value = true

  setTimeout(startProgress, 500)
})

// 定义方法
const jumpTarget = () => {
  const tmpJumpTarget = router.currentRoute.value.query.jumpTarget as string | undefined
  const jumpTarget = tmpJumpTarget ?? 'cv'
  router.push(jumpTarget)
}

const onOneHundredReached = (reached: boolean) => {
  if (reached) {
    setTimeout(() => {
      isShowPercentageBox.value = !reached
    }, 1000)
  } else {
    isShowPercentageBox.value = !reached
  }
}

const onAllDone = () => {
  store.setBrowserInitiatedFlag(true)
  progress.value = PROGRESS_MAX
  if (exhibition.value) {
    setTimeout(() => {
      isAllAnimateFinished.value = true
    }, 2300)
  } else {
    setTimeout(jumpTarget, 2300)
  }
}

function resetProgressAndRun() {
  if (isAllAnimateFinished.value) {
    checkItemIndex.value = 0
    fontDetection.isAllRescueFailed = false
    fontDetection.isNeedToLoadExtraFont = false
    progress.value = 0
    isAllAnimateFinished.value = false
    setTimeout(startProgress, 500)
  }
}

const onFailed = () => (circleProgressBarColorArray.value = ['#FF0000', '#FF0000'])
</script>
<style module="myVueStyle" lang="css">
.root {
  height: 99vh;
  padding-top: 1vh;
}

.content {
  display: flex;
  justify-content: center;
  min-width: v-bind('circleProgressBarWidth');
  min-height: v-bind('circleProgressBarWidth');
}

.fillParent {
  width: 100%;
  height: 100%;
}

.circleProgressBarPanel {
  position: relative;
  transition-property: height, font-size, opacity;
  transition-duration: 0.8s, 0.8s, 1s;
  transition-timing-function: ease, ease, linear;
  transition-delay: 0s, 0s, 1s;
  line-height: 0.8;
}

.circleProgressBarPanelBody {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
