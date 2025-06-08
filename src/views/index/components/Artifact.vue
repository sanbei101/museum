<template>
  <!-- 精选藏品区域 -->
  <div class="featured-section">
    <div class="section-header">
      <h2>精选藏品</h2>
      <n-button text @click="handleClick">查看全部 <ChevronRight /></n-button>
    </div>
    <n-grid cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="item in featuredItems" :key="item.id">
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
import { ref } from 'vue';
import { NCard, NGrid, NGridItem, NButton, NTag } from 'naive-ui';
import { Heart, ChevronRight } from 'lucide-vue-next';
import type { Artifact } from '@/api/type';
import { useRouter } from 'vue-router';
import { RouteName } from '@/router';
const router = useRouter();
// onMounted(async () => {
//   try {
//     const res = await FetchArtifact(1, 5);
//     res.items.forEach((item) => {
//       const artifact = {
//         id: item.id,
//         name: item.name,
//         era: item.era,
//         category: item.category,
//         description: item.description,
//         image: item.image,
//         likes: item.likes,
//         favorite: false
//       };
//       featuredItems.value.push(artifact);
//     });
//   } catch (error) {
//     console.error('Error fetching artifacts:', error);
//   }
// });
const handleClick = () => {
  console.log(RouteName.ArtifactDisplay);
  router.push({
    name: RouteName.ArtifactDisplay
  });
};
type FeaturedItem = Artifact & {
  favorite: boolean;
};
// 精选藏品数据
const featuredItems = ref<FeaturedItem[]>([
  {
    id: '1',
    name: '商代四羊方尊',
    era: '商代晚期',
    category: '青铜器',
    description: '四羊方尊是中国出土的商代青铜礼器，器身四角有羊首装饰',
    image:
      'https://images.unsplash.com/photo-1660412096990-91798fa8b121?q=80&w=2419&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    likes: 256,
    favorite: false
  },
  {
    id: '2',
    name: '唐三彩骆驼载乐俑',
    era: '唐代',
    category: '陶瓷器',
    description: '唐三彩是唐代陶瓷艺术的代表，此俑展现了唐代丝绸之路的商贸景象。',
    image:
      'https://images.unsplash.com/photo-1577083288073-40892c0860a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    likes: 189,
    favorite: true
  }
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
