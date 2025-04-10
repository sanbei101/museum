<template>
  <div class="artifact-display-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>藏品浏览</h1>
      <p class="subtitle">探索我们的丰富藏品，感受历史的脉搏</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <n-input-group>
          <n-input v-model:value="searchQuery" placeholder="搜索藏品名称" />
          <n-button type="primary" @click="handleSearch">
            <template #icon>
              <Search />
            </template>
            搜索
          </n-button>
        </n-input-group>

        <div class="filter-options">
          <n-select
            v-model:value="filterEra"
            placeholder="时代"
            :options="eraOptions"
            clearable
            @update:value="handleFilter"
          />
          <n-select
            v-model:value="filterCategory"
            placeholder="类别"
            :options="categoryOptions"
            clearable
            @update:value="handleFilter"
          />
          <n-select
            v-model:value="sortBy"
            placeholder="排序方式"
            :options="sortOptions"
            @update:value="handleSort"
          />
        </div>
      </div>
    </div>

    <!-- 藏品列表 -->
    <div class="artifacts-section">
      <n-grid cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="item in displayedArtifacts" :key="item.id">
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
                <n-button text size="small" @click="toggleFavorite(item)">
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

    <!-- 空状态展示 -->
    <div v-if="displayedArtifacts.length === 0" class="empty-state">
      <n-empty description="未找到符合条件的藏品" />
    </div>

    <!-- 分页器 -->
    <div class="pagination-container">
      <n-pagination
        v-model:page="currentPage"
        :page-count="totalPages"
        :page-size="pageSize"
        :page-sizes="[8, 16, 32, 64]"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        show-size-picker
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
  NCard,
  NGrid,
  NGridItem,
  NButton,
  NTag,
  NInput,
  NInputGroup,
  NSelect,
  NPagination,
  NEmpty,
} from "naive-ui";
import { Heart, Search } from "lucide-vue-next";
import type { Artifact } from "@/api/type";
import { FetchArtifact } from "@/api/artifact";

// 藏品类型定义
type ArtifactItem = Artifact & {
  favorite: boolean;
  likes: number;
};

// 响应式状态
const artifacts = ref<ArtifactItem[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const filterEra = ref("");
const filterCategory = ref(null);
const currentPage = ref(1);
const pageSize = ref(16);
const totalArtifacts = ref(0);
const sortBy = ref("default");

// 筛选选项
const eraOptions = ref([
  { label: "商代", value: "商代" },
  { label: "唐代", value: "唐代" },
  { label: "宋代", value: "宋代" },
  { label: "元代", value: "元代" },
  { label: "明代", value: "明代" },
  { label: "清代", value: "清代" },
]);

const categoryOptions = ref([
  { label: "青铜器", value: "青铜器" },
  { label: "陶瓷器", value: "陶瓷器" },
  { label: "书画", value: "书画" },
  { label: "玉石器", value: "玉石器" },
  { label: "漆器", value: "漆器" },
]);

const sortOptions = ref([
  { label: "默认排序", value: "default" },
  { label: "名称 A-Z", value: "name-asc" },
  { label: "名称 Z-A", value: "name-desc" },
  { label: "热门程度", value: "popularity" },
]);

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalArtifacts.value / pageSize.value);
});

// 计算显示的藏品
const displayedArtifacts = computed(() => {
  let result = [...artifacts.value];

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // 时代过滤
  if (filterEra.value) {
    result = result.filter((item) => item.era.includes(filterEra.value));
  }

  // 类别过滤
  if (filterCategory.value) {
    result = result.filter((item) => item.category === filterCategory.value);
  }

  // 排序
  if (sortBy.value === "name-asc") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === "name-desc") {
    result.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy.value === "popularity") {
    result.sort((a, b) => b.likes - a.likes);
  }

  return result;
});

// 加载藏品数据
const fetchArtifacts = async () => {
  loading.value = true;
  try {
    const res = await FetchArtifact(currentPage.value, pageSize.value);

    // 清空当前页的数据
    artifacts.value = [];

    // 处理返回的数据
    res.forEach((item) => {
      artifacts.value.push({
        ...item,
        likes: Math.floor(Math.random() * 1000), // 随机生成点赞数
        favorite: false,
      });
    });

    // 假设总数为50，实际应该从API获取
    totalArtifacts.value = 50;
  } catch (error) {
    console.error("获取藏品失败:", error);
  } finally {
    loading.value = false;
  }
};

// 收藏/取消收藏
const toggleFavorite = (item: ArtifactItem) => {
  item.favorite = !item.favorite;
  if (item.favorite) {
    item.likes++;
  } else {
    item.likes--;
  }
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
};

// 处理筛选
const handleFilter = () => {
  currentPage.value = 1;
};

// 处理排序
const handleSort = () => {
  currentPage.value = 1;
};

// 处理页码改变
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 处理每页数量改变
const handlePageSizeChange = (pageSize: number) => {
  currentPage.value = 1;
  pageSize = pageSize;
};

// 监听页码和分页大小变化，重新获取数据
watch([currentPage, pageSize], () => {
  fetchArtifacts();
});

// 组件挂载时获取数据
onMounted(() => {
  fetchArtifacts();
});
</script>

<style scoped>
.artifact-display-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.filter-section {
  margin-bottom: 30px;
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 768px) {
  .filter-row {
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
}

.filter-options {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.artifacts-section {
  margin-bottom: 30px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 复用精选藏品组件的样式 */
.artifact-card,
.artifact-card:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
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
