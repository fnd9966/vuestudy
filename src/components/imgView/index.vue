/*
 * 图片播放
 * 图片展示 + 播放轴
 * d: 数据
 * int: 更改值 重新初始化
 * config: 配置项
 * theme: 皮肤
 */

<template>
  <div :class="cName">
    <div class="imgViewBox">
      <ImsShow
        :img="img"
      />
    </div>
    <div class="playViewBox">
      <play-bar
        :int="playInt"
        theme="default"
        :d="data"
        :config="playConfig"
        :change="imgChange"
      />
    </div>
  </div>
</template>

<script>
import ImsShow from './imgShow.vue'
import PlayBar from './playBar.vue'
export default {
  name: 'imgView',
  components: {
    ImsShow,
    PlayBar
  },
  props: {
    theme: {
      type: String,
      default: ''
    },
    int: {
      type: Number,
      default: -1
    },
    d: Array,
    config: Object
  },
  data () {
    return {
      data: [],
      cof: {},
      img: '',
      playInt: -1,
      playConfig: {}
    }
  },
  methods: {
    imgChange: function (i) {
      let v = this.data[i]
      if (!v) return
      let url = v.url
      this.img = url
    }
  },
  computed: {
    cName: function () {
      return 'imgView ' + this.theme
    }
  },
  watch: {
    int: function (v) {
      let cof = Object.assign({}, this.cof, this.$props.config)
      this.cof = cof
      this.playConfig = this.cof.playConfig || {}
      this.data = this.d
      this.playInt++
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "./index.less";
</style>
