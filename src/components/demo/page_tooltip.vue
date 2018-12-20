<template>
  <div>
    <div class="boxing">
      <div class="boxBody">
        <span v-tooltip="'longlonglonglonglonglong'">auto</span>
        <span v-tooltip.top="'top'">top</span>
        <span v-tooltip.bottom="'bottom'">bottom</span>
        <span v-tooltip.left="'left'">left</span>
        <span v-tooltip.right="'right'">right</span>
        <span v-tooltip.click="'click'">click</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'pageTooltip',
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
  .boxBody {
    text-align: left;
    span { margin: 10px; }
  }
}
</style>
