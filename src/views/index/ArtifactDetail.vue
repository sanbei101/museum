<template>
  <div class="artifact-detail-container">
    <!-- 返回按钮 -->
    <div class="back-button">
      <n-button @click="router.back()" quaternary circle>
        <template #icon><ArrowLeft /></template>
      </n-button>
      <span>返回藏品列表</span>
    </div>

    <div class="artifact-content" v-if="artifact">
      <!-- 基本信息区域 -->
      <div class="artifact-main">
        <div class="artifact-image-section">
          <div class="main-image-wrapper">
            <img :src="artifact.image" class="main-image" />
            <div class="image-actions">
              <n-button circle quaternary class="img-action-btn">
                <template #icon><Maximize2 /></template>
              </n-button>
              <n-button
                circle
                quaternary
                class="img-action-btn"
                @click="toggleFavorite"
              >
                <template #icon>
                  <Heart v-if="!isFavorite" />
                  <Heart v-else style="color: red; fill: red" />
                </template>
              </n-button>
              <n-button circle quaternary class="img-action-btn">
                <template #icon><Share /></template>
              </n-button>
            </div>
          </div>
          <div class="thumbnail-gallery">
            <n-scrollbar x-scrollable>
              <div class="thumbnails">
                <img :src="artifact.image" class="thumbnail active" />
                <img
                  v-for="i in 4"
                  :key="i"
                  :src="artifact.image"
                  class="thumbnail"
                />
              </div>
            </n-scrollbar>
          </div>
        </div>

        <div class="artifact-info-section">
          <h1 class="artifact-name">{{ artifact.name }}</h1>
          <div class="artifact-meta">
            <n-space align="center">
              <n-tag type="success">{{ artifact.era }}</n-tag>
              <n-tag type="info">{{ artifact.category }}</n-tag>
              <n-tag type="warning">馆藏精品</n-tag>
            </n-space>
            <div class="artifact-popularity">
              <n-space align="center">
                <n-icon><Eye /></n-icon> {{ randomViews }}
                <n-icon><Heart /></n-icon> {{ artifact.likes }}
              </n-space>
            </div>
          </div>

          <div class="artifact-attributes">
            <div class="attribute-item">
              <div class="attribute-label">收藏时间</div>
              <div class="attribute-value">{{ formatDate() }}</div>
            </div>
            <div class="attribute-item">
              <div class="attribute-label">出土地点</div>
              <div class="attribute-value">{{ randomLocation }}</div>
            </div>
            <div class="attribute-item">
              <div class="attribute-label">尺寸大小</div>
              <div class="attribute-value">{{ randomDimensions }}</div>
            </div>
            <div class="attribute-item">
              <div class="attribute-label">材质</div>
              <div class="attribute-value">{{ randomMaterial }}</div>
            </div>
            <div class="attribute-item">
              <div class="attribute-label">保存状态</div>
              <div class="attribute-value">{{ randomCondition }}</div>
            </div>
          </div>

          <div class="artifact-description">
            <h3>藏品简介</h3>
            <p>{{ artifact.description }}</p>
            <p>{{ extendedDescription }}</p>
          </div>
        </div>
      </div>

      <!-- 文物历史与背景 -->
      <div class="artifact-section">
        <h2>历史背景</h2>
        <p>
          这件{{ artifact.name }}是{{
            artifact.era
          }}时期的代表性文物,具有极高的历史研究价值。通过对其进行深入研究,我们可以了解当时的社会生活、文化艺术以及工艺水平。
        </p>
        <p>
          据史料记载,此类文物最早出现于{{
            artifact.era
          }}初期,随着技术的发展和艺术观念的变化,其形制和纹饰也在不断演变。本件藏品制作工艺精湛,代表了{{
            artifact.era
          }}
          {{ artifact.category }}的最高水平,是研究该时期历史文化的重要实物资料。
        </p>
      </div>

      <!-- 文物特征 -->
      <div class="artifact-section">
        <h2>艺术特征</h2>
        <p>
          本件{{ artifact.name }}具有{{
            artifact.era
          }}典型的艺术风格,其纹饰构图严谨,线条流畅,体现了古代工匠的高超技艺。
        </p>
        <div class="feature-boxes">
          <div class="feature-box">
            <h4>造型特点</h4>
            <p>比例协调,结构稳定,线条流畅,整体造型庄重典雅。</p>
          </div>
          <div class="feature-box">
            <h4>纹饰特点</h4>
            <p>纹饰布局严谨,题材丰富,具有强烈的时代特征和地域风格。</p>
          </div>
          <div class="feature-box">
            <h4>工艺特点</h4>
            <p>制作精细,技艺高超,反映了当时先进的工艺水平。</p>
          </div>
        </div>
      </div>

      <!-- 相关藏品 -->
      <div class="artifact-section">
        <h2>相关藏品</h2>
        <div class="related-artifacts">
          <div v-for="i in 4" :key="i" class="related-artifact">
            <img :src="artifact.image" class="related-image" />
            <div class="related-info">
              <h4>{{ artifact.name }}系列藏品 {{ i }}</h4>
              <p>{{ artifact.era }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="artifact-section comments-section">
        <h2>参观感言</h2>
        <div class="comment-form">
          <n-input
            v-model:value="commentText"
            type="textarea"
            placeholder="分享您对这件藏品的看法..."
            :autosize="{
              minRows: 3,
              maxRows: 5,
            }"
          />
          <div class="comment-actions">
            <n-button type="primary" @click="submitComment">发表评论</n-button>
          </div>
        </div>

        <div class="comments-list">
          <div
            v-for="(comment, index) in comments"
            :key="index"
            class="comment-item"
          >
            <div class="comment-avatar">
              <n-avatar
                :src="`https://i.pravatar.cc/150?u=${comment.author}`"
                round
              />
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-date">{{ comment.date }}</span>
              </div>
              <p class="comment-text">{{ comment.text }}</p>
              <div class="comment-actions">
                <n-button quaternary size="small">
                  <template #icon><ThumbsUp /></template> {{ comment.likes }}
                </n-button>
                <n-button quaternary size="small">回复</n-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载中状态 -->
    <div v-else class="loading-state">
      <n-spin size="large" />
      <p>正在加载藏品信息...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  NButton,
  NSpin,
  NTag,
  NSpace,
  NIcon,
  NAvatar,
  NInput,
  NScrollbar,
} from "naive-ui";
import {
  ArrowLeft,
  Heart,
  Share,
  Eye,
  Maximize2,
  ThumbsUp,
} from "lucide-vue-next";
import type { Artifact } from "@/api/type";

const route = useRoute();
const router = useRouter();

// 定义带有favorite和likes属性的ArtifactItem类型
type ArtifactItem = Artifact & {
  favorite: boolean;
  likes: number;
};

// 获取传递过来的藏品数据
const artifact = ref<ArtifactItem | null>(null);
const commentText = ref("");
const isFavorite = ref(false);

// 评论数据
const comments = ref([
  {
    author: "文物爱好者",
    date: "2023-05-15",
    text: "这件藏品的工艺非常精湛,是我见过的同时期作品中保存最完好的一件。",
    likes: 24,
  },
  {
    author: "历史研究者",
    date: "2023-05-10",
    text: "通过这件文物可以了解到当时的社会生活和审美取向,非常有研究价值。",
    likes: 18,
  },
  {
    author: "文化爱好者",
    date: "2023-05-03",
    text: "纹饰图案设计精妙,体现了古人的智慧,值得细细品味。",
    likes: 12,
  },
]);

// 随机生成的辅助数据
const randomViews = computed(() => Math.floor(Math.random() * 10000) + 2000);
const randomLocation = computed(() => {
  const locations = [
    "河南安阳",
    "陕西西安",
    "湖北荆州",
    "四川成都",
    "山西太原",
  ];
  return locations[Math.floor(Math.random() * locations.length)];
});
const randomDimensions = computed(() => {
  return `高 ${Math.floor(Math.random() * 100) + 10}cm,宽 ${
    Math.floor(Math.random() * 50) + 10
  }cm,重 ${Math.floor(Math.random() * 5) + 1}kg`;
});
const randomMaterial = computed(() => {
  const materials = ["青铜", "陶土", "瓷器", "玉石", "漆木"];
  return materials[Math.floor(Math.random() * materials.length)];
});
const randomCondition = computed(() => {
  const conditions = ["完好", "轻微损伤", "局部修复", "保存完整", "基本完好"];
  return conditions[Math.floor(Math.random() * conditions.length)];
});

// 扩展描述信息
const extendedDescription = computed(() => {
  return `这件${artifact.value?.name}是${
    artifact.value?.era
  }的典型代表作品,采用${
    randomMaterial.value
  }制作而成。其制作工艺精湛,纹饰精美,具有很高的艺术价值和历史研究价值。从出土情况看,该器物可能用于${
    Math.random() > 0.5 ? "祭祀活动" : "日常生活"
  },是研究${artifact.value?.era}社会生活和文化艺术的重要实物资料。`;
});

// 切换收藏状态
const toggleFavorite = () => {
  if (artifact.value) {
    isFavorite.value = !isFavorite.value;
    artifact.value.favorite = isFavorite.value;
    if (isFavorite.value) {
      artifact.value.likes++;
    } else {
      artifact.value.likes--;
    }
  }
};

// 提交评论
const submitComment = () => {
  if (commentText.value.trim()) {
    comments.value.unshift({
      author: "游客" + Math.floor(Math.random() * 1000),
      date: new Date().toISOString().split("T")[0],
      text: commentText.value,
      likes: 0,
    });
    commentText.value = "";
  }
};

// 格式化日期
const formatDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - Math.floor(Math.random() * 5) - 1);
  return date.toISOString().split("T")[0];
};

onMounted(() => {
  // 从路由获取藏品数据
  const itemStr = route.query.item as string;
  if (itemStr) {
    try {
      artifact.value = JSON.parse(itemStr) as ArtifactItem;
      isFavorite.value = artifact.value.favorite || false;
    } catch (e) {
      console.error("解析藏品数据失败", e);
    }
  }

  // 如果没有获取到数据,重定向回列表页
  if (!artifact.value) {
    console.error("未能获取到藏品数据");
    // 实际开发中,这里可以根据id从API获取数据
    // const id = route.params.id;
    // fetchArtifactDetail(id);
  }
});
</script>

<style scoped>
.artifact-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  cursor: pointer;
}

.artifact-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.artifact-main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

@media (min-width: 768px) {
  .artifact-main {
    grid-template-columns: 1fr 1fr;
  }
}

.artifact-image-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.main-image {
  width: 100%;
  height: auto;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}

.image-actions {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
}

.img-action-btn {
  background-color: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(4px);
}

.thumbnail-gallery {
  margin-top: 10px;
}

.thumbnails {
  display: flex;
  gap: 10px;
  padding: 5px 0;
}

.thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.thumbnail:hover {
  opacity: 0.9;
}

.thumbnail.active {
  opacity: 1;
  box-shadow: 0 0 0 2px #18a058;
}

.artifact-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.artifact-name {
  font-size: 28px;
  margin: 0;
  font-weight: bold;
}

.artifact-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.artifact-popularity {
  color: #666;
  font-size: 14px;
}

.artifact-attributes {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.attribute-item {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.attribute-item:last-child {
  border-bottom: none;
}

.attribute-label {
  font-weight: bold;
  width: 100px;
  color: #666;
}

.attribute-value {
  flex: 1;
}

.artifact-description {
  line-height: 1.6;
}

.artifact-description h3 {
  font-size: 18px;
  margin: 0 0 12px 0;
}

.artifact-section {
  margin: 40px 0;
}

.artifact-section h2 {
  font-size: 24px;
  border-bottom: 2px solid #18a058;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.feature-boxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.feature-box {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.feature-box h4 {
  margin-top: 0;
  color: #18a058;
}

.related-artifacts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.related-artifact {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
}

.related-artifact:hover {
  transform: translateY(-4px);
}

.related-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.related-info {
  padding: 12px;
}

.related-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.related-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.comments-section {
  margin-top: 40px;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 16px;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: bold;
}

.comment-date {
  color: #999;
  font-size: 12px;
}

.comment-text {
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}
</style>
