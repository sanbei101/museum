<template>
  <div class="apple-museum">
    <Header></Header>

    <!-- 主展示区域 -->
    <main>
      <!-- 全屏展示轮播 -->
      <div class="fullscreen-carousel">
        <transition-group name="fade">
          <div
            v-for="(item, index) in collectionItems"
            :key="item.title"
            v-show="currentIndex === index"
            class="carousel-item">
            <div class="item-content">
              <div class="item-text">
                <h5 class="item-category">{{ item.category }}</h5>
                <h1 class="item-title">{{ item.title }}</h1>
                <p class="item-desc">{{ item.description }}</p>
                <button class="learn-more">
                  了解更多
                  <LucideArrowRight class="button-icon" />
                </button>
              </div>
              <div class="item-image-container">
                <img :src="item.imageUrl" :alt="item.altText" class="item-image" />
              </div>
            </div>
          </div>
        </transition-group>

        <!-- 轮播控制器 -->
        <div class="carousel-controls">
          <button class="prev-btn" @click="prevSlide">
            <LucideChevronLeft class="control-icon" />
          </button>
          <div class="indicators">
            <span
              v-for="(_, i) in collectionItems"
              :key="i"
              :class="['indicator', { active: currentIndex === i }]"
              @click="goToSlide(i)"></span>
          </div>
          <button class="next-btn" @click="nextSlide">
            <LucideChevronRight class="control-icon" />
          </button>
        </div>
      </div>

      <!-- 底部预览区域 -->
      <div class="preview-gallery">
        <div
          v-for="(item, i) in collectionItems"
          :key="i"
          :class="['preview-item', { active: currentIndex === i }]"
          @click="goToSlide(i)">
          <img :src="item.imageUrl" :alt="item.altText" />
          <div class="preview-title">{{ item.title }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/views/index/components/Header.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  Aperture as LucideAperture,
  ArrowRight as LucideArrowRight,
  ChevronLeft as LucideChevronLeft,
  ChevronRight as LucideChevronRight
} from 'lucide-vue-next';

type CollectionItem = {
  imageUrl: string;
  altText: string;
  title: string;
  description: string;
  category: string;
};

const collectionItems = ref<CollectionItem[]>([
  {
    imageUrl: 'https://placehold.co/1600x900/E8DED2/5A4E44?text=陶器+文物',
    altText: '古代陶器',
    title: '彩绘陶罐',
    category: '新石器时代',
    description:
      '这件彩绘陶罐代表了中国新石器时代晚期的高超陶艺工艺，呈现出令人惊叹的细节与造型。其精美的图案不仅展示了早期文明的艺术成就，也反映了当时社会的精神信仰与美学理念。'
  },
  {
    imageUrl: 'https://placehold.co/1600x900/D8E2DC/4B5358?text=青铜器',
    altText: '青铜鼎',
    title: '司母戊鼎',
    category: '商代晚期',
    description:
      '司母戊鼎作为中国现存最大的商代青铜器，重达832.84公斤，象征着至高无上的权力与威严。其铸造技艺的精湛和巨大的体量展示了古代中国冶金技术的卓越成就，被誉为"镇国之宝"。'
  },
  {
    imageUrl: 'https://placehold.co/1600x900/F5EBE0/6F5E53?text=书画作品',
    altText: '山水画',
    title: '溪山行旅图',
    category: '北宋名作',
    description:
      '范宽的《溪山行旅图》是北宋山水画的巅峰之作，以雄伟的山峰、苍茫的云雾和细微的人物构成一幅壮丽的自然景观。画中"远景重山如黛，中近景层峦叠嶂"的构图手法，开创了中国山水画的新境界。'
  },
  {
    imageUrl: 'https://placehold.co/1600x900/E1E5EA/3C3C3C?text=玉器',
    altText: '玉璧',
    title: '龙纹玉璧',
    category: '战国工艺',
    description:
      '这件龙纹玉璧采用上等和田白玉精心雕琢，通体晶莹剔透，龙纹栩栩如生。作为古代礼器和权力象征，它不仅展示了战国时期玉器工艺的高超水平，也反映了中华文明对龙的崇拜与敬仰。'
  },
  {
    imageUrl: 'https://placehold.co/1600x900/FFE5D9/7A4F40?text=瓷器',
    altText: '青花瓷瓶',
    title: '青花缠枝莲纹瓶',
    category: '明代瓷器',
    description:
      '这件青花缠枝莲纹瓶出自明代景德镇官窑，胎质洁白细腻，釉面光润如玉。其青花发色纯正浓艳，莲花纹饰绘制流畅自然，体现了中国瓷器在明代达到的艺术与工艺巅峰，是中国传统审美的完美体现。'
  }
]);

const currentIndex = ref(0);
let autoplayInterval: number | null = null;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % collectionItems.value.length;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + collectionItems.value.length) % collectionItems.value.length;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

const startAutoplay = () => {
  stopAutoplay();
  autoplayInterval = window.setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
};

onMounted(() => {
  startAutoplay();
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  stopAutoplay();
  window.removeEventListener('keydown', handleKeydown);
});

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
  }
};
</script>

<style scoped>
/* 全局样式 */
.apple-museum {
  --primary-color: #000;
  --secondary-color: #86868b;
  --highlight-color: #0071e3;
  --background-color: #fff;
  --text-color: #1d1d1f;

  font-family: 'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* 导航栏样式 */
.museum-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 22px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.logo {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 18px;
}

.logo .icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

/* 主展示区样式 */
main {
  padding-top: 48px;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.fullscreen-carousel {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 8%;
}

.item-text {
  width: 40%;
  z-index: 2;
  animation: slideInFromLeft 1s ease-out;
}

.item-category {
  font-size: 16px;
  font-weight: 500;
  color: var(--highlight-color);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.item-title {
  font-size: 56px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 16px;
}

.item-desc {
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 32px;
  color: var(--secondary-color);
}

.learn-more {
  display: flex;
  align-items: center;
  background-color: var(--highlight-color);
  color: white;
  border: none;
  border-radius: 980px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.learn-more:hover {
  background-color: #0062c3;
  transform: scale(1.02);
}

.button-icon {
  margin-left: 8px;
  width: 16px;
  height: 16px;
}

.item-image-container {
  width: 55%;
  height: 70%;
  animation: scaleIn 1.2s ease-out;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.2);
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.carousel-item:hover .item-image {
  transform: scale(1.05);
}

/* 轮播控制器样式 */
.carousel-controls {
  position: absolute;
  bottom: 40px;
  left: 8%;
  display: flex;
  align-items: center;
  z-index: 10;
}

.prev-btn,
.next-btn {
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prev-btn:hover,
.next-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.control-icon {
  width: 20px;
  height: 20px;
  color: var(--primary-color);
}

.indicators {
  display: flex;
  gap: 8px;
  margin: 0 16px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: var(--primary-color);
  width: 24px;
  border-radius: 4px;
}

/* 底部预览区域 */
.preview-gallery {
  height: 100px;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 0 5%;
  background-color: #f5f5f7;
}

.preview-item {
  height: 100%;
  width: 150px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-item.active {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  opacity: 1;
}

.preview-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  padding: 8px;
  font-size: 12px;
  text-align: center;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .item-content {
    flex-direction: column-reverse;
    padding: 0 5%;
  }

  .item-text,
  .item-image-container {
    width: 90%;
  }

  .item-image-container {
    height: 40%;
    margin-bottom: 20px;
  }

  .item-title {
    font-size: 36px;
  }

  .carousel-controls {
    bottom: 140px;
  }

  .preview-gallery {
    display: none;
  }
}

@media (max-width: 640px) {
  .item-title {
    font-size: 28px;
  }

  .item-desc {
    font-size: 14px;
  }

  .museum-nav {
    padding: 0 12px;
  }

  nav {
    gap: 15px;
  }

  nav a {
    font-size: 12px;
  }
}
</style>
