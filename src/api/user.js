import request from '@/utils/request'

// 获取列表
export const getList = async({ pageNo = 1, pageSize = 10 }) => {
  const res = await request({
    url: '/api/user',
    method: 'GET',
    params: {
      pageNo,
      pageSize
    }
  })
  return res
}

// 手动充值
export const topUp = async(data) => {
  const res = await request({
    url: `/api/user/topup`,
    method: 'PUT',
    data
  })
  return res
}

// 手动充值
export const update = async(id, data) => {
  const res = await request({
    url: `/api/user/${id}`,
    method: 'PUT',
    data
  })
  return res
}
