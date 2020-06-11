// eslint-disable-next-line no-array-constructor
window.routerStack = new Array();
window.routerStack.push({ name: 'Welcome', nickName: '主页', fullPath: '/', level: 1 });

export default function pushRouter(name, nickName, fullPath, level) {
  let hasHomePage = false;
  for (let i = 0; i < window.routerStack.length; i += 1) {
    if (window.routerStack[i].nickName === '主页') {
      hasHomePage = true;
    } else if ((window.routerStack[i].level >= level || window.routerStack[i].name === undefined)) {
      window.routerStack.splice(i, 1);
      i -= 1;
    }
  }
  if (!hasHomePage) {
    window.routerStack.push({ name: 'Welcome', nickName: '主页', fullPath: '/', level: 1 });
  }
  if (level > 1) {
    window.routerStack.push({ name, nickName, fullPath, level });
  }
}
