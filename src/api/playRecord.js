import request from '@/utils/request'

// 获取列表
export const getList = async({ pageNo = 1, pageSize = 10, id }) => {
  const res = await request({
    url: '/api/play',
    method: 'GET',
    params: {
      id,
      pageNo,
      pageSize
    }
  })
  return res
}

// 新增
export const create = async(data) => {
  const res = await request({
    url: '/api/play',
    method: 'POST',
    data
  })
  return res
}

// 编辑
export const update = async(id, data) => {
  const res = await request({
    url: `/api/play/${id}`,
    method: 'PUT',
    data
  })
  return res
}

// 删除
export const remove = async(id) => {
  const res = await request({
    url: `/api/play/${id}`,
    method: 'DELETE'
  })
  return res
}
