/*
 * 表格组件
 * d: 数据
 * int: 更改值 重新初始化
 * config: 配置项
 * click: click 事件
 * theme: 皮肤
 */

<template>
  <div :class="cName" ref="box" @mouseover="stopScroll" @mouseout="beginScroll">
    <div :style="{height: cof.titleH + 'px', overflow: 'hidden'}">
      <table :border="cof.tableBorder ? true : false">
        <tr class="tableTh" :style="{height: cof.titleH + 'px'}">
          <td v-for="(v, i) in cof.col" :key="'th' + i" :width="i == cof.col.length - 1 ? '' : v.width * 100 + '%'">
            <div v-for="(c, n) in v.name" :key="'thl' + n" v-text="c"/>
            <div :class="order.col == i ? 'order order' + order.s : 'order'" v-if="cof.order.indexOf(i) === -1 ? false : true" @click="changeOrder(i)" :style="{height: cof.titleH + 'px'}">
              <div class="orderAsc"></div>
              <div class="orderDesc"></div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="tableBody" :style="{height: 'calc(100% - ' + cof.titleH + 'px)'}" ref='out'>
      <div class="tableBodyA" ref='wrap' :style="{width: cof.scrollBar ? '100%' : 'calc(100% + 200px)'}">
        <table :border="cof.tableBorder ? true : false" v-for="(p, m) in copy" :key="m" ref='inner' :style="{width: boxWidth}">
          <tr v-for="(v, i) in delData" :key="'tr' + i" :style="v.__tr__" @click="trClick(v)" :class="!!clickEvent ? 'hoverLine' : ''">
            <td :class="'align' + c.align" v-for="(c, n) in cof.col" :key="n" :width="n == cof.col.length - 1 ? '' : c.width * 100 + '%'" :style="v[ c.key + '__td__']">
              <img v-if="c.type === 'img'" :src="v[c.key]" />
              <i class="tdIcon" v-else-if="c.type === 'icon'" :style="{backgroundColor: v[c.key]}"/>
              <span v-else v-text="c.type === 'order' ? i + 1 : v[c.key]"/>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'easyTable',
  props: {
    theme: {
      type: String,
      default: ''
    },
    d: Array,
    config: Object,
    clickEvent: Function,
    int: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      boxWidth: '100%',
      copy: [1],
      order: {
        col: -1,
        s: 0
      },
      opt: {
        timer: null,
        hover: false,
        scroll: false
      },
      defaultConfig: {
        col: [], // {type: 'text|icon|img|order', name: 'String.split(&)', width: '0 - 1', key: 'data[key]', align: 'textAlign' }
        titleH: 30,
        listH: 30,
        order: [-1],
        tableBorder: true,
        special: false,
        autoScroll: false,
        scrollBar: false,
        scrollSpeed: 20
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.setSize()
      window.addEventListener('resize', this.initEvent)
    })
  },
  updated: function () {
    this.$nextTick(function () {
      this.autoScroll()
    })
  },
  beforeDestroy: function () {
    this.stopScroll()
    window.removeEventListener('resize', this.initEvent)
  },
  methods: {
    initEvent: function () {
      this.setSize()
    },
    setSize: function () {
      let w = this.$refs.box.offsetWidth
      this.boxWidth = w + 'px'
    },
    changeOrder: function (i) {
      let order = this.order, { col, s } = order
      if (col === i) {
        s = [0, 1, -1][s + 1]
      } else {
        col = i
        s = 1
      }
      this.order = {
        col,
        s
      }
    },
    autoScroll: function () {
      let { out, inner, wrap } = this.$refs
      if (!out || !inner[0] || !wrap) return false
      let oh = out.offsetHeight, ih = inner[0].offsetHeight, opt = this.opt
      if (oh < ih && !opt.hover && this.$props.config.autoScroll) {
        if (this.copy.length === 1) this.copy.push(2)
        let speed = Math.ceil(1000 / this.cof.scrollSpeed)
        clearInterval(opt.timer)
        opt.timer = setInterval(() => {
          if (wrap.scrollTop < ih) {
            wrap.scrollTop = wrap.scrollTop + 1
            return
          }
          wrap.scrollTop = 0
        }, speed)
      }
    },
    stopScroll: function () {
      let opt = this.opt
      clearInterval(opt.timer)
      opt.timer = null
      opt.hover = true
      this.copy.splice(1)
    },
    beginScroll: function () {
      this.opt.hover = false
      this.autoScroll()
    },
    trClick: function (v) {
      !!this.clickEvent && this.clickEvent(v)
    },
    sort: function (v, ord, key) {
      let d = JSON.parse(JSON.stringify(v))
      let f = [2, 0]
      if (ord === 'desc') f.reverse()
      d.sort((a, b) => {
        let m = a[key] === void 0 ? a : a[key],
          n = b[key] === void 0 ? b : b[key],
          c = m > n ? f[0] : f[1]
        return c - 1
      })
      return d
    }
  },
  computed: {
    cName: function () {
      return 'easyTable ' + this.theme
    },
    cof: function () {
      let cof = Object.assign({}, this.defaultConfig, this.$props.config)
      cof.col.map((v, i) => {
        if (typeof v.name === 'string') cof.col[i].name = v.name.split('&')
      })
      return cof
    },
    delData: function () {
      let s = this.$props.config.special, order = this.order
      if (s) {
        this.d.map((v, i) => {
          for (let p in s) {
            if (v[p] === void 0) continue
            let ret = false, { min, max } = s[p]
            if (min !== void 0 && max !== void 0) {
              if (v[p] >= min && v[p] <= max) ret = true
            } else if ((min !== void 0 && v[p] >= min) || (max !== void 0 && v[p] <= max)) {
              ret = true
            }
            if (ret) v[s[p].target === 'tr' ? '__tr__' : p + '__td__'] = s[p].style || {}
          }
        })
      }
      if (order.s === 0 || order.col === -1) return this.d
      let key = this.$props.config.col[order.col].key
      if (!key) return this.d
      let ord = order.s === 1 ? 'asc' : 'desc'
      let d = this.sort(this.d, ord, key)
      return d
    }
  },
  filters: {
    splitName: function (v) {
      return v.split('&')
    }
  },
  watch: {
    int: function (v) {
      this.setSize()
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "./index.less";
</style>
