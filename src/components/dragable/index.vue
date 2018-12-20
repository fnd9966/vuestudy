/*
 * 可拖拽容器
 * left|top 初始化位置 默认可视区域中心
 */

<template>
  <div class="dragableBox" ref='dragbox' :style="position">
    <slot></slot>
  </div>
</template>

<script>

const isNumber = v => !isNaN(parseFloat(v)) && isFinite(v)
const AE = 'addEventListener'
const RE = 'removeEventListener'
const MM = 'mousemove'
const MD = 'mousedown'
const MU = 'mouseup'
const AG = 'alowdrag'

export default {
  name: 'dragable',
  props: {
    left: Number,
    top: Number
  },
  data () {
    return {
      dragDom: [],
      x: 0,
      y: 0,
      e: null,
      c: {
        start: false,
        sx: 0,
        sy: 0,
        ex: 0,
        ey: 0
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      let box = this.$refs.dragbox
      if (!box) return
      let client = document.documentElement || document.body
      let h = client.clientHeight, w = client.clientWidth
      let bh = box.offsetHeight, bw = box.offsetWidth
      let { left, top } = this.$props
      let t = top === void 0 ? (h - bh) / 2 : top, l = left === void 0 ? (w - bw) / 2 : left
      this.x = isNumber(l) ? l : 0
      this.y = isNumber(t) ? t : 0
      this.dragDom = this.getDragDom(box)
      this.initEvent()
    })
  },
  beforeDestroy: function () {
    this.removeEvent()
  },
  methods: {
    getDragDom: function (box) {
      let dom = box.childNodes, len = dom.length, arr = []
      if (box.getAttribute) {
        let alow = box.getAttribute(AG)
        if (alow !== null && alow !== void 0) arr.push(box)
      }
      for (let i = 0; i < len; i++) {
        let narr = this.getDragDom(dom[i])
        if (narr.length > 0) arr = arr.concat(narr)
      }
      return arr
    },
    initEvent: function () {
      let body = document.body
      body[AE](MM, this.move)
      body[AE](MU, this.stop)
      let { dragDom } = this
      for (let i = 0, len = dragDom.length; i < len; i++) {
        dragDom[i][AE](MD, this.start)
      }
    },
    removeEvent: function () {
      let body = document.body
      body[RE](MM, this.move)
      body[RE](MU, this.stop)
    },
    start: function (e) {
      if (e.stopPropagation) {
        e.stopPropagation()
      } else if (typeof e.cancelBubble === 'boolean') {
        e.cancelBubble = true
      }
      let { x, y } = this
      this.c = {
        state: true,
        sx: x,
        sy: y,
        ex: e.pageX,
        ey: e.pageY
      }
    },
    move: function (e) {
      this.e = e
    },
    stop: function (e) {
      this.c.state = false
    }
  },
  computed: {
    position: function () {
      let { x, y } = this
      return {
        left: x + 'px',
        top: y + 'px'
      }
    }
  },
  watch: {
    e: function (e) {
      let { state, sx, sy, ex, ey } = this.c
      if (!state || !e) return
      this.x = sx + e.pageX - ex
      this.y = sy + e.pageY - ey
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
.dragableBox {
  position: fixed; z-index: 99999; height: unset; width: unset;
  *[alowdrag] { cursor: move; }
}
</style>
