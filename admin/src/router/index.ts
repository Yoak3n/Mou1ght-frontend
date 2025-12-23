import { createRouter, createWebHashHistory } from 'vue-router'
import useUserStore from '@/store/modules/user'
import routes from './route'

const router=  createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _, next) => {
    const userStore = useUserStore();
    if(to.meta.auth){
        if(userStore.isAuth){
            next();
        }else{
            next('/entry');
        }
    }else{
        next();
    }   
})

export default router;