import { createRouter, createWebHistory } from "vue-router";
const Home = () => import("@/views/index/Home.vue");
const ArtifactDisplay = () => import("@/views/index/ArtifactDisplay.vue");
import ArtifactDetail from "@/views/index/ArtifactDetail.vue";

export const RouteName = {
  Home: "home",
  ArtifactDisplay: "artifactDisplay",
  ArtifactDetail: "artifactDetail",
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
  {
    name: RouteName.ArtifactDetail,
    path: "/artifact-detail/:id",
    component: ArtifactDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
