import request from '@/utils/request'
import * as qiniu from 'qiniu-js'

//获取token
export const getToken = async() => {
    const res = await request({
        url: '/api/qiniu/token',
        method: 'GET'
    })
    return res
}

//获取七牛云上传地址
export const getUploadUrl = async(token) => {
    const url = await qiniu.getUploadUrl({
        useCdnDomain: true,
        region: qiniu.region.z2
    }, token)
    return url
}