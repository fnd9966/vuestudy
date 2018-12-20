/*
 * 图片展示组件
 * int: 更改值 重新初始化
 * img: 显示的图片
 */

<template>
  <div :class="cName" @mousewheel="mousewheel" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove" @dblclick="dblclick">
    <div class="basePoint" ref="basePoint"></div>
    <div class="transformBox" ref="box" :style="{transform: transform}"></div>
  </div>
</template>

<script>

const SCALE = 1.5

export default {
  name: 'imgShow',
  props: {
    theme: {
      type: String,
      default: ''
    },
    int: {
      type: Number,
      default: -1
    },
    img: String
  },
  data () {
    return {
      data: [],
      cof: {},
      p: [0, 0, 1],
      v: {
        state: false,
        a: [0, 0],
        p: [0, 0],
        e: [0, 0]
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      window.addEventListener('resize', this.initEvent)
    })
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.initEvent)
  },
  methods: {
    initEvent: function () {
      this.initImg(this.img)
    },
    clear: function () {
      this.p = [0, 0, 1]
      let box = this.$refs.box
      if (!box) return
      box.innerHTML = ''
    },
    initImg: function (v) {
      let img = document.createElement('img')
      img.src = v
      img.onload = () => {
        if (img.src !== this.img) return
        this.clear()
        let box = this.$refs.box
        if (!box) return
        let bw = box.offsetWidth, bh = box.offsetHeight
        let iw = img.width, ih = img.height
        let w = iw, h = ih
        if (bw / bh >= iw / ih) {
          h = Math.min(bh, ih)
          w = h * iw / ih
        } else {
          w = Math.min(bw, iw)
          h = w * ih / iw
        }
        img.style.marginTop = (bh - h) / 2 + 'px'
        img.width = w
        img.height = h
        img.draggable = false
        box.appendChild(img)
      }
      img.onerror = () => {
        this.clear()
      }
    },
    mousedown: function (e) {
      let { v, p } = this
      v.state = true
      v.a = v.e
      v.p[0] = p[0]
      v.p[1] = p[1]
    },
    mouseup: function (e) {
      let { v } = this
      v.state = false
    },
    mousemove: function (e) {
      let { v, p } = this
      let bs = this.$refs.basePoint
      if (!bs) return

      let x = e.pageX - bs.offsetLeft
      let y = e.pageY - bs.offsetTop
      v.e = [x, y]
      if (!v.state) return

      let dx = x - v.a[0] + v.p[0]
      let dy = y - v.a[1] + v.p[1]
      this.p = [dx, dy, p[2]]
    },
    dblclick: function (e) {
      this.zoom(1)
    },
    mousewheel: function (e) {
      let delta = e.wheelDelta
      this.zoom(delta)
    },
    zoom: function (key) {
      let { v, p } = this, { e } = v
      let delta = key > 0 ? SCALE : 1 / SCALE
      let s = p[2] * delta
      let a = (p[0] - e[0]) * delta + e[0]
      let b = (p[1] - e[1]) * delta + e[1]
      this.p = [a, b, s]
    }
  },
  computed: {
    cName: function () {
      return 'imgShow ' + this.theme
    },
    transform: function () {
      let p = this.p
      return 'translate(' + p[0] + 'px, ' + p[1] + 'px) scale(' + p[2] + ')'
    }
  },
  watch: {
    int: function () {
      this.initImg(this.img)
    },
    img: function (v) {
      this.initImg(v)
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
.isSelect(@st) { user-select:@st; -ms-user-select:@st; -moz-user-select:@st; -webkit-user-select:@st; }
.imgShow {
  height: 100%; width: 100%; overflow: hidden; background: #fff;
  .isSelect(none);
  .basePoint { position: fixed; height: 0; width: 0; }
  .transformBox { height: 100%; width: 100%; text-align: center;
    transform-origin: 0px 0px;
    -ms-transform-origin: 0px 0px;
    -webkit-transform-origin: 0px 0px;
    -moz-transform-origin: 0px 0px;
    -o-transform-origin: 0px 0px;
  }
  img { .isSelect(none); }
}
</style>
