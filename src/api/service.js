import request from '@/utils/request'

// 获取
export const get = async() => {
  const res = await request({
    url: '/api/service',
    method: 'GET'
  })
  return res
}

// 设置
export const set = async(username) => {
  const res = await request({
    url: '/api/service',
    method: 'POST',
    data: { username }
  })
  return res
}
