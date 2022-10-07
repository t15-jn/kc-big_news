$(function () {
  const layer = layui.layer
  const form = layui.form

  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  //上传按钮
  $('#btnChoose').on('click', function () {
    file.click()
  })

  //file 的 change 事件
  $('#file').on('change', function (e) {
    console.dir(e)
    let file = e.target.files[0]
    if (e.target.files.length === 0) return layer.msg('请选择图片!')
    let newImgURL = URL.createObjectURL(file)
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })


  //确定按钮添加点击事件
  $('#btnConfirm').on('click', function () {
    //1.拿到裁剪过后的图片
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    //2.发起请求,把图片上传到服务器
    $.ajax({
      method:'PATCH',
      url:'/my/update/avatar',
      data: {
        avatar:dataURL
      },
      success(res) {
        console.log(res)
        if (res.code !== 0) return layer.msg('上传头像失败!')
        window.parent.getUserInfo()
        layer.msg('上传头像成功!')
      }
    })
  })

})