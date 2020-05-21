// eslint-disable-next-line no-array-constructor
window.routerStack = new Array();
window.routerStack.push('Welcome');

export default function pushRouter(name) {
  const routerLevelDict = {
    Welcome: 1,
    Login: 2,
    Register: 2,
    ArticleTable: 2,
    RoadmapTable: 2,
    ArticleMarkDownEditor: 10,
    Editor: 5,
    Reader: 5,
    undefined: 50,
    null: 50,
    ' ': 50,
  };
  // window.console.info('[DEBUG] routerLevelDict[name]: ', routerLevelDict[name]);
  for (let i = 0; i < window.routerStack.length; i += 1) {
    if (routerLevelDict[window.routerStack[i]] >= routerLevelDict[name]) {
      window.routerStack.splice(i, 1);
      i -= 1;
    }
  }
  window.routerStack.push(name);
}
