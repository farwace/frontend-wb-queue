// stores/user.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import type {AxiosResponse} from 'axios'

import iziToast from "izitoast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost'
const IS_SPECTATOR_ENABLED = import.meta.env.VITE_ENABLE_QUEUE == 'true'
const DIRECTION_CODE = import.meta.env.VITE_DIRECTION_CODE || 'e1'

interface User {
    id: number
    name?: string
    code: string
    department?: string
    table?: string
    inQueue?:boolean
    tables?: { id: number; name: string; code: string; worker_id?: number }[]
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
        isAuthorized: localStorage.getItem('badge') !== null,
        badgeCode: localStorage.getItem('badge') || '',
        inQueue: false,
        isLoading: false,
        isSpectatorMode: IS_SPECTATOR_ENABLED,
        password: (localStorage.getItem('app-password') || undefined) as string | undefined,
    }),
    actions: {
        async checkAuth() {
            if (!this.badgeCode) return
            try {
                this.setLoading(true);
                const res = await axios.post(`${API_URL}/api/worker/v1.0/auth`, {
                    direction: DIRECTION_CODE
                }, {
                    headers: { 'badge-code': this.badgeCode },
                })
                this.setLoading(false);
                if(res.data.data){
                    this.setUser(res.data.data);
                    localStorage.setItem('badge', this.badgeCode);
                }
                this.isAuthorized = true
                const localUser = localStorage.getItem('user')
                if (localUser) this.user = JSON.parse(localUser)
            } catch (e:any){
                this.isAuthorized = false
                this.user = null
                this.setLoading(false);

                this.showError(e?.response?.data?.message, e?.response?.status);
            }
        },
        async updateName(name: string) {
            try{
                this.setLoading(true);
                const res = await axios.post(`${API_URL}/api/worker/v1.0/update`, { name: name, direction: DIRECTION_CODE }, {
                    headers: { 'badge-code': this.badgeCode },
                })
                this.setLoading(false);
                if(res.data.data){
                    this.setUser(res.data.data);
                }
            }
            catch (e: any){
                this.showError(e?.response?.data?.message, e?.response?.status);
                this.setLoading(false);
            }
        },
        async selectTable(table_id: number) {
            try{
                this.setLoading(true);
                const res = await axios.post(`${API_URL}/api/worker/v1.0/select-table`, { table_id: table_id, direction: DIRECTION_CODE }, {
                    headers: { 'badge-code': this.badgeCode },
                })
                this.setLoading(false);
                if(res.data.data){
                    this.setUser(res.data.data);
                }
            }
            catch (e: any){
                this.setLoading(false);
                this.showError(e?.response?.data?.message, e?.response?.status);
            }
        },
        setBadge(code: string) {
            this.badgeCode = code
        },
        async enterQueue() {
            try {
                this.setLoading(true);
                const res = await axios.post(`${API_URL}/api/worker/v1.0/enter-queue`, { direction: DIRECTION_CODE }, {
                    headers: { 'badge-code': this.badgeCode },
                })
                //await this.timeout(3000);
                this.setLoading(false);
                if(res.data.data){
                    this.setUser(res.data.data);
                }
            }
            catch (e: any){
                this.showError(e?.response?.data?.message, e?.response?.status);
                this.setLoading(false);
            }
        },
        async receiveItem() {
            try {
                this.setLoading(true);
                const res = await axios.post(`${API_URL}/api/worker/v1.0/receive-item`, { direction: DIRECTION_CODE }, {
                    headers: { 'badge-code': this.badgeCode },
                })
                this.setLoading(false);
                if(res.data.data){
                    this.setUser(res.data.data);
                }
            }
            catch (e: any){
                this.showError(e?.response?.data?.message, e?.response?.status);
                this.setLoading(false);
            }
        },
        async logout(){
            this.setLoading(true);
            const res = await axios.post(`${API_URL}/api/worker/v1.0/leave-table`, { direction: DIRECTION_CODE }, {
                headers: { 'badge-code': this.badgeCode },
            })
            this.setLoading(false);
        },
        async getParam(paramName: string) {
            try {
                this.setLoading(true);
                const res = await axios.get(`${API_URL}/api/worker/v1.0/get-param/${paramName}`, {});
                this.setLoading(false);
                return res.data;
            }
            catch (e: any){
                this.showError(e?.response?.data?.message, e?.response?.status);
                this.setLoading(false);
            }
        },
        async getQueue(setLoading = true){
            try {
                if(setLoading){
                    this.setLoading(true);
                }
                const res = await axios.get(`${API_URL}/api/worker/v1.0/queue/${DIRECTION_CODE}`, {
                    headers: {
                        'Auth-string': this.password
                    }
                })
                this.setLoading(false);
                if(this.password){
                    localStorage.setItem('app-password', this.password);
                }
                return res;
            }
            catch (e:any){
                this.showError(e?.response?.data?.message, e?.response?.status);
                this.setLoading(false);
                if(e?.response?.status === 401){
                    return null;
                }
            }
        },
        async getTablesCnt(): Promise<AxiosResponse<number>> {
            return axios.get(`${API_URL}/api/worker/v1.0/department-tables-length/${DIRECTION_CODE}`, {});
        },
        setUser(user: User) {
            localStorage.setItem('user', JSON.stringify(user))
            this.inQueue = !!user.inQueue
            this.user = user

        },
        showError(message?: string, status ?: number) {
            if(!message) {
                return;
            }
            iziToast.error({
                message: message,
                timeout: 3000,
                position: "center"
            })
            console.log(message);
            if(status === 403){
                setTimeout(()=>{
                    window.location.reload();
                }, 1500)
            }
        },
        setLoading(isLoading: boolean) {
            this.isLoading = isLoading;
        },
        timeout(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
})