/* eslint-disable */

// 叉乘 { x, y }
const crossMul = (v1, v2) => v1.x * v2.y - v1.y * v2.x

// 线相交
const checkCross = (p1, p2, p3, p4) => {
  let v1 = { x: p1.x - p3.x, y: p1.y - p3.y },
    v2 = { x: p2.x - p3.x, y: p2.y - p3.y },
    v3 = { x: p4.x - p3.x, y: p4.y - p3.y },
    v = crossMul(v1, v3) * crossMul(v2, v3)

  v1 = { x: p3.x - p1.x, y: p3.y - p1.y }
  v2 = { x: p4.x - p1.x, y: p4.y - p1.y }
  v3 = { x: p2.x - p1.x, y: p2.y - p1.y }

  return v <= 0 && crossMul(v1, v3) * crossMul(v2, v3) <= 0 ? true : false
}

// point in area 奇内 偶外
export const hitArea = (point, polygon) => {
  let p1 = point,
    p2 = { x: -100, y: point.y },
    p3,
    p4,
    count = 0

  for (let i = 0, len = polygon.length - 1; i < len; i++) {
    p3 = polygon[i]
    p4 = polygon[i + 1]
    if (checkCross(p1, p2, p3, p4)) count++
  }

  p3 = polygon[polygon.length - 1]
  p4 = polygon[0]
  if (checkCross(p1, p2, p3, p4)) count++

  return count % 2 == 0 ? false : true
}

/**
 * @ point hit line
 * @param lp 点坐标
 * @param _l_ll 线数据
 * @param _l_d 命中误差
 * @param loop 是否封闭
 * @param returnI 查询击中线段序列
 */

export const hitLine = (lp, _l_ll, _l_d, loop, returnI) => {
  let hit = false,
    index = -1

  if (_l_ll.length < 2) return hit

  if (!!loop) _l_ll.push(_l_ll[0])

  for (let i = 0, _l_len = _l_ll.length - 1; i < _l_len; i++) {
    let _l_a = _l_ll[i],
      _l_b = _l_ll[i + 1]

    if (
      lp.x < Math.max(_l_a.x, _l_b.x) + _l_d &&
      lp.x > Math.min(_l_a.x, _l_b.x) - _l_d &&
      lp.y < Math.max(_l_a.y, _l_b.y) + _l_d &&
      lp.y > Math.min(_l_a.y, _l_b.y) - _l_d
    ) {
      if (_l_a.x == _l_b.x) {
        if (Math.abs(lp.x - _l_a.x) <= _l_d) {
          hit = true
          index = i + 1
          break
        }
      } else if (_l_a.y == _l_b.y) {
        if (Math.abs(lp.y - _l_a.y) <= _l_d) {
          hit = true
          index = i + 1
          break
        }
      } else {
        let _la = _l_b.y - _l_a.y,
          _lb = _l_a.x - _l_b.x,
          _lc = _l_a.y * _l_b.x - _l_a.x * _l_b.y,
          _l_calc_d = Math.abs(
            (_la * lp.x + _lb * lp.y + _lc) /
              Math.sqrt(Math.pow(_la, 2) + Math.pow(_lb, 2))
          )

        if (_l_calc_d <= _l_d) {
          hit = true
          index = i + 1
          break
        }
      }
    }
  }

  if (!!returnI) return { hit: hit, index: index }
  return hit
}
