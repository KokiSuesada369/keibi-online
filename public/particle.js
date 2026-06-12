(function () {
  var c = document.getElementById('particle-canvas')
  if (!c) return
  var x = c.getContext('2d')
  var h = c.parentElement
  function r() { c.width = h.offsetWidth; c.height = h.offsetHeight }
  r()
  window.addEventListener('resize', r)
  var ps = []
  for (var i = 0; i < 20; i++) {
    ps.push({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      a: Math.random() * 0.5 + 0.1,
    })
  }
  function draw() {
    x.clearRect(0, 0, c.width, c.height)
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i]
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = c.width
      if (p.x > c.width) p.x = 0
      if (p.y < 0) p.y = c.height
      if (p.y > c.height) p.y = 0
      x.beginPath()
      x.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      x.fillStyle = 'rgba(255,255,255,' + p.a + ')'
      x.fill()
      for (var j = i + 1; j < ps.length; j++) {
        var q = ps[j]
        var dx = p.x - q.x, dy = p.y - q.y
        var d = Math.sqrt(dx * dx + dy * dy)
        if (d < 80) {
          x.beginPath()
          x.moveTo(p.x, p.y)
          x.lineTo(q.x, q.y)
          x.strokeStyle = 'rgba(255,255,255,' + (0.08 * (1 - d / 80)) + ')'
          x.lineWidth = 0.5
          x.stroke()
        }
      }
    }
    requestAnimationFrame(draw)
  }
  draw()
})()
