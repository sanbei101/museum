<template>
  <div class="exhibition-container">
    <Header style="margin-bottom: 1rem"></Header>
    <div v-if="currentView === 'list'" class="exhibition-list">
      <n-card>
        <template #header>
          <div class="header-content">
            <h2>
              <Calendar class="icon" />
              展览列表
            </h2>
            <n-space>
              <n-select
                v-model:value="statusFilter"
                :options="statusOptions"
                placeholder="筛选状态"
                style="width: 120px" />
              <n-button @click="refreshData">
                <RotateCcw class="icon" />
                刷新
              </n-button>
            </n-space>
          </div>
        </template>

        <n-spin :show="loading">
          <n-grid :cols="1" :x-gap="16" :y-gap="16" responsive="screen">
            <n-grid-item v-for="exhibition in filteredExhibitions" :key="exhibition.id">
              <n-card hoverable class="exhibition-card" @click="viewExhibitionDetail(exhibition)">
                <div class="exhibition-content">
                  <div class="exhibition-image">
                    <n-image
                      :src="exhibition.image"
                      :alt="exhibition.name"
                      width="200"
                      height="150"
                      object-fit="cover"
                      lazy />
                  </div>
                  <div class="exhibition-info">
                    <h3>{{ exhibition.name }}</h3>
                    <p class="description">{{ exhibition.description }}</p>
                    <n-space class="exhibition-meta">
                      <n-tag :type="getStatusType(exhibition.status)">
                        {{ getStatusText(exhibition.status) }}
                      </n-tag>
                      <n-text depth="3">
                        <MapPin class="meta-icon" />
                        {{ exhibition.location }}
                      </n-text>
                      <n-text depth="3">
                        <Clock class="meta-icon" />
                        {{ exhibition.startDate }} - {{ exhibition.endDate }}
                      </n-text>
                      <n-text depth="3">
                        <Heart class="meta-icon" />
                        {{ exhibition.likes }} 点赞
                      </n-text>
                    </n-space>
                    <div class="artifact-count">
                      <Package class="meta-icon" />
                      {{ exhibition.artifactIds.length }} 件文物
                    </div>
                  </div>
                  <div class="exhibition-actions">
                    <n-button quaternary circle @click.stop="viewExhibitionDetail(exhibition)">
                      <Eye class="icon" />
                    </n-button>
                  </div>
                </div>
              </n-card>
            </n-grid-item>
          </n-grid>

          <n-empty v-if="filteredExhibitions.length === 0" description="暂无展览数据" />
        </n-spin>
      </n-card>
    </div>

    <!-- 展览详情 -->
    <div v-else-if="currentView === 'detail'" class="exhibition-detail">
      <n-card>
        <template #header>
          <div class="header-content">
            <n-button @click="backToList">
              <ArrowLeft class="icon" />
              返回列表
            </n-button>
            <h2>{{ selectedExhibition?.name }}</h2>
          </div>
        </template>

        <div v-if="selectedExhibition" class="detail-content">
          <!-- 展览基本信息 -->
          <div class="exhibition-banner">
            <n-image
              :src="selectedExhibition.image"
              :alt="selectedExhibition.name"
              width="100%"
              height="300"
              object-fit="fill" />
            <div class="banner-overlay">
              <h1>{{ selectedExhibition.name }}</h1>
              <n-tag :type="getStatusType(selectedExhibition.status)" size="large">
                {{ getStatusText(selectedExhibition.status) }}
              </n-tag>
            </div>
          </div>

          <n-grid :cols="1" :x-gap="16" :y-gap="16" class="detail-grid">
            <!-- 展览信息卡片 -->
            <n-grid-item>
              <n-card title="展览信息">
                <n-descriptions :column="2" bordered>
                  <n-descriptions-item label="展览名称">
                    {{ selectedExhibition.name }}
                  </n-descriptions-item>
                  <n-descriptions-item label="展览地点">
                    <MapPin class="meta-icon" />
                    {{ selectedExhibition.location }}
                  </n-descriptions-item>
                  <n-descriptions-item label="开始时间">
                    <Calendar class="meta-icon" />
                    {{ selectedExhibition.startDate }}
                  </n-descriptions-item>
                  <n-descriptions-item label="结束时间">
                    <Calendar class="meta-icon" />
                    {{ selectedExhibition.endDate }}
                  </n-descriptions-item>
                  <n-descriptions-item label="展览状态">
                    <n-tag :type="getStatusType(selectedExhibition.status)">
                      {{ getStatusText(selectedExhibition.status) }}
                    </n-tag>
                  </n-descriptions-item>
                  <n-descriptions-item label="点赞数量">
                    <Heart class="meta-icon" />
                    {{ selectedExhibition.likes }}
                  </n-descriptions-item>
                </n-descriptions>
                <n-divider />
                <h4>展览描述</h4>
                <p>{{ selectedExhibition.description }}</p>
              </n-card>
            </n-grid-item>

            <!-- 展览文物列表 -->
            <n-grid-item>
              <n-card>
                <template #header>
                  <div class="header-content">
                    <h3>
                      <Package class="icon" />
                      展览文物 ({{ exhibitionArtifacts.length }} 件)
                    </h3>
                  </div>
                </template>

                <n-spin :show="artifactLoading">
                  <n-grid :cols="1" :x-gap="16" :y-gap="16" v-if="exhibitionArtifacts.length > 0">
                    <n-grid-item v-for="artifact in exhibitionArtifacts" :key="artifact.id">
                      <n-card hoverable class="artifact-card">
                        <div class="artifact-content">
                          <div class="artifact-image">
                            <n-image
                              :src="artifact.image"
                              :alt="artifact.name"
                              width="120"
                              height="120"
                              object-fit="cover"
                              lazy />
                          </div>
                          <div class="artifact-info">
                            <h4>{{ artifact.name }}</h4>
                            <p class="artifact-description">{{ artifact.description }}</p>
                            <n-space class="artifact-meta">
                              <n-tag size="small">{{ artifact.era }}</n-tag>
                              <n-tag size="small" type="info">{{ artifact.category }}</n-tag>
                            </n-space>
                            <div class="artifact-stats">
                              <n-space>
                                <span>
                                  <Heart class="meta-icon" />
                                  {{ artifact.likes }}
                                </span>
                              </n-space>
                            </div>
                          </div>
                        </div>
                      </n-card>
                    </n-grid-item>
                  </n-grid>

                  <n-empty v-else description="该展览暂无文物" />
                </n-spin>
              </n-card>
            </n-grid-item>
          </n-grid>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import {
  NCard,
  NGrid,
  NGridItem,
  NImage,
  NSpace,
  NTag,
  NText,
  NButton,
  NSpin,
  NEmpty,
  NSelect,
  NDescriptions,
  NDescriptionsItem,
  NDivider
} from 'naive-ui';
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Package,
  Eye,
  ArrowLeft,
  RotateCcw
} from 'lucide-vue-next';
import { useExhibitionStore } from '@/store/exhibition';
import { useArtifactStore } from '@/store/artifact';
import type { Exhibition, Artifact } from '@/api/type';
import Header from './components/Header.vue';
const exhibitionStore = useExhibitionStore();
const artifactStore = useArtifactStore();

// 状态
const currentView = ref<'list' | 'detail'>('list');
const selectedExhibition = ref<Exhibition | null>(null);
const statusFilter = ref<string>('all');
const artifactLoading = ref(false);

// 状态选项
const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'ongoing' },
  { label: '即将开始', value: 'upcoming' },
  { label: '已结束', value: 'ended' }
];

// 计算属性
const loading = computed(() => exhibitionStore.loading);

const filteredExhibitions = computed(() => {
  if (statusFilter.value === 'all') {
    return exhibitionStore.exhibitions;
  }
  return exhibitionStore.exhibitions.filter(
    (exhibition) => exhibition.status === statusFilter.value
  );
});

const exhibitionArtifacts = computed(() => {
  if (!selectedExhibition.value) return [];
  return selectedExhibition.value.artifactIds
    .map((id) => artifactStore.getArtifactById(id))
    .filter(Boolean) as Artifact[];
});

// 方法
const getStatusType = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'success';
    case 'upcoming':
      return 'warning';
    case 'ended':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'ongoing':
      return '进行中';
    case 'upcoming':
      return '即将开始';
    case 'ended':
      return '已结束';
    default:
      return '未知';
  }
};

const viewExhibitionDetail = (exhibition: Exhibition) => {
  selectedExhibition.value = exhibition;
  currentView.value = 'detail';
};

const backToList = () => {
  currentView.value = 'list';
  selectedExhibition.value = null;
};

const refreshData = () => {
  exhibitionStore.initializeData();
  artifactStore.initializeData();
};

// 生命周期
onMounted(() => {
  exhibitionStore.initializeData();
  artifactStore.initializeData();
});
</script>

<style scoped>
.exhibition-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2,
.header-content h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.icon {
  width: 18px;
  height: 18px;
}

.meta-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

.exhibition-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.exhibition-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.exhibition-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.exhibition-image {
  flex-shrink: 0;
}

.exhibition-info {
  flex: 1;
}

.exhibition-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.description {
  color: #666;
  margin: 8px 0;
  line-height: 1.5;
}

.exhibition-meta {
  margin: 12px 0;
}

.artifact-count {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}

.exhibition-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exhibition-banner {
  position: relative;
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 24px;
}

.banner-overlay h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
}

.detail-grid {
  margin-top: 24px;
}

.artifact-card {
  transition: all 0.3s ease;
}

.artifact-card:hover {
  transform: translateY(-1px);
}

.artifact-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.artifact-image {
  flex-shrink: 0;
}

.artifact-info {
  flex: 1;
}

.artifact-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.artifact-description {
  color: #666;
  margin: 8px 0;
  line-height: 1.4;
  font-size: 14px;
}

.artifact-meta {
  margin: 12px 0;
}

.artifact-stats {
  color: #666;
  font-size: 14px;
}

.artifact-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .exhibition-content {
    flex-direction: column;
  }

  .exhibition-image {
    width: 100%;
  }

  .artifact-content {
    flex-direction: column;
  }

  .artifact-image {
    width: 100%;
  }

  .banner-overlay h1 {
    font-size: 24px;
  }
}
</style>
