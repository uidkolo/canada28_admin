import request from '@/utils/request'

//登录
export const login = async(data) => {
    const res = await request({
        url: '/api/login',
        method: 'POST',
        data
    })
    return res
}

//获取列表
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