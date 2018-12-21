export default class Moon {
  /* 构造函数 */
  constructor (ctx, width, height) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  draw () {
    let ctx = this.ctx
    let gradient = ctx.createRadialGradient(100, 100, 60, 200, 200, 600)
    gradient.addColorStop(0.4, 'rgb(20,20,30)')
    gradient.addColorStop(1, 'rgb(0,0,10)')
    // 保存之前状态
    ctx.save()
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.width, this.height)
    // 还原之前状态
    ctx.restore()
  }
}
