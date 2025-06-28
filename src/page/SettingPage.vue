<template>
  <div ref="templateRoot" style="height: 90vh; display: flex; flex-direction: column; font-size: xx-large">
    <center-box y-grow="1" x-basis="800px">
      <div style="display: flex; white-space: nowrap">
        <span>记住调试状态</span>
        <n-space>
          <n-switch v-model:value="modelKeepDebugState" />
        </n-space>
      </div>
      <div style="display: flex; white-space: nowrap">
        <span>开发者模式</span>
        <n-space>
          <n-switch v-model:value="developmentModeFlag" />
        </n-space>
      </div>
    </center-box>
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref } from 'vue'
import { useGlobalStore } from '@/store'
import { NSpace, NSwitch } from 'naive-ui'
import CenterBox from '@/components/xfl-common/vue/CenterBox.vue'

export default defineComponent({
  components: { CenterBox, NSpace, NSwitch },
  props: {},
  emits: [],
  setup(props, ctx) {
    const templateRoot = ref<HTMLDivElement>()
    const store = useGlobalStore()

    return {
      templateRoot,
      store,
    }
  },
  data() {
    const webSocketClient: any = null
    return {
      keepDebugState: false,
    }
  },
  computed: {
    modelKeepDebugState: {
      get(): boolean {
        return this.keepDebugState
      },
      set(inputValue: boolean) {
        const myself = this
        myself.store.setCookie({
          developmentModeFlag: inputValue ? myself.developmentModeFlag : undefined,
        })
        myself.keepDebugState = inputValue
      },
    },
    developmentModeFlag: {
      get(): boolean {
        return this.store.globalState.developmentModeFlag
      },
      set(inputValue: boolean) {
        this.store.setDevMode(inputValue)
        if (this.keepDebugState) {
          this.store.setCookie({ developmentModeFlag: inputValue })
        }
      },
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    const myself = this
    myself.keepDebugState = 'developmentModeFlag' in myself.store.globalState.cookieManager.clientCookie
  },
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeUnmount() {},
  unmounted() {},
  methods: {},
})
</script>
