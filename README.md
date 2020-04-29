# roadmap-frontend

> A Vue.js project

## Live Demo
访问http://47.94.141.56

- 常见场景一：登陆
  - 未登录的用户进入网站，自动跳转至登陆界面
  - 输入用户名密码，点击登录按钮，登录成功后自动跳转至文献管理页面

- 常见场景二：文献管理

  - 登录状态下，点击`文献管理`，进入文献管理界面

  - 通过点击创建文献，添加文献列表项
  - 创建错误可以点击`修改`，想要删除可以点击`删除`

- 常见场景三：路书管理
  - 登录状态下，点击导航栏的`路书管理`，跳转至路书管理界面
  - 如已有路书，可以点击`查看`进入路书阅览器，点击`修改`进入路书编辑起，点击`删除`进行删除
- 常见场景四：路书编辑
  - 登录状态下，在路书管理界面点击`新建路书`或点击已有路书的`编辑`，进入路书编辑界面
  - 用户可以点击`标题`和`描述`旁边的`修改图标`修改标题或修改描述
  - 点击左侧文献栏中的一个文献，鼠标悬停在下拉列表按钮，弹出文献添加/删除选项
  - 选择添加文献，可在路书编辑区看到`文献节点`被成功添加
  - 点击右侧工具栏中的`Add Node`按钮，输入节点名和Url，可以添加`普通节点`
  - 任何时刻用户都可以拖动编辑区的节点达到更好的显示效果
  - 点击右侧工具栏的`Add Connection`按钮，选择两个节点，即可添加一条关系连接
  - 点击右侧工具栏的`Add Comment`按钮，可以选择一个节点，对其添加注释内容
  - 相应的，可以通过`Delete Node`、`Delete Connection`、`Delete Comment`进行删除
  - 编辑结束后，点击右侧工具栏的`Save Roadmap`按钮保存

- 常见场景五：路书阅览/编辑切换
  - 登录状态下，在路书管理界面点击已有路书的`查看`，进入路书阅览界面
  - 可以通过点击右侧的`Edit`按钮切换到编辑界面
  - 在路书编辑界面，可以通过点击右侧的`Read Only`按钮切换到阅览界面
## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
