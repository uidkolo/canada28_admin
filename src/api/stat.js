import request from '@/utils/request'

// 获取列表
export const getList = async({ pageNo = 1, pageSize = 10 }) => {
  const res = await request({
    url: '/api/stat',
    method: 'GET',
    params: {
      pageNo,
      pageSize
    }
  })
  return res
}

// 获取详情
export const get = async(id) => {
  const res = await request({
    url: `/api/stat/${id}`,
    method: 'GET'
  })
  return res
}
