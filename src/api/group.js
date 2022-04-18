import request from '@/utils/request'

// 获取列表
export const get = async() => {
  const res = await request({
    url: '/api/group',
    method: 'GET'
  })
  return res
}

// 删除
export const remove = async() => {
  const res = await request({
    url: `/api/group`,
    method: 'DELETE'
  })
  return res
}
