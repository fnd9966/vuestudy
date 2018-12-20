<template>
  <div :style="{height: h + 'px', width: w + 'px', background: '#cecece', margin: '0 auto'}">
    <easy-table
      :int="int"
      theme="default"
      :d="d"
      :config="config"
      :clickEvent="tableClick"
    />
    {{t}}
  </div>
</template>

<script>
import EasyTable from '../easyTable/index.vue'
const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAbCAYAAABvCO8sAAABMUlEQVRIie3WMUuCQRzH8e/zJA+SkUWQOVhobrX1EmqsWRpqq0DozdQgiEttjtFcL6GlRu2hDAUXdXhA1J6n4cGW6p7/nSAEz2+9u9/nbjjuLGpBH0gzn6zYc4K+E4P/H0yoBi2gugc7y+qSlwFcPEEgAJUnPMhEYwC7adhfF2gq0LGhXJCVAJS3wzXG4HEOMkk5uJGEUs4QXHPgZEuOTXO6CauOAXiWh8UFfTCVgPO8JlhcgsOsPjbNURYKKQ3wsgi2ZQ7aVtghBgPJZYqIquIHeNUAfwb0M4Drhgb46sF9xxy8a4PraYAAVRe8iT7mTaDmquf8CvZGcPuuD968QX9sAALUW9AZyrH2EOof0fP+BEc+VJpysNKEsT8DCPDQDZ+eqDwP4LEr25gV/9piUDdfiK5FiII5O4IAAAAASUVORK5CYII='
export default {
  name: 'tableTest',
  components: {
    EasyTable
  },
  data () {
    return {
      d: [
        { a: 1, b: '#f00', c: icon, d: '1', e: 5 },
        { a: 2, b: '#0f0', c: icon, d: '4', e: '测试文字我很长很长很长很长很长很长很长很长很长很长很长很长谢谢' },
        { a: 3, b: '#00f', c: icon, d: '6', e: 5 },
        { a: 4, b: '#ff0', c: icon, d: '4', e: 5 },
        { a: 5, b: '#0ff', c: icon, d: '4', e: 5 },
        { a: 6, b: '#0f0', c: icon, d: '6', e: 5 },
        { a: 7, b: '#00f', c: icon, d: '4', e: 5 },
        { a: 8, b: '#ff0', c: icon, d: '6', e: 5 },
        { a: 9, b: '#0ff', c: icon, d: '4', e: 5 },
        { a: 0, b: '#0f0', c: icon, d: '8', e: 5 },
        { a: 1, b: '#00f', c: icon, d: '3', e: 7 },
        { a: 1, b: '#ff0', c: icon, d: '4', e: 5 },
        { a: 1, b: '#0ff', c: icon, d: '8', e: 5 },
        { a: 7, b: '#0f0', c: icon, d: '7', e: 5 },
        { a: 1, b: '#00f', c: icon, d: '6', e: 5 },
        { a: 7, b: '#ff0', c: icon, d: '9', e: 5 },
        { a: 1, b: '#0ff', c: icon, d: '7', e: 5 },
        { a: 7, b: '#0f0', c: icon, d: '7', e: 5 },
        { a: 1, b: '#00f', c: icon, d: '4', e: 5 },
        { a: 7, b: '#ff0', c: icon, d: '4', e: 5 },
        { a: 1, b: '#0ff', c: icon, d: '3', e: 5 },
        { a: 7, b: '#0f0', c: icon, d: '2', e: 5 },
        { a: 1, b: '#00f', c: icon, d: '4', e: 5 },
        { a: 7, b: '#ff0', c: icon, d: '1', e: 5 },
        { a: 1, b: '#0ff', c: icon, d: '2', e: 5 },
        { a: 7, b: '#0ff', c: icon, d: '1', e: 5 }
      ],
      config: {
        col: [
          { type: 'order', name: '序号', width: 0.1, key: 'a', align: 'center' },
          { type: 'icon', name: '省&市', width: 0.2, key: 'b', align: 'center' },
          { type: 'img', name: '图标', width: 0.2, key: 'c', align: 'center' },
          { type: 'text', name: '站名', width: 0.25, key: 'd', align: 'right' },
          { type: 'text', name: '战码', width: 0.25, key: 'e', align: 'left' }
        ],
        titleH: 40,
        listH: 30,
        order: [0, 3, 4],
        tableBorder: true,
        special: {
          e: {
            min: 6, target: 'tr', style: { color: 'yellow' }
          },
          d: {
            min: 5, max: 7, style: { color: 'red' }
          }
        },
        autoScroll: true,
        scrollBar: true,
        scrollSpeed: 20
      },
      t: 0,
      w: 800,
      h: 500,
      int: 1
    }
  },
  mounted () {
    setTimeout(() => {
      this.w = 600
      this.int++
    }, 2000)
    setTimeout(() => {
      this.h = 600
      this.int++
    }, 4000)
  },
  methods: {
    tableClick: function (v) {
      this.t = '站名：' + v.d
    }
  }
}
</script>
