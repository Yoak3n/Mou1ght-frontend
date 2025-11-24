import {defineStore} from "pinia";
import type {UserState} from "@/store/types/type";
import {SET_TOKEN,GET_TOKEN} from "@/utils/storage";
import type {loginForm} from "@/api/user/type";
import {reqLogin, reqRegister} from "@/api/user";

let useUserStore = defineStore('userStore',{
    state:():UserState=>{
        return {
            token:GET_TOKEN(),
            isAuth:false,
            userID:0
        }
    },
    actions:{
        async userLogin (data:loginForm) {
            let result = await reqLogin(data)
            if (result.code === 0){
                this.token = result.data.token as string
                SET_TOKEN((result.data.token as string))
                return 'ok'
            }else{
                SET_TOKEN('')
                return Promise.reject(new Error(result.data.message))
            }
        },
        async userRegister(data:loginForm){
            let result = await reqRegister(data)
            if (result.code === 0){
                this.token = result.data.token as string
                SET_TOKEN((result.data.token as string))
                return 'ok'
            }else{
                SET_TOKEN('')
                return Promise.reject(new Error(result.data.message))
            }
        },
        // 退出登录
        async userLogout(){
            this.token = ''
            SET_TOKEN('')
        }
    },
    getters:{
        changeAuth(){
            this.isAuth = this.token != '';
        }
    }
})


export default useUserStore