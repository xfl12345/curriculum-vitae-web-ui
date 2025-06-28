<template>
  <div ref="templateRoot" :style="rootStyle">
    <div class="xflsCardViewInvertBgColor" :style="cardStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { computed, ref } from 'vue'
import type { VuePartialCssProperties } from '@/components/xfl-common/ts/VuePartialCssProperties'

const templateRoot = ref<HTMLDivElement>()

const props = defineProps({
  theFontSizeInPixel: {
    type: Number,
    default: 24,
  },
  theBackgroundColor: {
    type: String,
    default: 'rgb(173, 216, 230)',
  },
})

const theFontSize = computed(() => props.theFontSizeInPixel + 'px')
const quarterOfFontSizeInPixel = computed(() => {
  return Math.floor(props.theFontSizeInPixel / 4)
})
const quarterOfFontSize = computed(() => {
  return quarterOfFontSizeInPixel.value + 'px'
})
const oneEighthOfFontSize = computed(() => {
  return Math.floor(quarterOfFontSizeInPixel.value / 2) + 'px'
})
const rootStyle = computed<VuePartialCssProperties>(() => {
  return {
    margin: [
      Math.floor(quarterOfFontSizeInPixel.value / 2) + 'px',
      quarterOfFontSize.value,
      quarterOfFontSize.value,
      quarterOfFontSize.value,
    ].join(' '),
    fontSize: theFontSize.value,
  }
})
const cardStyle = computed<VuePartialCssProperties>(() => {
  return {
    /* box-shadow: x-shadow y-shadow blur spread color inset; */
    boxShadow: [
      oneEighthOfFontSize.value, // x-shadow
      oneEighthOfFontSize.value, // y-shadow
      oneEighthOfFontSize.value, // blur
      '0', // spread
      'gray', // color
    ].join(' '),
    backgroundColor: props.theBackgroundColor,
    border: [props.theBackgroundColor, 'solid', '1px'].join(' '),
    borderRadius: quarterOfFontSize.value,
  }
})
</script>

<style scoped>
.xflsCardViewInvertBgColor {
  filter: invert(0);
}
.xflsCardViewInvertBgColor:hover {
  filter: invert(100);
}
</style>
