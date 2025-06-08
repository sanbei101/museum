import { createRouter, createWebHistory } from 'vue-router';
const Home = () => import('@/views/index/Home.vue');
const ArtifactDisplay = () => import('@/views/index/ArtifactDisplay.vue');
const VisitGuide = () => import('@/views/index/VisitGuide.vue');
const ArtifactDetail = () => import('@/views/index/ArtifactDetail.vue');
const VirtualMuseum = () => import('@/views/index/VirtualMuseum.vue');
const AdminDashboard = () => import('@/views/admin/Dashboard.vue');

export const RouteName = {
  Home: 'home',
  ArtifactDisplay: 'artifactDisplay',
  ArtifactDetail: 'artifactDetail',
  VisitGuide: 'visitGuide',
  VirtualMuseum: 'virtualMuseum',
  AdminDashboard: 'adminDashboard',
  AdminLogin: 'adminLogin'
};

const routes = [
  {
    name: RouteName.Home,
    path: '/',
    component: Home
  },
  {
    name: RouteName.ArtifactDisplay,
    path: '/artifact-display',
    component: ArtifactDisplay
  },
  {
    name: RouteName.ArtifactDetail,
    path: '/artifact-detail/:id',
    component: ArtifactDetail
  },
  {
    name: RouteName.VisitGuide,
    path: '/visit-guide',
    component: VisitGuide
  },
  {
    name: RouteName.VirtualMuseum,
    path: '/virtual-museum',
    component: VirtualMuseum
  },
  {
    name: RouteName.AdminDashboard,
    path: '/admin',
    component: AdminDashboard
  },
  {
    name: RouteName.AdminLogin,
    path: '/admin/login',
    component: () => import('@/views/admin/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
