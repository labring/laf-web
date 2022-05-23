import { cloud } from './cloud'
import { getCurrentBaseURL } from '~/utils'
import { getToken, getTokenExpire } from '~/utils/auth'
import request from '~/api/request'

/**
 * 请求我的应用
 * @returns my application list
 */
export function getMyApplications() {
  return request({
    url: '/sys-api/apps/my',
    method: 'get',
  })
}

/**
 * Get avaliable specs
 * @returns
 */
export function getSpecs() {
  return request({
    url: '/sys-api/apps/specs',
    method: 'get',
  })
}

/**
 * Get application by appid
 * @param {string} appid
 * @returns { Application } Application Data
 */
export async function getApplicationByAppid(appid) {
  const res = await request({
    url: `/sys-api/apps/${appid}`,
    method: 'get',
  })

  return res
}

/**
 * Create Application
 * @param param0
 * @returns
 */
export async function createApplication(data) {
  const res = await request({
    url: '/sys-api/apps/create',
    method: 'post',
    data,
  })
  return res
}

/**
 * Edit Application
 * @param param0
 * @returns
 */
export async function updateApplication({ appid, name }) {
  const res = await request({
    url: `/sys-api/apps/${appid}`,
    method: 'post',
    data: {
      name,
    },
  })
  return res
}

/**
 * Delete (Release) Application
 * @param {*} appid
 * @returns
 */
export async function removeApplication(appid) {
  const res = await request({
    url: `/sys-api/apps/${appid}`,
    method: 'delete',
  })
  return res
}

/**
 * 启动应用服务
 * @param {*} appid
 * @returns
 */
export async function startApplicationInstance(appid) {
  const res = await request({
    url: `/sys-api/apps/${appid}/instance/start`,
    method: 'post',
  })
  return res
}

/**
 * 停止应用服务
 * @param {*} appid
 * @returns
 */
export async function stopApplicationInstance(appid) {
  const res = await request({
    url: `/sys-api/apps/${appid}/instance/stop`,
    method: 'post',
  })
  return res
}

/**
 * 重启应用服务
 * @param {*} appid
 * @returns
 */
export async function restartApplicationInstance(appid) {
  const res = await request({
    url: `/sys-api/apps/${appid}/instance/restart`,
    method: 'post',
  })
  return res
}

/**
 * 导出应用
 * @param {string} appid
 * @returns
 */
export async function exportApplication(appid) {
  const res = await request({
    url: `/sys-api/apps/${appid}/export`,
    method: 'get',
    responseType: 'blob',
  })
  return res
}

/**
 * 导入应用
 * @param {string} appid
 * @param {File} file
 * @returns
 */
export async function importApplication(appid, file) {
  const form = new FormData()
  form.append('file', file)
  const res = await request({
    url: `/sys-api/apps/${appid}/import`,
    method: 'post',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res
}

/**
 * Init application with template id
 * @param {string} appid
 * @param {File} file
 * @returns
 */
export async function initApplicationWithTemplate(appid, template_id) {
  const res = await request({
    url: `/sys-api/apps/${appid}/init-with-template`,
    method: 'post',
    data: {
      template_id,
    },
  })
  return res
}

/**
 * Open app console
 * @param {*} app
 */
export async function openAppConsole(app) {
  const base_url = getCurrentBaseURL()
  const console_uri = process.env.VUE_APP_APP_CONSOLE_URI
  const back_url = encodeURIComponent(window.location.href)

  let app_console_url = `${console_uri}/#/app/${app.appid}/dashboard/index?$back_url=${back_url}`

  // pass auth info when in CORS
  if (console_uri.startsWith('http')) {
    app_console_url
      = `${app_console_url
      }&access_token=${getToken()}&expire=${getTokenExpire()}&with_auth=true`
  }
  else {
    app_console_url = base_url + app_console_url
  }

  console.log(app_console_url, 'app_console_url')
  window.open(app_console_url, '_blank')
}
