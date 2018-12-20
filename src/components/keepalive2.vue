<template>
  <div class="user">
    <input type="checkbox" /><label>按钮1</label>
    <input type="checkbox" /><label>按钮2</label>
    <input type="checkbox" /><label>按钮3</label>
    <input value="second" />
    <kp />
  </div>
</template>
<script>
import Kp from './keepalive3.vue'
export default {
  name: 'keepAlive2',
  components: {
    Kp
  },
  props: {

  },
  data () {
    return {}
  },
  mounted: function () {
  },
  methods: {},
  computed: {}
}
</script>
