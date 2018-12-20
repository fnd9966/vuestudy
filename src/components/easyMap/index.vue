/*
 * 概化图
 * 支持 点、线、面
 * d: 数据
 * int: 更改值 重新初始化
 * config: 配置项
 * click: click 事件
 * hover: mouseover 事件
 *
 */

<template>
  <div :class="cName" ref="box" :style="{background: background}">
    <div v-if="!!baseMap.img" class="wrapBox" :style="position">
      <img draggable="false" class="baseMap" v-if="baseMap.img" :src="baseMap.src" />
      <canvas @click="hitClick" ref="canvas" class="drawCanvas" @mousemove="move"/>
      <div class="mapPoint" v-for="(v, i) in data" :key="'point' + i" :style="{height: v.size[0] + 'px', width: v.size[1] + 'px', left: v.__left__ + 'px', top: v.__top__ + 'px'}">
        <img draggable="false" @click="hitClick" @mouseover="hitPoint(v, i)" @mouseout="blurPoint" :src="v.icon" :style="{left: v.size[0] / -2 + 'px', top: v.size[1] / -2 + 'px'}" />
      </div>
      <div v-for="(c, j) in d" :key="'d_' + j">
        <div v-for="(v, i) in c" :key="'tooltip_' + j +  i" v-if="v.tooltip && (v.tooltip.permanent || (mouse.i == i && mouse.hit == j))">
          <div class="tooltipBox" :style="{left: v.tooltip.__left__ + 'px', top: v.tooltip.__top__ + 'px'}">
            <div :class="'tooltipContain d_' + v.tooltip.direction">
              <div class="vD">
                <div v-if="typeof v.tooltip.data === 'string'" v-html="v.tooltip.data"></div>
                <div v-else class="defaultContainWrap" :style="tooltipColor">
                  <div class="defaultContain" :style="tooltipBgColor">
                    <div v-for="(p, q) in v.tooltip.data" :key="'line' + q">
                      <div class="tooltipLine" :style="p.style">{{p.name}}{{v[p.key]}}</div>
                    </div>
                  </div>
                  <div class="triangle" :style="triangleBgColor"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="absBlock topLeft"><slot name="topLeft"></slot></div>
    <div class="absBlock topRight"><slot name="topRight"></slot></div>
    <div class="absBlock bottomLeft"><slot name="bottomLeft"></slot></div>
    <div class="absBlock bottomRight"><slot name="bottomRight"></slot></div>
  </div>
</template>

<script>
import { hitArea, hitLine } from './utils'

const O = Object.prototype.toString
const isArray = v => O.call(v) === '[object Array]'
const isObject = v => O.call(v) === '[object Object]'

export default {
  name: 'easyMap',
  props: {
    theme: {
      type: String,
      default: ''
    },
    int: {
      type: Number,
      default: -9
    },
    config: {
      type: Object,
      required: true
    },
    d: {
      type: Object,
      default: function () {
        return {}
      }
    },
    click: Function,
    hover: Function
  },
  data () {
    return {
      data: [],
      f: -1,
      baseMap: {
        src: null,
        img: false,
        w: 100,
        h: 100,
        t: 0,
        l: 0
      },
      cof: {
        background: 'rgba(0, 0, 0, 0)',
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, .7)',
          color: '#ff0'
        },
        map: null,
        bounds: [[0, 20], [20, 0]], // [lng, lat]
        mapType: 'fullReal', // full | fullReal
        viewBounds: [0, 0, 1, 1] // 地图显示的区域限制
      },
      mouse: {
        hit: false,
        i: -1,
        data: false
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.building()
      window.addEventListener('resize', this.initEvent)
    })
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.initEvent)
  },
  methods: {
    initEvent: function () {
      this.setSize()
    },
    building: function () {
      let cof = Object.assign({}, this.cof, this.$props.config)
      this.cof = cof
      if (cof.map !== this.baseMap.src) {
        let img = document.createElement('img')
        img.src = cof.map
        img.onload = () => {
          this.baseMap.img = img
          this.setSize()
        }
        img.onerror = () => {
          this.baseMap.img = false
          this.f++
          this.draw()
        }
        return
      }
      this.setSize()
    },
    setSize: function () {
      let { baseMap, cof } = this, { img } = baseMap, { viewBounds, mapType } = cof
      if (!img) return
      let box = this.$refs.box
      let bw = box.offsetWidth, bh = box.offsetHeight
      let vw = bw * (viewBounds[2] - viewBounds[0]), vh = bh * (viewBounds[3] - viewBounds[1])
      switch (mapType) {
        case 'full':
          this.baseMap = {
            img,
            src: cof.map,
            w: vw,
            h: vh,
            t: bh * viewBounds[1],
            l: bw * viewBounds[0]
          }
          break
        case 'fullReal':
          let iw = img.width, ih = img.height
          let w = iw, h = ih
          if (vw / vh >= iw / ih) {
            h = Math.min(vh, ih)
            w = h * iw / ih
          } else {
            w = Math.min(vw, iw)
            h = w * ih / iw
          }
          this.baseMap = {
            img,
            src: cof.map,
            w,
            h,
            t: (vh - h) / 2 + bh * viewBounds[1],
            l: (vw - w) / 2 + bw * viewBounds[0]
          }
          break
      }
      this.draw()
    },
    draw: function () {
      let canvas = this.$refs.canvas
      let { cof, baseMap, d, mouse } = this, { w, h } = baseMap, { bounds } = cof
      let { points = [], lines = [], areas = [] } = d
      let cursor = 'default'
      if (!canvas) {
        setTimeout(() => this.draw(), 200)
        return
      }
      canvas.width = w
      canvas.height = h
      let ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, w, h)
      if (!this.baseMap.img) {
        this.data = []
        return
      }
      let bcof = { ctx, bounds, w, h }

      let calcLatlng = v => {
        if (!v.tooltip) return
        let cP = this.latlng2xy(v.tooltip)
        v.tooltip.__left__ = cP.x
        v.tooltip.__top__ = cP.y
      }
      lines.map(v => calcLatlng(v))
      areas.map(v => calcLatlng(v))
      let np = []
      points.map((v, i) => {
        if (!v.lat) v.lat = -9999
        if (!v.lng) v.lng = -9999
        let cP = this.latlng2xy(v)
        v.__left__ = cP.x
        v.__top__ = cP.y
        if (v.tooltip) {
          v.tooltip.__left__ = cP.x
          v.tooltip.__top__ = cP.y
        }
        np.push(v)
      })
      this.data = np
      lines.map(v => this.polyDraw(v, bcof, { strokeStyle: v.color || '#fff', lineWidth: v.width || 2 }, 'stroke'))
      areas.map(v => this.polyDraw(v, bcof, { fillStyle: v.color || '#fff' }, 'fill'))
      if (mouse.hit && mouse.data) {
        switch (mouse.hit) {
          case 'lines':
            this.polyDraw(mouse.data, bcof, { strokeStyle: mouse.data.hover || '#fff', lineWidth: mouse.data.width || 2 }, 'stroke')
            break
          case 'areas':
            this.polyDraw(mouse.data, bcof, { fillStyle: mouse.data.hover || '#fff' }, 'fill')
            break
        }
        cursor = 'pointer'
      }
      canvas.style.cursor = cursor
    },
    polyDraw: function (v, bcof, { lineWidth = 2, strokeStyle = '#fff', fillStyle = '#fff' }, key) {
      let { ctx, bounds, w, h } = bcof
      ctx.strokeStyle = strokeStyle
      ctx.lineWidth = lineWidth
      ctx.fillStyle = fillStyle
      this.analysisLatlngs(v.latlng, latlng => {
        this.buildPath(ctx, latlng, bounds, w, h)
        ctx[key]()
      })
    },
    analysisLatlngs: function (latlng, callBack) {
      if (!latlng[0]) return
      if (isArray(latlng[0][0]) || isObject(latlng[0][0])) {
        latlng.map(c => this.analysisLatlngs(c, callBack))
        return
      }
      callBack(latlng)
    },
    buildPath: function (ctx, d, bounds, w, h, key) {
      ctx.beginPath()
      d.map((v, i) => {
        let { x, y } = this.latlng2xy(v)
        ctx[i ? 'lineTo' : 'moveTo'](x, y)
      })
    },
    latlng2xy: function (v) {
      let a = v.lng === void 0 ? v[0] : v.lng
      let b = v.lat === void 0 ? v[1] : v.lat
      let { bounds } = this.cof, { w, h } = this.baseMap
      return {
        x: (a - bounds[0][0]) / (bounds[1][0] - bounds[0][0]) * w,
        y: (b - bounds[0][1]) / (bounds[1][1] - bounds[0][1]) * h
      }
    },
    move: function (e) {
      let { baseMap, d } = this, { w, h } = baseMap
      let { lines = [], areas = [] } = d
      let canvas = this.$refs.canvas
      if (!canvas) return
      let cr = canvas.getBoundingClientRect()
      let x = (e.clientX - cr.left) / cr.width * w
      let y = (e.clientY - cr.top) / cr.height * h
      let hitObject = false
      lines.map((v, i) => {
        let { width = 0 } = v
        width = parseInt(width)
        width = isNaN(width) ? 2 : width / 2 + 1
        let hit = false
        this.analysisLatlngs(v.latlng, (latlng) => {
          let points = latlng.map(c => this.latlng2xy(c))
          if (hitLine({ x, y }, points, width)) hit = true
        })
        if (hit) hitObject = { hit: 'lines', i, data: v }
      })
      if (hitObject) {
        this.doHit(hitObject)
        return
      }
      areas.map((v, i) => {
        let hit = false
        this.analysisLatlngs(v.latlng, (latlng) => {
          let points = latlng.map(c => this.latlng2xy(c))
          if (hitArea({ x, y }, points)) hit = true
        })
        if (hit) hitObject = { hit: 'areas', i, data: v }
      })
      this.doHit(hitObject)
    },
    doHit: function (v) {
      let { hit, data } = this.mouse
      if (!v) {
        if (!hit || hit === 'points') return
        this.mouse = {
          hit: false,
          i: -1,
          data: false
        }
        this.draw()
        return
      }
      if (v.hit === hit && JSON.stringify(v.data) === JSON.stringify(data)) return
      this.mouse = v
      this.draw()
    },
    hitPoint: function (v, i) {
      this.mouse = {
        hit: 'points',
        i,
        data: v
      }
    },
    blurPoint: function () {
      this.mouse = {
        hit: false,
        i: -1,
        data: false
      }
    },
    hitClick: function () {
      let { mouse } = this, { hit, data } = mouse
      if (!hit || !data) return
      let v = JSON.parse(JSON.stringify(mouse))
      !!this.$props.click && this.$props.click(v)
    }
  },
  computed: {
    cName: function () {
      return 'easyMap ' + this.theme
    },
    position: function () {
      let b = this.baseMap
      let s = {
        width: b.w + 'px',
        height: b.h + 'px',
        top: b.t + 'px',
        left: b.l + 'px'
      }
      return s
    },
    background: function () {
      let b = this.cof.background, s = b.toString().substring(0, 3)
      return s === 'rgb' || s.charAt(0) === '#' ? b : 'url(' + b + ') no-repeat center / 100% 100%'
    },
    tooltipBgColor: function () {
      let { tooltip = {} } = this.cof, t = tooltip.backgroundColor
      return t ? { background: t, outlineColor: t, borderColor: t } : {}
    },
    triangleBgColor: function () {
      let { tooltip = {} } = this.cof, t = tooltip.backgroundColor
      return t ? { borderTopColor: t, borderBottomColor: t } : {}
    },
    tooltipColor: function () {
      let { tooltip = {} } = this.cof, t = tooltip.color
      return t ? { color: t } : {}
    }
  },
  watch: {
    int: function (v) {
      this.building()
    },
    'mouse.hit': function () {
      let { mouse } = this
      let v = JSON.parse(JSON.stringify(mouse))
      !!this.$props.hover && this.$props.hover(v)
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "./index.less";
</style>
