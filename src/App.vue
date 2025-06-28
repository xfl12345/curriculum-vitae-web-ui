<template>
  <router-view ref="templateRoot" :style="{ fontFamily }" />
</template>

<script setup lang="tsx">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useGlobalStore } from '@/store'

const store = useGlobalStore()
const router = useRouter()
const cookieManager = store.globalState.cookieManager
cookieManager.reloadCookie()
if (
  'uiCalculation' in cookieManager.clientCookie &&
  'rootScale' in cookieManager.clientCookie.uiCalculation
) {
  store.setRootScale(cookieManager.clientCookie.uiCalculation.rootScale)
}
if ('developmentModeFlag' in cookieManager.clientCookie) {
  store.setDevMode(cookieManager.clientCookie.developmentModeFlag)
}
console.log(JSON.stringify(store.globalState.cookieManager))

// const windowInAnyType = window as any;
// windowInAnyType.vuexStoreSetCookie = (cookie: any) => {
//   store.commit("setCookie", cookie);
// };
// windowInAnyType.ssstate = store;

let updateGlobalUiCalculationDataToken = 0

const debounceTimer = setInterval(() => {
  if (store.globalState.uiCalculation.updateBrowserSelfValue && updateGlobalUiCalculationDataToken > 0) {
    store.updateGlobalUiCalculationData()
    updateGlobalUiCalculationDataToken >>= 2 // 直接除以 4
  }
}, 100) // 每 100ms 触发一次，防抖

const rootNodeResizeObserver = new ResizeObserver((entries, observer) => {
  updateGlobalUiCalculationDataToken += 1
})

// const templateRoot = useTemplateRef<HTMLElement>("templateRoot");
onMounted(() => {
  // console.log(toRaw(templateRoot.value));
  rootNodeResizeObserver.observe(document.documentElement)
})

onBeforeUnmount(() => {
  rootNodeResizeObserver.unobserve(document.documentElement)
  store.globalState.cookieManager.clientCookie.uiCalculation.rootScale =
    store.globalState.uiCalculation.rootScale
  store.globalState.cookieManager.saveCookie()
})

const fontFamily = computed(() => {
  return (
    store.globalState.diyFontFamilyList.join(', ') +
    ', ' +
    store.globalState.diyDefaultFontFamilyList.join(', ') +
    ', ' +
    store.globalState.browserDefaultFontFamily
  )
})
// console.log(window.location.href);
// console.log(new URL(window.location.href).href);
// console.log(window.location.hash);

if (!store.globalState.browserInitiated) {
  let tmp = window.location.hash as string | undefined
  let ok = false
  if (typeof tmp !== 'undefined' && tmp.length > 2) {
    let endIndex = tmp.indexOf('?')
    if (endIndex === -1) {
      endIndex = tmp.length
    }
    tmp = tmp.slice(2, endIndex)
    ok = tmp !== 'first-time-loading-page' && tmp !== ''
  }
  const jumpTarget: string = ok ? (tmp as string) : 'cv'
  router.push({ name: 'firstTimeLoadingPage', query: { exhibition: 'false', jumpTarget } })
}
</script>
