// noinspection JSConstantReassignment

import { defineStore } from 'pinia'
import type { Buildable } from 'ts-essentials'
// import { ResizeObserver } from "resize-observer";
import { getBrowserFirstDefaultFontFamily, getTextSize } from '@/components/xfl-common/ts/FontUtils'
import { ClientCookieManager } from '@/components/xfl-common/ts/ClientCookieManager'
import { LoginMananger } from '@/model/LoginMananger'
import type { StringKeyMapType } from '@/components/xfl-common/ts/StringMapType'
import { computed } from 'vue'

const env = import.meta.env ?? ({} as any)

export const useGlobalStore = defineStore('globalStore', {
  state: () => {
    const globalState = {
      developmentModeFlag: JSON.parse(env.VITE_ENABLE_DEV_MODE ?? 'false'),
      uiCalculation: {
        rootScale: 8,
        theGlobalDefaultFontSizeInPixel: Math.ceil(getTextSize('xx-large')),
        updateBrowserSelfValue: true,
        document: {
          documentElement: {
            offsetHeight: document.documentElement.offsetHeight,
            offsetWidth: document.documentElement.offsetWidth,
          },
          body: {
            scrollWidth: document.body.scrollWidth,
            scrollHeight: document.body.scrollHeight,
            clientWidth: document.body.clientWidth,
            clientHeight: document.body.clientHeight,
          },
        },
        window: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          screen: {
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
          },
        },
      },
      browserDefaultFontFamily: getBrowserFirstDefaultFontFamily(),
      browserInitiated: JSON.parse(env.VITE_DISABLE_BROWSER_INITIALIZATION ?? 'false'),
      // browserInitiated: false,
      cookieManager: new ClientCookieManager(),
      loginManager: new LoginMananger(),
      diyDefaultFontFamilyList: [
        'Microsoft YaHei UI',
        ...document.defaultView!.getComputedStyle(document.body, '').fontFamily.split(','),
      ],
      diyFontFamilyList: ['楷体', 'KaiTi', '华文楷体', 'STKaiti'],
    }

    function setRootScale(rootScale) {
      console.log('setRootScale', rootScale)
      globalState.uiCalculation.rootScale = rootScale
    }
    function addFontFamily(fontName) {
      globalState.diyFontFamilyList = [fontName, ...globalState.diyFontFamilyList]
    }
    function updateGlobalUiCalculationData() {
      const stateDocument: Buildable<Document> = globalState.uiCalculation.document
      const stateWindow: Buildable<Window> = globalState.uiCalculation.window
      stateDocument.documentElement.offsetHeight = document.documentElement.offsetHeight
      stateDocument.documentElement.offsetWidth = document.documentElement.offsetWidth
      stateDocument.body.scrollWidth = document.body.scrollWidth
      stateDocument.body.scrollHeight = document.body.scrollHeight
      stateDocument.body.clientWidth = document.body.clientWidth
      stateDocument.body.clientHeight = document.body.clientHeight
      stateWindow.innerWidth = window.innerWidth
      stateWindow.innerHeight = window.innerHeight
      stateWindow.screen.availWidth = window.screen.availWidth
      stateWindow.screen.availHeight = window.screen.availHeight
    }
    function setUpdateBrowserSelfValue(flag: boolean) {
      globalState.uiCalculation.updateBrowserSelfValue = flag
    }
    function setBrowserInitiatedFlag(flag: boolean) {
      globalState.browserInitiated = flag
    }
    function setCookie(theDict: StringKeyMapType) {
      Object.keys(theDict).forEach((key) => {
        globalState.cookieManager.clientCookie[key] = theDict[key]
      })
      console.log(JSON.stringify(globalState.cookieManager.clientCookie))
      globalState.cookieManager.saveCookie()
    }
    function setDevMode(flag: boolean) {
      globalState.developmentModeFlag = flag
    }

    const theFontSizeInPixel = computed(() => globalState.uiCalculation.theGlobalDefaultFontSizeInPixel)

    const theFontSize = computed(() => theFontSizeInPixel.value + 'px')

    return {
      globalState,
      setRootScale,
      addFontFamily,
      updateGlobalUiCalculationData,
      setUpdateBrowserSelfValue,
      setBrowserInitiatedFlag,
      setCookie,
      setDevMode,
      theFontSizeInPixel,
      theFontSize,
    }
  },
})
