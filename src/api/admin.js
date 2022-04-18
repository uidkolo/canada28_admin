import request from '@/utils/request'

// 登录
export const login = async(data) => {
  const res = await request({
    url: '/api/login',
    method: 'POST',
    data
  })
  return res
}

// 获取列表
export const getList = async({ pageNo = 1, pageSize = 10 }) => {
  const res = await request({
    url: '/api/admin',
    method: 'GET',
    params: {
      pageNo,
      pageSize
    }
  })
  return res
}

// 新增
export const create = async(data) => {
  const res = await request({
    url: '/api/admin',
    method: 'POST',
    data
  })
  return res
}

// 编辑
export const update = async(id, data) => {
  const res = await request({
    url: `/api/admin/${id}`,
    method: 'PUT',
    data
  })
  return res
}

// 删除
export const remove = async(id) => {
  const res = await request({
    url: `/api/admin/${id}`,
    method: 'DELETE'
  })
  return res
}

// 删除
export const clear = async() => {
  const res = await request({
    url: `/api/admin/clearData`,
    method: 'POST'
  })
  return res
}
