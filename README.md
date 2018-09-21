# backstage-basic
https://github.com/harsima/vue-backend

> A Vue.js project
|-build/                  //构建脚本目录
|  |-build.js             //
|  |-check-version.js     //
|  |-utils.js
|  |-vue-loader.js
|  |-webpack.base.conf.js
|  |-webpack.dev.conf.js
|  |-webpack.prod.conf.js
|-config/                  //构建配置目录
|  |-dev.env.js            //开发环境配置
|  |-index.js              //通用配置
|  |-prod.end.js           //生产环境配置
|- src/
|  |- assets/           // 静态文件目录：css、images等
|  |- components/       // 组件文件目录
|  |- page/             // 具体业务页面目录
|  |- router/           // vue-router的路由目录
|  |- store/            // vuex目录
|  |- util/             // 工具类目录
|  |- main.js           // webpack入口文件
|  |- App.vue           // 页面级组件，入口页面是index.html

## Build Setup

安装sass-loader前需要提前安装node-sass。安装less-loader前需要安装less

权限控制有两种：页面级访问权限  数据级操作权限

权限策略：
1. 前端记录所有的权限。用户登录后，后端返回用户角色，前端根据角色自行分配页面
2. 前端仅记录页面，后端记录权限。用户登陆后，后端返回用户权限列表，前端根据该列表生成可访问页面（采用）

接口权限控制：
前端权限控制中，真正能实现安全的是接口，所以先实现接口的权限控制
接口权限就是对用户的校验，用户登录时给前台返回一个token，以后前端每次调用接口时都要带上token服务器端获取到这个token后进行对比，如果通过f的话就可以访问

页面级访问控制实质上应该是控制页面是否显示，但落在实际中则有两种不同的情况：
1. 显示系统中所有菜单，当用户访问不在自己权限范围内的页面时提示权限不足。
2. 只显示当前用户能访问的菜单，如果用户通过URL进行强制访问，则会直接404（采用）

登录 ——> 获取该用户权限列表 ——> 根据权限列表生成能够访问的菜单 ——> 点击菜单，进入页面

创建路由表：
1. 同时拥有静态路由和动态路由。
2. 只拥有静态路由

在第一种模式中，将系统中不需要权限的页面构成静态路由，需要权限的页面构成动态路由。当用户登录后，根据返回数据匹配动态路由表，将结果通过addRoutes方法添加到静态路由中。完整的路由中将只包含当前用户能访问的页面，用户无权访问的页面将直接跳转到404。（这也是我之前一直使用的模式）

第二种模式则直接将所有页面都配置到静态路由中。用户正常登录，系统将返回数据记录下来作为权限数据。当页面跳转时，判断跳转的页面是否在用户的权限列表中，如果在则正常跳转，如果不在则可以跳转到任意其他页面。

需要注意的是，在第二种模式中，因为只有单一的静态路由，所以一定要使用vue-router的懒加载策略对路由组件进行加载行为优化，防止首次加载时直接加载全部页面组件的尴尬问题。当然，你可以对那些不需要权限的固定页面不使用懒加载策略，这些页面包括登录页、注册页等
vue-router懒加载：https://router.vuejs.org/zh/guide/advanced/lazy-loading.html

插件：
@babel/plugin-syntax-dynamic-import  路由懒加载
element-ui
babel-polyfill 优化webpack配置
ngprogress
js-cookie
vuex
axios
vue-i18n
eventsource-polyfill
webpack-hot-middleware
webpack-dev-middleware

@kazupon/vue-i18n-loader
@types/node
@vue/component-compiler-utils
@webassemblyjs/ast
express
cheerio
vue-loader
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
