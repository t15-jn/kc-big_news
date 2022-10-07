$(function () {
  let layer = layui.layer
  let form = layui.form

  form.verify({
    nickname: function (value) {
      if (value.length > 6) return '昵称必须是 1-6 位的非空字符!'
    }
  })


  //获取用户相关信息
  const userInfo = () => {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success(res) {
        if(res.code !== 0) return layer.msg('获取用户信息失败!')
        // console.log(res)
        form.val('userForm',res.data)
      }
    })
  }
  userInfo()

  //重置按钮点击 事件
  $('#btnReset').on('click', function (e) {
    e.preventDefault()
    userInfo()
  })

  //表单提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'PUT',
      url: '/my/userinfo',
      data: form.val('userForm'),
      success(res) {
        if (res.code !== 0) return layer.msg('获取数据失败' + res.message)
        layer.msg('获取数据成功!')
        window.parent. getUserInfo()
      }
    })
  })
})