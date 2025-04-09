<template>
  <!-- 精选藏品区域 -->
  <div class="featured-section">
    <div class="section-header">
      <h2>精选藏品</h2>
      <n-button text>查看全部 <ChevronRight /></n-button>
    </div>
    <n-grid cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="(item, index) in featuredItems" :key="index">
        <n-card hoverable class="artifact-card">
          <template #cover>
            <img :src="item.image" class="artifact-image" />
          </template>
          <div class="artifact-info">
            <h3>{{ item.name }}</h3>
            <p class="artifact-era">{{ item.era }}</p>
            <p class="artifact-desc">{{ item.description }}</p>
            <div class="artifact-footer">
              <n-tag type="info" size="small">{{ item.category }}</n-tag>
              <n-button text size="small">
                <template #icon>
                  <Heart v-if="!item.favorite" />
                  <Heart v-else style="color: red" />
                </template>
                {{ item.likes }}
              </n-button>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NCard, NGrid, NGridItem, NButton, NTag } from "naive-ui";
import { Heart } from "lucide-vue-next";

// 精选藏品数据
const featuredItems = ref([
  {
    name: "商代四羊方尊",
    era: "商代晚期",
    category: "青铜器",
    description: "四羊方尊是中国出土的商代青铜礼器，器身四角有羊首装饰",
    image:
      "https://images.unsplash.com/photo-1609607847926-da4702f01fef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
    likes: 256,
    favorite: false,
  },
  {
    name: "唐三彩骆驼载乐俑",
    era: "唐代",
    category: "陶瓷器",
    description:
      "唐三彩是唐代陶瓷艺术的代表，此俑展现了唐代丝绸之路的商贸景象。",
    image:
      "https://images.unsplash.com/photo-1577083288073-40892c0860a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    likes: 189,
    favorite: true,
  },
  {
    name: "明宣德青花瓷器",
    era: "明代",
    category: "陶瓷器",
    description: "明代宣德时期的青花瓷器，以其独特的釉色和精美的纹饰著称于世。",
    image:
      "https://images.unsplash.com/photo-1549175511-0efad17dad72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    likes: 212,
    favorite: false,
  },
  {
    name: "汉代玉猪龙",
    era: "汉代",
    category: "玉器",
    description:
      "汉代玉器精品，以猪和龙的形象结合，体现了古代人们的宗教信仰和审美观念。",
    image:
      "https://images.unsplash.com/photo-1578327258672-7e9e3f19c3e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    likes: 178,
    favorite: false,
  },
]);
</script>

<style scoped>
/* 精选藏品区域 */
.featured-section,
.news-section {
  margin: 40px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  margin: 0;
}

.artifact-card,
.artifact-card:hover,
.news-card:hover {
  transform: translateY(-5px);
}

.artifact-image {
  height: 200px;
  width: 100%;
  object-fit: cover;
}

.artifact-info {
  padding: 8px 0;
}

.artifact-info h3 {
  font-size: 18px;
  margin: 8px 0;
}

.artifact-era {
  color: #666;
  font-size: 14px;
  margin: 4px 0;
}

.artifact-desc {
  font-size: 14px;
  margin: 8px 0;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.artifact-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
</style>
