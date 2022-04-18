import request from '@/utils/request'
import axios from 'axios'

// 获取列表
export const getList = async({ pageNo = 1, pageSize = 10 }) => {
  const { list, total } = await request({
    url: '/api/bot',
    method: 'GET',
    params: {
      pageNo,
      pageSize
    }
  })
  for (let i = 0; i < list.length; i++) {
    const { data } = await axios.get(`https://api.telegram.org/bot${list[i].token}/getWebHookInfo`)
    list[i] = {
      ...list[i],
      ...data.result
    }
  }
  return { list, total }
}

// 新增
export const create = async(data) => {
  const res = await request({
    url: '/api/bot',
    method: 'POST',
    data
  })
  return res
}

// 编辑
export const update = async(id, data) => {
  const res = await request({
    url: `/api/bot/${id}`,
    method: 'PUT',
    data
  })
  return res
}

// 设置webhook
export const setWebHook = async(token, url) => {
  url = url.trim()
  const { data } = await axios.request({
    url: `https://api.telegram.org/bot${token}/setWebHook`,
    method: 'GET',
    params: {
      url
    }
  })
  return data.result
}

// 删除webhook
export const delWebHook = async(token) => {
  const { data } = await axios.request({
    url: `https://api.telegram.org/bot${token}/deleteWebHook`,
    method: 'GET'
  })
  return data.result
}

// 重启
export const restart = async(token, url) => {
  try {
    const delResult = await delWebHook(token)
    if (delResult) {
      const setResult = await setWebHook(token, url)
      return setResult
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}
