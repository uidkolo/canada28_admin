import request from '@/utils/request'

// 获取
export const get = async() => {
  const res = await request({
    url: '/api/authUrl',
    method: 'GET'
  })
  return res
}

// 设置
export const set = async(url) => {
  const res = await request({
    url: '/api/authUrl',
    method: 'POST',
    data: { url }
  })
  return res
}
