<template>
  <div>
    <!-- <canvas ref="canvas"></canvas> -->
    <div ref="msgDiv">{{msg}}</div>
    <div v-if="msg1">Message got outside $nextTick: {{msg1}}</div>
    <div v-if="msg2">Message got inside $nextTick: {{msg2}}</div>
    <div v-if="msg3">Message got outside $nextTick: {{msg3}}</div>
    <button @click="changeMsg">
      Change the Message
    </button>
  </div>
</template>

<script>
export default {
  name: 'canvasArc',
  props: {

  },
  data () {
    return {
      msg: 'Hello Vue.',
      msg1: '',
      msg2: '',
      msg3: ''
    }
  },
  components: {

  },
  methods: {
    changeMsg () {
      this.msg = 'Hello world.'
      this.msg1 = this.$refs.msgDiv.innerHTML
      this.$nextTick(() => {
        this.msg2 = this.$refs.msgDiv.innerHTML
      })
      this.msg3 = this.$refs.msgDiv.innerHTML
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>

</style>
