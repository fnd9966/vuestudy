<template>
  <div class="ppap">
    <img-view
      :int="int"
      theme="default"
      :d="d"
      :config="config"
    />
  </div>
</template>

<script>
import ImgView from '../imgView/index.vue'

const radar = 'http://47.95.1.229:8069/webapi/api/v2/images/realtime-custom?category=radar/huanan&name=华南雷达拼图&time=[2018-12-11T04:59:24,2018-12-13T08:59:24]'

export default {
  name: 'tableTest',
  components: {
    ImgView
  },
  data () {
    return {
      int: 1,
      d: [],
      config: {
        playConfig: {
          backgroundColor: '#f4f4f4',
          color: '#4987c5',
          barColor: '#32608f',
          label: 'time', // time text
          tick: true,
          speed: 500,
          interval: 100
        }
      }
    }
  },
  mounted () {
    this.$ajax.get(radar).then(ret => {
      let data = ret.data
      this.d = data
      this.int++
    }
    ).catch(ret => console.log(ret))
  }
}
</script>

<style type="text/less" lang="less" scoped>
.ppap { height: 80%; width: 90%; border: 1px solid #999; margin: 0 auto;}
</style>
