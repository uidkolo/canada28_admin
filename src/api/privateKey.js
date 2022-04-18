import request from '@/utils/request'

// 获取
export const get = async() => {
  const res = await request({
    url: '/api/privateKey',
    method: 'GET'
  })
  return res
}

// 设置
export const set = async(privateKey) => {
  const res = await request({
    url: '/api/privateKey',
    method: 'POST',
    data: { privateKey }
  })
  return res
}
