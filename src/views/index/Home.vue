<template>
  <div class="home-container">
    <Header></Header>
    <n-layout-content class="content">
      <!-- 轮播图区域 -->
      <Carousel />
      <!-- 搜索和筛选区域 -->
      <Search></Search>
      <!-- 精选藏品区域 -->
      <Artifact></Artifact>
      <!-- 数据统计区域 -->
      <Statistic></Statistic>
    </n-layout-content>
    <!-- 页脚区域 -->
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';
import { NLayoutContent } from 'naive-ui';
import Carousel from './components/Carousel.vue';
import Artifact from './components/Artifact.vue';
import Statistic from './components/Statistic.vue';
import Footer from './components/Footer.vue';
import Search from './components/Search.vue';
</script>

<style>
/* 内容区域 */
.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

@media (max-width: 768px) {
  .carousel {
    height: 300px;
  }

  .carousel-item {
    height: 300px;
  }

  .carousel-content {
    padding: 0 24px;
  }

  .carousel-content h2 {
    font-size: 24px;
  }

  .news-card .news-content {
    flex-direction: column;
  }

  .news-image {
    flex: 0 0 auto;
  }
}
</style>
