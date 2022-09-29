$(function () {
  // 点击 去注册 事件
  $('#goLogin').on('click', function () {
    $('.reg-wrap').hide()
    $('.login-wrap').show()
  })
  //点击 去登录 事件
  $('#goReg').on('click', function () {
    $('.login-wrap').hide()
    $('.reg-wrap').show()
  })

  //
  let form = layui.form
  let layer = layui.layer

  form.verify({
    pass: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      if ($('.login-wrap [name="password"]').val() !== value) {
        return '两次密码不一致,请再次输入'
      }
    }
  })


 
  $('#form-login').on('submit', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      
      /*  data: JSON.stringify({
         urername: $('#form-login [name="username"]').val(),
         password: $('#form-login [name="password"]').val(),
         repassword: $('#form-login [name="repassword"]').val(),
       }), */
      
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)
        $('#goReg')[0].click()
        layer.msg('注册成功')
      }
    })
  })


  $('#form-reg').on('submit', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/api/login',
      
      /*  data: JSON.stringify({
         urername: $('#form-login [name="username"]').val(),
         password: $('#form-login [name="password"]').val(),
         repassword: $('#form-login [name="repassword"]').val(),
       }), */
      
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)
       localStorage.setItem('big_news_token',res.token)

        location.href = '/index.html'
      }
    })
  })
})