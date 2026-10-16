import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** 顯示於 AppHeader 的頁面標題 */
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { title: 'Dashboard' },
      },
      { path: 'orders', name: 'orders', component: PlaceholderView, meta: { title: 'Orders' } },
      {
        path: 'customers',
        name: 'customers',
        component: PlaceholderView,
        meta: { title: 'Customers' },
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: PlaceholderView,
        meta: { title: 'Inventory' },
      },
      {
        path: 'conversations',
        name: 'conversations',
        component: PlaceholderView,
        meta: { title: 'Conversations' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: PlaceholderView,
        meta: { title: 'Settings' },
      },
      { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } },
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
