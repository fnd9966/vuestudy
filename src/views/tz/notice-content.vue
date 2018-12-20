<template>
  <div class="tz_content_wrapper">
    <template v-if="index == 0">
      <div class="top_top" v-bind:style="{display: onlyC ? 'none' : 'block'}">
        <i v-on:touchstart="e => backMenu(e)"></i>通知
      </div>
      <div class="top_bar">
        <div class="search_wrap">
          <input type="text" ref="search" placeholder="请输入标题名称">
          <span v-on:click="search">确认</span>
        </div>
      </div>
      <div class="tz_content">
        <div v-bind:style="{width: '100%', height: notice_wh.h - 108 + tH + 'px', overflowX:'hidden',overflowY:'auto'}">
          <tpl-list v-on:listClick="flClick"
                    v-bind:data="propListData"
                    v-bind:config="flListConfig"
          ></tpl-list>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-bind:style="{width: '100%', height: notice_wh.height}">
        <div class="top_top" v-bind:style="{display: onlyC ? 'none' : 'block'}">
          <i v-on:click.stop="backTable"></i>
          通知
        </div>
        <div class="_closeBtn" v-on:click.stop="backTable" v-bind:style="{display: onlyC ? 'none' : 'block'}"></div>
        <div v-bind:style="{width: '100%', height: notice_wh.height - 36 + tH, overflowX: 'hidden', overflowY: 'auto'}">
          <p class="file_title">{{detailMassage.title}}</p>
          <div class="file_time">{{detailMassage.createdate}}</div>
          <p class="file_content">{{detailMassage.newscontent}}</p>
          <div class="file_download">
            <div v-for="(item, index) of files" v-bind:key="item.id">
              <i></i>
              <span v-on:click="downLoad(item, index)">{{item.filetile}}</span>
              <a v-bind:ref="'download_' + index"
                 style="{display: 'none}'"
                 v-bind:href="'/' + item.filepath"
                 download=""></a>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import TplList from '../../components/TplList/TplList'
export default {
  name: 'NoticeContent',
  props: ['noticeWh', 'listData', 'loading'],
  data () {
    return {
      onlyC: false,
      notice_wh: this.noticeWh,
      tH: this.onlyC ? 36 : 0,
      flListConfig: {
        tplType: 'file',
        title: {
          key: 'title',
          style: { color: '#444', fontSize: '18px' }
        },
        time: {
          key: 'createdate',
          style: { color: '#999', fontSize: '14px' }
        },
        rightImg: false,
        img: null
      },
      detailMassage: {},
      files: [],
      index: 0,
      $_loading: this.loading,
      imgSwipe: [], // 附件展示的图片
      imgShow: false
    }
  },
  computed: {
    propListData: function () {
      let arr = []
      let listLength = this.listData.length
      for (let i = 0; i < listLength; i++) {
        arr.push(this.listData[i])
      }
      return arr
    }
  },
  mounted () {
  },
  components: {
    TplList
  },
  methods: {
    /* 返回上一级 */
    backTable: function () {
      this.index = 0
    },
    /* 下载 */
    downLoad: function (v, i) {
      this.$emit('handle-img-swiper', v, i)
    },
    /* 返回 */
    backMenu: function () {
      // console.log(111)
      // console.log(this.$refs)
      // console.log(this.$router)
      /* 路由跳转 */
      // this.$router.push({
      //   path: '/test',
      //   query: {
      //     id: 1
      //   }
      // })
      this.$router.replace({ path: '/test' })
    },

    /* 搜索确认 */
    search: function () {
      let text = this.$refs.search.value.replace(/(^\s*)|(\s*$)/g, '')
      // this.getMassage({title: text});
      this.$emit('get-message-by-search', { title: text })
    },
    /* 点击事件 */
    flClick: function (data) {
      let _this = this
      this.$ajax.tz({
        params: {
          sign: 1,
          id: data.id
        }
      })
        .then(function (result) {
          let file = result.data.rows
          if (file.length > 0) {
            _this.detailMassage = file[0]
            _this.files = JSON.parse(file[0].upload_path)
            _this.index = 1
          } else {
            _this.detailMassage = {}
            _this.files = []
          }
        })
    }
  }
}
</script>

<style scoped>
  @import './css/tz.css';
</style>
