export default class Stars {
  constructor (ctx, width, height, amout) {
    this.ctx = ctx
    this.width = width
    this.height = height
    this.amout = amout
    this.stars = this.getStart(amout)
  }

  // 返回一堆星星
  getStart (amout) {
    let stars = []
    while (amout--) {
      stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: Math.random() + 0.2
      })
    }
    return stars
  }

  // 画满天星
  draw () {
    let ctx = this.ctx
    ctx.save() // 保存canvas当前绘制，一般新绘制之前调用
    ctx.fillStyle = 'White'
    this.stars.forEach(star => {
      ctx.beginPath() // 开始绘制
      ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI)
      ctx.fill()
    })
    ctx.restore()
  }
  // 星星没隔10帧闪一下
  blink () {
    // console.log(1111)
    // map方法 找到合适的星星放进新数组 匹配
    this.stars = this.stars.map(star => {
      let sign = Math.random() > 0.5 ? 1 : -1
      star.r += sign * 0.2
      if (star.r < 0) {
        star.r = -star.r
      } else if (star.r > 1) {
        star.r -= 0.2
        // console.log(star.r)
      }
      return star
    })
  }
}
