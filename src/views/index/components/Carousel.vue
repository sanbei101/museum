<template>
  <div class="banner-section">
    <n-carousel
      autoplay
      dot-type="line"
      show-arrow
      :interval="5000"
      effect="fade"
      class="carousel"
    >
      <n-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <div
          class="carousel-item"
          :style="`background-image: url(${item.image})`"
        >
          <div class="carousel-content">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <n-button type="primary" size="large">了解更多</n-button>
          </div>
        </div>
      </n-carousel-item>
    </n-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NCarousel, NCarouselItem, NButton } from "naive-ui";

// 轮播图数据
const carouselItems = ref([
  {
    title: "东周青铜器专题展",
    description: "展示东周时期精美的青铜器文化，感受中国古代工艺的卓越成就",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1574&q=80",
  },
  {
    title: "汉唐丝绸之路文物展",
    description: "探索丝绸之路的文化交流与商贸往来，见证东西方文明的碰撞与融合",
    image:
      "https://images.unsplash.com/photo-1464185748716-8e6de44c63bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    title: "明清瓷器珍品展",
    description:
      '欣赏中国瓷器艺术的巅峰之作，领略"白若玉，明若镜，薄如纸，声如磬"的独特魅力',
    image:
      "https://images.unsplash.com/photo-1626083712632-36dc45c1a9fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1571&q=80",
  },
]);
</script>

<style scoped>
.carousel {
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
}

.carousel-item {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
}

.carousel-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

.carousel-content {
  position: relative;
  max-width: 500px;
  padding: 0 48px;
  color: white;
}

.carousel-content h2 {
  font-size: 32px;
  margin-bottom: 16px;
}

.carousel-content p {
  font-size: 16px;
  margin-bottom: 24px;
  opacity: 0.9;
}
</style>
