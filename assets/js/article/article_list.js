$(function () {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage

  //接口的参数
  const q = {
    pagenum: 1,  //当前页码数
    pagesize: 2, //当前每页显示的条数
    cate_id: '', //文章分类的id(注意:不是文章的id)
    state: '', //文章的状态('已发布'和'草稿')
  }

  // 时间过滤器
  template.defaults.imports.formatTime = (time) => {
    const date = new Date(time)

    const y = date.getFullYear()
    const m = (date.getMonth() + 1 + '').padStart(2, '0')
    const d = (date.getDate() + '').padStart(2, '0')
    const hh = (date.getHours() + '').padStart(2, '0')
    const mm = (date.getMinutes() + '').padStart(2, '0')
    const ss = (date.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d}   ${hh}:${mm}:${ss}`
  }

  loadArticleList()
  //加载文章列表
  function loadArticleList() {
    $.ajax({
      method: 'GET',
      url: `/my/article/list?pagenum=${q.pagenum}&pagesize=${q.pagesize}&cate_id=${q.cate_id}&state=${q.state}`,
      success(res) {
        if (res.code !== 0) return layer.msg('加载文章列表失败!' + res.message)
        // layer.msg('加载文章列表成功!')
        // console.log(res)
        // template 模板
        const htmlStr = template('tpl-list', res)
        $('tbody').html(htmlStr)

        renderPager(res.total)
      }
    })
  }


  loadCateList()
  //文章分类方法
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success(res) {
        if (res.code !== 0) return layer.msg(`获取文章列表失败!${res.message}`)
        // console.log(res)

        //模板引擎
        const htmlStr = template('tpl_list', res)
        $('[name="cate_id"]').html(htmlStr)
        form.render()
      }
    })
  }

  $('#choose-form').on('submit', function (e) {
    e.preventDefault()
    const cate_id = $('[name=cate_id]').val()
    q.cate_id = cate_id

    const state = $('[name=state]').val()
    q.state = state

    loadArticleList()
  })



  //分页方法
  function renderPager(total) {
    laypage.render({
      elem: 'pageWrapper',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 4, 6, 8, 10],
      jump(obj, first) {
        // console.log(first)
        q.pagenum = obj.curr
        q.pagesize = obj.limit

        if (!first) {
          loadArticleList()
        }

      }

    })
  }

  //删除
  $('table').on('click', '#btn-del', function () {
    const id = $(this).attr('data-id')
    const len = $('#btn-del').length
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'DELETE',
        url: `/my/article/info?id=${id}`,
        success(res) {
          if (res.code !== 0) return layer.msg('删除失败!' + res.message)
          layer.msg('删除成功!')

          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          loadArticleList()
        }
      })

      layer.close(index);
    });

  })
})