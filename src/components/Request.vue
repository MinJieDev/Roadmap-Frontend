git<template>
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


// 调试函数
// 注意1：addEventListener可能在部件加载完前运行，需要使用window.onload滞后。
// 注意2：axios操作的返回是异步操作，对其返回值的处理必须要配合then使用。
import { req } from '../apis/util';

export default {};

function debugReq() {
  const url = document.getElementById('url').value.toString();
  const method = document.getElementById('method').value.toString().toUpperCase();
  // eslint-disable-next-line no-console
  console.info(url);
  // eslint-disable-next-line no-console
  console.info(method);
  // eslint-disable-next-line no-console
  req(url, method, { _limit: 5 })
    // eslint-disable-next-line no-console
    .then(response => console.info(response.data)).catch(error => console.info(error.error));
}

// eslint-disable-next-line func-names
window.onload = function () {
  document.getElementById('try_button').addEventListener('click', debugReq);
};
</script>
