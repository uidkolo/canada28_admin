import request from '@/utils/request'

// 获取列表
export const getList = async({ type, status, pageNo = 1, pageSize = 10 }) => {
  const res = await request({
    url: '/api/order',
    method: 'GET',
    params: {
      type,
      status,
      pageNo,
      pageSize
    }
  })
  return res
}

// 新增
export const create = async(data) => {
  const res = await request({
    url: '/api/order',
    method: 'POST',
    data
  })
  return res
}

// 编辑
export const update = async(id, data) => {
  const res = await request({
    url: `/api/order/${id}`,
    method: 'PUT',
    data
  })
  return res
}

// 删除
export const remove = async(id) => {
  const res = await request({
    url: `/api/order/${id}`,
    method: 'DELETE'
  })
  return res
}
