<template>
  <div id="menu">
    <canvas ref="canvas" class="canvas"></canvas>
    <transition name="fade-out">
      <div v-show="!login">
        <div class="logo-bg"></div>
        <div class="nav">
          <a class="gv" href="javascript:;">用户登入</a>
          <a class="gv" href="javascript:;">管理员登入</a>
        </div>
      </div>
    </transition>
    <div class="city"></div>
    <div class="moon"></div>
  </div>
</template>

<script>
import Stars from '../../utils/canvas/Star'
import Moon from '../../utils/canvas/Moon'
import Meteor from '../../utils/canvas/Meteor'
export default {
  name: 'menuCanvas',
  props: {

  },
  data () {
    return {
      login: false,
      c: {
        w: window.innerWidth,
        h: window.innerHeight,
        sId: null,
        id: null
      },
      timer: false,
      count: 0,
      moon: null,
      stars: null,
      meteors: []
    }
  },
  mounted () {
    // this.draw()
    this.$nextTick(function () {
      this.initEvent()
      window.addEventListener('resize', this.initEvent)
    })
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // console.log('pause')
        window.cancelAnimationFrame(this.c.id)
        clearTimeout(this.c.sId)
      } else {
        // console.log('back')
        // id = requestAnimationFrame(frame)
        this.meteorGenerator()
        this.frame()
      }
    })
  },
  components: {
  },
  watch: {
  },
  beforeDestroy: function () {
    clearInterval(this.c.sId)
    window.removeEventListener('resize', this.initEvent)
  },
  methods: {
    initEvent: function () {
      this.setSize()
      this.draw()
      // console.log('bianhua')
    },
    setSize: function () {
      let canvas = this.$refs.canvas, w = window.innerWidth, h = window.innerHeight
      // console.log(w)
      if (canvas) {
        this.c.w = w
        this.c.h = h
      }
    },
    draw: function () {
      let { w, h } = this.c
      let canvas = this.$refs.canvas
      if (!canvas) return
      // console.log(w)
      canvas.width = w
      canvas.height = h
      let ctx = canvas.getContext('2d')
      this.moon = new Moon(ctx, this.c.w, this.c.h)
      this.stars = new Stars(ctx, this.c.w, this.c.h, 200)
      // var sId
      // const meteorGenerator = () => {
      //   let x = Math.random() * this.width + 800
      //   // console.log(111)
      //   meteors.push(new Meteor(ctx, x, this.height))
      //   // 每隔随机时间，生成新流星
      //   sId = setTimeout(() => {
      //     meteorGenerator()
      //   }, Math.random() * 2000)
      // }
      // var id
      // const frame = () => {
      //   let count = this.count
      //   count++
      //   count % 10 === 0 && stars.blink()
      //   moon.draw()
      //   stars.draw()
      //   // meteorGenerator()
      //   // console.log(11)

      //   meteors.forEach((meteor, index, arr) => {
      //     // 如果流星离开视野之内，销毁流星实例，回收内存
      //     if (meteor.flow()) {
      //       meteor.draw()
      //     } else {
      //       arr.splice(index, 1)
      //     }
      //   })
      //   id = requestAnimationFrame(frame)
      // }
      console.log(this.c.id)
      window.cancelAnimationFrame(this.c.id)
      clearTimeout(this.c.sId)
      this.meteorGenerator()
      // console.log(222)
      this.frame()
      // id = requestAnimationFrame(frame)
    },
    meteorGenerator: function () {
      let canvas = this.$refs.canvas
      let ctx = canvas.getContext('2d')
      let x = Math.random() * this.c.w + 800
      // console.log(111)
      this.meteors.push(new Meteor(ctx, x, this.c.h))
      let that = this
      // 每隔随机时间，生成新流星
      this.c.sId = setTimeout(() => {
        that.meteorGenerator()
      }, Math.random() * 2000)
    },
    frame: function () {
      // let count = this.count
      // let moon = this.moon
      // let stars = this.stars
      // let meteors = this.meteors
      // let id = this.c.id
      let that = this
      // console.log(this.count)
      this.count++
      this.count % 10 === 0 && this.stars.blink()
      // console.log('重新绘制')
      this.moon.draw()
      this.stars.draw()
      // meteorGenerator()
      // console.log(11)

      this.meteors.forEach((meteor, index, arr) => {
        // 如果流星离开视野之内，销毁流星实例，回收内存
        if (meteor.flow()) {
          meteor.draw()
          // console.log('star')
        } else {
          arr.splice(index, 1)
        }
      })
      that.c.id = requestAnimationFrame(that.frame)
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@baseUrl: '../../assets/images/';
#menu {
  height: 100%;
  overflow: hidden;
  position: relative;

  .canvas {
    position: fixed;
    z-index: -1;
  }

  .logo-bg {
    width: 800px;
    height: 200px;
    position: absolute;
    z-index: 10000;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: url('@{baseUrl}top_logo.png') no-repeat;
  }

  .nav {
    width: 200px;
    height: auto;
    position: absolute;
    z-index: 10000;
    top: 350px;
    left: 50%;
    margin-left: -100px;

    .gv {
      text-decoration: none;
      background: url('@{baseUrl}nav_gv.png') repeat 0px 0px;
      width: 130px;
      height: 43px;
      display: block;
      text-align: center;
      line-height: 43px;
      cursor: pointer;
      float: left;
      margin: 10px 2px 10px 2px;
      font: 18px/43px 'microsoft yahei';
      color: #066197;

      &:hover {
        background: url('@{baseUrl}nav_gv.png') repeat 0px -43px;
        color:#1d7eb8;
        box-shadow: 0 0 6px #1d7eb8;
        transition-duration: 0.5s;
      }
    }
  }

  .city {
    width: 100%;
    height: 170px;
    position: fixed;
    bottom: 0px;
    z-index: 100;
    background: url('@{baseUrl}city.png') no-repeat;
    background-size: cover;
  }

  .moon {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 100px;
    top: 100px;
    background: url('@{baseUrl}moon.png') no-repeat;
    background-size: cover;
  }
}
.fade-out-enter-active, .fade-out-leave-active {
  transition: all .5s
}
.fade-out-enter, .fade-out-leave-active {
  opacity: 0;
  transform: translateX(-400px);
}

.fade-in-enter-active, .fade-in-leave-active {
  transition: all .5s
}
.fade-in-enter, .fade-in-leave-active {
  opacity: 0;
  transform: translateX(400px);
}
</style>
