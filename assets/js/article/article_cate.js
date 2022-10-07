$(function () {
  const layer = layui.layer
  const form = layui.form


  loadCateList()
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success(res) {
        if (res.code !== 0) return layer.msg(`获取文章列表失败!${res.message}`)
        // console.log(res)

        //模板引擎
        const htmlStr = template('tpl_list', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  //编辑按钮点击事件
  let index = null
  $('#btnAdd').on('click', function () {
    //弹出层
    index = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加分类名称',
      content: $('#addDialog').html()
    })
  })


  let isEdit = false //用来记录当前是什么状态
  //通过代理 给添加分类的表单 添加提交事件
  $('body').on('submit', '#addForm', function (e) {
    e.preventDefault()
    if (isEdit) {
      $.ajax({
        method: 'PUT',
        url: '/my/cate/info',
        data: $(this).serialize(),
        success(res) {
          if (res.code !== 0) return layer.msg('修改分类失败' + res.message)
          layer.msg('修改分类成功!')
          //重新刷新列表
          loadCateList()
        }
      })
    } else {
      $.ajax({
        method: 'POST',
        url: '/my/cate/add',
        data: $(this).serialize(),
        success(res) {
          if (res.code !== 0) return layer.msg('添加分类失败!' + res.message)
          layer.msg('添加分类成功!')
          //重新刷新列表
          loadCateList()
        }
      })
    }
    isEdit = false

    //关闭弹出层
    layer.close(index)


  })

  //编辑按钮 点击事件
  $('tbody').on('click', '.btnEdit', function () {
    isEdit = true
    // console.log('11'+ $(this).attr('data-id'))
    //弹出层
    index = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加分类名称',
      content: $('#addDialog').html()
    })
    //回显表单
    let id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: `/my/cate/info?id=${id}`,
      success(res) {
        if (res.code !== 0) return layer.msg('数据获取失败!')
        //快速为表单进行赋值
        form.val('addFormFilter', res.data)
      }
    })
  })

  //删除
  $('tbody').on('click', '.btnDel', function () {
    const result = confirm('确定要删除吗?')
    const id = $(this).attr('data-id')
    if (result) {
      $.ajax({
        method: 'DELETE',
        url: `/my/cate/del?id=${id}`,
        success(res) {
          if (res.code !== 0) return layer.msg('删除失败!' + res.message)
          loadCateList()
        }
      })
    }
  })
})