<template>
  <div>
    <p>这是一条调试信息</p>>
    <button id="try_button">
      Request调试按钮
    </button>
    <input id="url" name="url">
    <input id="method" name="method">
  </div>
</template>

<script>
import axios from 'axios'

export default {}
function req (url, method, params = {}) {
  const options = {
    method: method,
    url: url,
    params: params
  }
  try {
    return axios(options)
  } catch (e) {
    console.error(e)
  }
}

// 调试函数
// 注意1：addEventListener可能在部件加载完前运行，需要使用window.onload滞后。
// 注意2：axios操作的返回是异步操作，对其返回值的处理必须要配合then使用。
function debugReq () {
  const url = document.getElementById('url').value.toString()
  const method = document.getElementById('method').value.toString().toUpperCase()
  console.info(url)
  console.info(method)
  console.info(req(url, method, { _limit: 5 }).then(res => console.info(res.data)))
}
window.onload = function () {
  document.getElementById('try_button').addEventListener('click', debugReq)
}
</script>
