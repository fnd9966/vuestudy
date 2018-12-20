import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['@/views/tz/notice-fnd.vue'], resolve)
    },
    {
      path: '/test',
      component: resolve =>
        require(['@/components/dragable/index.vue'], resolve)
    },
    {
      path: '/mock',
      component: resolve => require(['@/views/test/mock.vue'], resolve)
    },
    {
      path: '/test1',
      component: resolve => require(['@/components/Upload/Upload.vue'], resolve)
    },
    {
      path: '/f',
      component: resolve => require(['@/components/a.vue'], resolve)
    },
    {
      path: '/keepalive1',
      component: res => {
        require(['@/components/keepalive1.vue'], res)
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/keepalive2',
      name: 'keepalive2',
      component: res => require(['@/components/keepalive2.vue'], res),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/keepalive3',
      name: 'keepalive3',
      component: res => require(['@/components/keepalive2.vue'], res),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/table',
      name: '表格',
      component: res => require(['@/components/demo/page_table.vue'], res)
    },
    {
      path: '/img',
      name: '雷达图&包括|图片|播放轴&可分开单独使用',
      component: res => require(['@/components/demo/page_img.vue'], res)
    },
    {
      path: '/map',
      name: '概化图&点线面等',
      component: res => require(['@/components/demo/page_map.vue'], res)
    },
    {
      path: '/drag',
      name: '拖拽',
      component: res => require(['@/components/demo/page_drag.vue'], res)
    },
    {
      path: '/tooltip',
      name: 'tooltip',
      component: res => require(['@/components/demo/page_tooltip.vue'], res)
    },
    {
      path: '/t/:id',
      component: resolve => require(['@/components/HelloWorld.vue'], resolve),
      props: {
        msg: 'hello'
      },
      children: [
        {
          path: 't',
          components: {
            default: resolve => require(['@/components/a.vue'], resolve),
            a: resolve => require(['@/components/b.vue'], resolve),
            b: resolve => require(['@/components/c.vue'], resolve)
          }
        }
      ],
      beforeEnter: (to, from, next) => {
        to && from && next()
      },
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    }
  ]
})
