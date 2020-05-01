/*
* How to use?
* import errPush from './components/ErrHandler';
* @errCode: string
* @useModal: boolean, default to true
* */

export default function pushError(obj, errCode, useModal = false, errTitle = '', errContent = '') {
  window.console.warn('Deprecated method. Please use pushErr');
  let title = '';
  let content = '';
  if (errTitle === '' && errContent === '') {
    if (errCode === '0001') {
      title = 'DEBUG ERROR ';
      content = '调试用错误';
    } else if (errCode === '0010') {
      title = 'Unfinished Exception';
      content = '未实现的方法或接口';
    } else if (errCode === '1000') {
      title = 'Runtime Exception';
      content = '运行时错误';
    } else if (errCode === '1010') {
      title = 'Undefined Object';
      content = '访问未定义对象';
    } else if (errCode === '4000') {
      title = 'Unclassified Network Exception';
      content = '无法分类的网络错误';
    } else if (errCode === '4040') {
      title = 'Resources NOT Exist Exception';
      content = '访问或查询不存在的资源';
    } else if (errCode === '4010') {
      title = 'Unauthorized Exception';
      content = '未登陆或没有访问权限';
    } else if (errCode === '5000') {
      title = 'Server Error';
      content = '服务器内部错误';
    } else if (errCode === '5010') {
      title = 'Incomplete Input';
      content = '输入不完整';
    } else if (errCode === '5020') {
      title = 'Login Fail';
      content = '登陆失败';
    } else {
      return;
    }
  } else {
    title = errTitle;
    content = errContent;
  }

  window.console.error('[ERROR] ', title, ': ', content);

  if (useModal) {
    obj.$Modal.error({
      title,
      content,
      okText: '知道了~',
    });
  } else {
    title += ': ';
    title += content;
    obj.$Message.error({
      background: true,
      content: title,
      duration: 5,
      closable: true,
    });
  }
}

export const pushErr = (obj, err, useModal = false, errTitle = '', errContent = '', modalType = 'error') => {
  let title = '';
  let content = '';
  let errCode = '';
  let response = '';
  window.console.log(err);
  if (typeof err === 'string') {
    errCode = err;
  } else {
    errCode = String(err.code);
    response = err.response.data.detail;
    if (!response) {
      response = err.response.data.non_field_errors;
      if (response) {
        response = '用户名或密码错误';
      }
    }
    if (!response) {
      response = err.response.data.username;
    }
  }
  if (errTitle === '' && errContent === '') {
    if (errCode === '0001') {
      title = 'DEBUG ERROR ';
      content = '调试用错误';
    } else if (errCode === '0010') {
      title = 'Unfinished Exception';
      content = '未实现的方法或接口';
    } else if (errCode === '1000') {
      title = 'Runtime Exception';
      content = '运行时错误';
    } else if (errCode === '1010') {
      title = 'Undefined Object';
      content = '访问未定义对象';
    } else if (errCode === '4000') {
      title = 'Unclassified Network Exception';
      content = '无法分类的网络错误';
    } else if (errCode === '4030') {
      title = 'Permission Denied';
      content = '没有权限';
    } else if (errCode === '4040') {
      title = 'Resources NOT Exist Exception';
      content = '访问或查询不存在的资源';
    } else if (errCode === '4010') {
      title = 'Unauthorized Exception';
      content = '请先登陆';
      // eslint-disable-next-line no-param-reassign
      modalType = 'info';
    } else if (errCode === '5010') {
      title = 'Incomplete Input';
      content = '用户名/密码输入不完整';
    } else if (errCode === '5020') {
      title = 'Login Fail';
      content = '登陆失败';
    } else {
      return;
    }
  } else {
    title = errTitle;
    content = errContent;
  }
  window.console.error('[ERROR] ', title, ': ', content);

  if (useModal) {
    if (modalType === 'info') {
      obj.$Modal.info({
        title,
        content: `${content}</br>${response}`,
        okText: '知道了~',
      });
    } else {
      obj.$Modal.error({
        title,
        content: `${content}</br>${response}`,
        okText: '知道了~',
      });
    }
  } else {
    title += ': ';
    title += content;
    obj.$Message.error({
      background: true,
      content: title,
      duration: 5,
      closable: true,
    });
  }
};
