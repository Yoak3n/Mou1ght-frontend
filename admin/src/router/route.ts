import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: () => import("@/layout/Layout.vue"),
    redirect: '/home',
    meta: {
        auth: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import("@/views/Home.vue"),
        meta: { 
            title: '主页',
            auth: true
        }
      },{
        path: '/post',
        name: 'post',
        component: () => import("@/views/Post/index.vue"),
        meta: {
            auth: true,
            title: '内容管理'
        },
        children: [
            {
                path: '/post/group',
                name: 'group',
                component: () => import("@/views/Post/Group.vue"),
                meta: { title: '分类标签管理' }
            },{
                path: '/post/article',
                name: 'article',
                component: () => import("@/views/Post/Article.vue"),
                meta: { title: '文章管理' }
            },{
                path: '/post/message',
                name: 'message',
                component: () => import("@/views/Post/Message.vue"),
                meta: { title: '留言版管理' }
            },{
                path: '/post/sharing',
                name: 'sharing',
                component: () => import("@/views/Post/Sharing.vue"),
                meta: { title: '说说管理' }
            }
        ]
      },{
        path: '/settings',
        name: 'settings',
        component: () => import("@/views/Settings.vue"),
        meta: { 
            title: '网站设置',
            auth: true
            
        },
    }
    ]
  },{
    path: '/login',
    name: 'login',
    component: () => import("@/components/Form/Login.vue")
  },{
    path: '/register',
    name: 'register',
    component: () => import("@/components/Form/Register.vue")
  },{
    path: '/entry',
    name: 'entry',
    component: () => import("@/views/Entrypoint.vue")
  }
]

export default routes