// stores/user.ts
import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost'

interface User {
    id: number
    name?: string
    code: string
    department?: string
    table?: string
    tables?: { id: number; name: string; code: string; worker_id?: number }[]
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
        isAuthorized: false,
        badgeCode: localStorage.getItem('badge') || '',
        inQueue: false,
    }),
    actions: {
        async checkAuth() {
            if (!this.badgeCode) return
            try {
                await axios.post(`${API_URL}/api/worker/v1.0/ping`, {}, {
                    headers: { 'badge-code': this.badgeCode },
                })
                this.isAuthorized = true
                const localUser = localStorage.getItem('user')
                if (localUser) this.user = JSON.parse(localUser)
            } catch {
                this.isAuthorized = false
                this.user = null
            }
        },
        async auth() {
            const res = await axios.post(`${API_URL}/api/worker/v1.0/auth`, {}, {
                headers: { 'badge-code': this.badgeCode },
            })
            this.user = res.data
            localStorage.setItem('user', JSON.stringify(this.user))
        },
        async updateName(name: string) {
            const res = await axios.post(`${API_URL}/api/worker/v1.0/update`, { name }, {
                headers: { 'badge-code': this.badgeCode },
            })
            this.user = res.data
            localStorage.setItem('user', JSON.stringify(this.user))
        },
        async selectTable(table_id: number) {
            const res = await axios.post(`${API_URL}/api/worker/v1.0/select-table`, { table_id }, {
                headers: { 'badge-code': this.badgeCode },
            })
            this.user = res.data
            localStorage.setItem('user', JSON.stringify(this.user))
        },
        setBadge(code: string) {
            this.badgeCode = code
            localStorage.setItem('badge', code)
        },
        async enterQueue() {
            const res = await axios.post(`${API_URL}/api/worker/v1.0/enter-queue`, { }, {
                headers: { 'badge-code': this.badgeCode },
            })
            this.inQueue = true
        },
        async receiveItem() {
            const res = await axios.post(`${API_URL}/api/worker/v1.0/receive-item`, { }, {
                headers: { 'badge-code': this.badgeCode },
            })
            this.inQueue = false
        }
    }
})