;(() => {
  function loadScript(url, callback) {
    var script = document.createElement('script')
    var fn = callback || function () {}

    script.type = 'text/javascript'
    script.defer = true

    //IE
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null
          fn()
        }
      }
    } else {
      //其他浏览器
      script.onload = function () {
        fn()
      }
    }
    script.src = url
    document.getElementsByTagName('head')[0].appendChild(script)
  }
  // loadScript(
  //   'https://cdn.bootcdn.net/ajax/libs/vConsole/3.15.1/vconsole.min.js',
  //   () => {
  //     var vConsole = new window.VConsole()
  //   }
  // )
  loadScript(
    'https://cdn.bootcdn.net/ajax/libs/particlesjs/2.2.3/particles.min.js',
    () => {
      window.onload = function () {
        const list = document.getElementsByClassName('login-background-canvas')
        if (list.length > 0) {
          Particles.init({
            selector: '.login-background-canvas',
            // 设置粒子颜色
            color: '#8ACAFF',
            // 开启点连线
            connectParticles: true,
            // 设置最大粒子数
            maxParticles: 40,
          })
        }
      }
    }
  )
})()
