// stores/user.ts
import { defineStore } from 'pinia'
import axios from 'axios'

import iziToast from "izitoast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost'

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
    }),
    actions: {
        async checkAuth() {
            if (!this.badgeCode) return
            try {
                this.setLoading(true);
                const res = await axios.post(`${API_URL}/api/worker/v1.0/auth`, {}, {
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

                this.showError(e?.response?.data?.message);
            }
        },
        async updateName(name: string) {
            try{
                this.setLoading(true);
                const res = await axios.post(`${API_URL}/api/worker/v1.0/update`, { name }, {
                    headers: { 'badge-code': this.badgeCode },
                })
                this.setLoading(false);
                if(res.data.data){
                    this.setUser(res.data.data);
                }
            }
            catch (e: any){
                this.showError(e?.response?.data?.message);
                this.setLoading(false);
            }
        },
        async selectTable(table_id: number) {
            try{
                this.setLoading(true);
                const res = await axios.post(`${API_URL}/api/worker/v1.0/select-table`, { table_id }, {
                    headers: { 'badge-code': this.badgeCode },
                })
                this.setLoading(false);
                if(res.data.data){
                    this.setUser(res.data.data);
                }
            }
            catch (e: any){
                this.setLoading(false);
                this.showError(e?.response?.data?.message);
            }
        },
        setBadge(code: string) {
            this.badgeCode = code
        },
        async enterQueue() {
            try {
                this.setLoading(true);
                const res = await axios.post(`${API_URL}/api/worker/v1.0/enter-queue`, { }, {
                    headers: { 'badge-code': this.badgeCode },
                })
                await this.timeout(3000);
                this.setLoading(false);
                if(res.data.data){
                    this.setUser(res.data.data);
                }
            }
            catch (e: any){
                this.showError(e?.response?.data?.message);
                this.setLoading(false);
            }
        },
        async receiveItem() {
            try {
                this.setLoading(true);
                const res = await axios.post(`${API_URL}/api/worker/v1.0/receive-item`, { }, {
                    headers: { 'badge-code': this.badgeCode },
                })
                this.setLoading(false);
                if(res.data.data){
                    this.setUser(res.data.data);
                }
            }
            catch (e: any){
                this.showError(e?.response?.data?.message);
                this.setLoading(false);
            }
        },
        setUser(user: User) {
            localStorage.setItem('user', JSON.stringify(user))
            this.inQueue = !!user.inQueue
            this.user = user

        },
        showError(message?: string) {
            if(!message) {
                return;
            }
            iziToast.error({
                message: message,
                timeout: 3000,
                position: "center"
            })
            console.log(message);
        },
        setLoading(isLoading: boolean) {
            this.isLoading = isLoading;
        },
        timeout(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
})