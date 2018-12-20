<template>
  <div>
    <dragable :top='top'>
      <div class="boxing">
        <div class='title' alowdrag >
          <div class='closeBtn'></div>
        </div>
        <div class="boxBody">
          没有内容
          <div class="drag" alowdrag ></div>
        </div>
      </div>
    </dragable>
  </div>
</template>

<script>
import Dragable from '../dragable/index.vue'

export default {
  name: 'tableTest',
  components: {
    Dragable
  },
  data () {
    return {
      left: 100,
      top: 200
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
.boxing {
  width: 300px; height: 240px; background: #cecece; border: #aaa;
  .title {
    height: 40px; background: #bfc981; width: 100%;
    .closeBtn { height: 24px; width: 24px; float: right; margin: 8px; background: #d0d; cursor: pointer;}
  }
  .drag { height: 40px; width: 40px; background: #fff; margin: 30px auto;}
}
</style>
