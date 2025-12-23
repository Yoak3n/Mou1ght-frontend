import { userLogin, userRegister, userLogout, userInfo } from "@/api/user";
import type { UserLoginRequest, UserRegisterRequest } from "@/api/user/type";
import type { UserInfo } from "@/types/user";
import { getToken, setToken } from "@/utils/storage";
import { defineStore } from "pinia";

const useUserStore = defineStore("user",{
    state:()=>({
        token: getToken(),
        auth: false,
        info: null as UserInfo | null,
    }),
    actions: {
        async userLogin(data:UserLoginRequest){
            const res = await userLogin(data);
            if(res.code !== 0){
                setToken('');
                return Promise.reject(new Error(res.message));
            }else{
                this.token = res.data.token;
                this.auth = true;
                setToken(res.data.token);
                return 'ok'
            }
        },

        async userRegister(data:UserRegisterRequest){
            const res = await userRegister(data);
            if(res.code !== 0){
                return Promise.reject(new Error(res.message));
            }else{
                this.token = res.data.token;
                this.auth = true;
                setToken(res.data.token);
                return 'ok'
            }
        },

        async userInfo(){
            const res = await userInfo();
            if(res.code !== 0){
                this.token = ''
                this.auth = false
                setToken('')
                return Promise.reject(new Error(res.message));
            }else{
                let userInfo = res.data.user;
                this.info = userInfo;
                return userInfo
            }
        },

        async userLogout(){
            const res = await userLogout();
            if(res.code !== 0){
                return Promise.reject(new Error(res.message));
            }else{
                this.token = '';
                this.auth = false;
                setToken('');
                return 'ok'
            }
        }
    },
    getters: {
        isAuth():boolean{
            if (this.token == ''){
                this.auth = false;
            }else{
                this.auth = true;
            }
            return this.auth ;
        }
    }
})

export default useUserStore;