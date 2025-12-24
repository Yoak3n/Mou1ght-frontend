import { h} from 'vue'
import type {Component} from 'vue'
import { NIcon } from "naive-ui"
import type { MenuOption } from 'naive-ui'
import {BookOutline,PersonAddOutline,CarOutline,LockClosed} from '@vicons/ionicons5'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

let  menuOptions: MenuOption[] = [
    {
        label: '主页',
        key: 'home',
        path:'/home',
        icon: renderIcon(BookOutline)
    }, {
        label: '数据大图',
        key: 'screen',
        path:'/screen',
        icon: renderIcon(PersonAddOutline),
    },{
        label: '内容管理',
        key: 'post',
        path:'/post',
        icon: renderIcon(CarOutline),
        children:[
            {
                label:'分类标签管理',key:'post/group',path:'/post/group'
            },{
                label:'文章管理',key:'post/article',path:'/post/article'
            },{
                label:'说说管理',key:'post/sharing',path:'/post/sharing'
            },{
                label:'留言板管理',key:'post/message',path:'/post/message'
            }
        ]
    }, {
        label: '网站设置',
        key: 'settings',
        path:'/settings',
        icon: renderIcon(LockClosed),
    }
]
export default menuOptions