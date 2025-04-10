import { createRouter, createWebHistory } from "vue-router";
const Home = () => import("@/views/index/Home.vue");
const ArtifactDisplay = () => import("@/views/index/ArtifactDisplay.vue");

export const RouteName = {
  Home: "home",
  ArtifactDisplay: "artifactDisplay",
};

const routes = [
  {
    name: RouteName.Home,
    path: "/",
    component: Home,
  },
  {
    name: RouteName.ArtifactDisplay,
    path: "/artifact-display",
    component: ArtifactDisplay,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
