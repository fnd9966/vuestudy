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
import Stars from '../utils/canvas/Star'
import Moon from '../utils/canvas/Moon'
import Meteor from '../utils/canvas/Meteor'
export default {
  name: 'menuCanvas',
  props: {

  },
  data () {
    return {
      login: false
    }
  },
  mounted () {
    let canvas = this.$refs.canvas,
      ctx = canvas.getContext('2d'),
      width = window.innerWidth,
      height = window.innerHeight,
      moon = new Moon(ctx, width, height),
      stars = new Stars(ctx, width, height, 200),
      meteors = [],
      count = 0
    canvas.width = width
    canvas.height = height
    var sId
    const meteorGenerator = () => {
      let x = Math.random() * width + 800
      console.log(111)
      meteors.push(new Meteor(ctx, x, height))
      // 每隔随机时间，生成新流星
      sId = setTimeout(() => {
        meteorGenerator()
      }, Math.random() * 2000)
    }
    var id
    const frame = () => {
      count++
      count % 10 === 0 && stars.blink()
      moon.draw()
      stars.draw()
      // meteorGenerator()
      // console.log(11)

      meteors.forEach((meteor, index, arr) => {
        // 如果流星离开视野之内，销毁流星实例，回收内存
        if (meteor.flow()) {
          meteor.draw()
        } else {
          arr.splice(index, 1)
        }
      })
      id = requestAnimationFrame(frame)
    }
    meteorGenerator()
    // console.log(222)
    frame()
    // id = requestAnimationFrame(frame)
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // console.log('pause')
        window.cancelAnimationFrame(id)
        clearTimeout(sId)
      } else {
        // console.log('back')
        // id = requestAnimationFrame(frame)
        // meteorGenerator()
        sId = setTimeout(() => {
          meteorGenerator()
        }, Math.random() * 2000)
        frame()
      }
    })
  },
  components: {

  },
  methods: {

  }
}
</script>

<style scoped>
#menu {
  height: 100%;
  overflow: hidden;
  position: relative
}
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
  background: url('../assets/images/top_logo.png') no-repeat;
}
.nav {
  width: 200px;
  height: auto;
  position: absolute;
  z-index: 10000;
  top: 350px;
  left: 50%;
  margin-left: -100px;
}
.gv {
  text-decoration: none;
  background: url('../assets/images/nav_gv.png') repeat 0px 0px;
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
}
a.gv:hover {
  background: url('../assets/images/nav_gv.png') repeat 0px -43px;
  color:#1d7eb8;
  box-shadow: 0 0 6px #1d7eb8;
  transition-duration: 0.5s;
}
.city {
  width: 100%;
  height: 170px;
  position: fixed;
  bottom: 0px;
  z-index: 100;
  background: url('../assets/images/city.png') no-repeat;
  background-size: cover;
}
.moon {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 100px;
  top: 100px;
  background: url('../assets/images/moon.png') no-repeat;
  background-size: cover;
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
