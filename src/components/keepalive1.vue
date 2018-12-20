<template>
  <div class="user">
    <input type="checkbox" /><label>按钮a</label>
    <input type="checkbox" /><label>按钮b</label>
    <input type="checkbox" /><label>按钮c</label>
    <input value="first" />
    <kp />
  </div>
</template>
<script>
import Kp from './keepalive3.vue'
export default {
  name: 'keepAlive1',
  components: {
    Kp
  },
  props: {
  },
  data () {
    return {
      bb: 2
    }
  },
  methods: {},
  computed: {}
}
</script>
