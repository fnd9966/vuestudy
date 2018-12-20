<template>
  <div class="notice_wrapper" v-bind:style="{width: notice_wh.w + 'px', height: notice_wh.h + 'px'}">
    <notice-content v-bind:notice-wh="notice_wh"
                    v-bind:list-data="listData"
                    v-on:get-message-by-search="getMessage"
                    v-on:handle-img-swiper="handleImgSwiper"
                    v-bind:loading="loading"></notice-content>
    <photo-swipe-vue v-bind:slides="imgSwipe" ref="photo_view" ></photo-swipe-vue>
    <spinner v-bind:show="loading" text="加载中..."></spinner>
    <iframe frameborder="0" v-bind:src="notice.pdfSrc" v-bind:class="iframeName" name="pdfContainer" v-if="!!notice.pdf"></iframe>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NoticeContent from './notice-content'
import T from '../../utils/common'
import PhotoSwipeVue from '../../components/PhotoSwipeVue/PhotoSwipeVue'
import Spinner from '../../components/Spinner/Spinner'

let BU
let baseUrl = location.hostname === 'localhost' ? 'http://www.erhai.gov.cn:3086/' : '/'
let pageW = document.documentElement.clientWidth || document.body.clientWidth
let pageH = document.documentElement.clientHeight - 44 || document.body.clientHeight - 44
export default {
  name: 'NoticeFnd',
  data () {
    return {
      notice_wh: {
        h: pageH,
        w: pageW
      },
      listData: [],
      loading: false,
      imgSwipe: [],
      iframeName: navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 'pdfContainer_ios' : 'pdfContainer'
    }
  },
  computed: {
    ...mapState([
      'notice'
    ])
  },
  mounted () {
    console.log(this.$store.state)
    this.getMessage()
    // this.pdfIframeOpen()
    // this.pdfIframeClose()
  },
  beforeMount () {
    BU = baseUrl || '/'
  },
  methods: {
    handleImgSwiper: function (v, i) {
      let f = v.filepath.split('.')
      let t = f[f.length - 1]
      let src = BU + v.filepath
      if (['png', 'gif', 'jpg', 'bmp', 'jpeg'].indexOf(t) > -1) {
        this.loading = true
        let img = new Image()
        img.onload = () => {
          let imgItem = {
            src: src,
            w: img.width,
            h: img.height,
            title: v.filetile
          }
          this.imgSwipe = [imgItem]
          this.$refs.photo_view.openPhotoSwipe(this.imgSwipe)
          this.loading = false
        }
        img.src = src
      } else if (t === 'pdf') {
        console.log(src)
        this.notice.pdfSrc = './pdfjs/web/viewer.html?file=' + src
        this.notice.pdf = true
      } else {
        if (window.confirm('确定下载？')) {
          let dom = this.$refs['download_' + i]
          !!dom && dom.click()
        } else {
          return false
        }
      }
    },
    getMessage: function (obj) {
      console.log(obj)
      let params = obj || {}
      let _this = this
      params.pagesize = 10000
      this.$ajax.tz({
        params: params
      })
        .then(function (response) {
          // console.log(response)
          let data = response.data.rows
          if (T.isArray(data) && data.length > 0) {
            _this.listData = data
          } else {
            _this.listData = []
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    }
  },
  components: {
    NoticeContent,
    PhotoSwipeVue,
    Spinner
  }
}
</script>

<style scoped>

</style>
