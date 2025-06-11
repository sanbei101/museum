import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type Exhibition, type Page } from '../api/type';
import { useArtifactStore } from './artifact';

export const useExhibitionStore = defineStore('exhibition', () => {
  // 状态
  const exhibitions = ref<Exhibition[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const initializeData = () => {
    if (exhibitions.value.length === 0) {
      const artifactStore = useArtifactStore();

      artifactStore.initializeData();

      const allArtifactIds = artifactStore.artifacts.map((artifact) => artifact.id);

      const imageList = [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3',
        'https://images.unsplash.com/photo-1554907984-15263bfd63bd'
      ];

      const locationList = ['一号展厅', '二号展厅', '三号展厅', '特别展厅', '临时展厅'];

      const generatedExhibitions: Exhibition[] = [];
      for (let i = 0; i < 20; i++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) - 15);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 60) + 30);

        const now = new Date();
        let status: 'upcoming' | 'ongoing' | 'ended';
        if (startDate > now) {
          status = 'upcoming';
        } else if (endDate < now) {
          status = 'ended';
        } else {
          status = 'ongoing';
        }

        // 从真实的文物ID中随机选择3-8个
        const artifactCount = Math.floor(Math.random() * 6) + 3;
        const artifactIds: string[] = [];

        // 使用Fisher-Yates算法随机打乱数组，然后取前N个
        const shuffledIds = [...allArtifactIds].sort(() => Math.random() - 0.5);
        for (let j = 0; j < Math.min(artifactCount, shuffledIds.length); j++) {
          artifactIds.push(shuffledIds[j]);
        }

        const exhibition: Exhibition = {
          id: (i + 1).toString(),
          name: `${
            ['古代瓷器', '青铜文明', '玉器精品', '书画名作', '丝绸之路', '民族文化', '现代艺术'][
              i % 7
            ]
          }展览${i + 1}`,
          description: `这是第${i + 1}个展览的详细描述，展示了丰富的文化内涵和历史价值。`,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          image: imageList[i % imageList.length],
          artifactIds,
          status,
          location: locationList[i % locationList.length],
          likes: Math.floor(Math.random() * 200)
        };
        generatedExhibitions.push(exhibition);
      }

      exhibitions.value = generatedExhibitions;
    }
  };

  // 计算属性
  const totalItems = computed(() => exhibitions.value.length);

  const ongoingExhibitions = computed(() =>
    exhibitions.value.filter((exhibition) => exhibition.status === 'ongoing')
  );

  const upcomingExhibitions = computed(() =>
    exhibitions.value.filter((exhibition) => exhibition.status === 'upcoming')
  );

  const fetchExhibitions = async (page: number, perPage: number): Promise<Page<Exhibition>> => {
    loading.value = true;
    error.value = null;

    try {
      if (exhibitions.value.length === 0) {
        initializeData();
      }

      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedItems = exhibitions.value.slice(startIndex, endIndex);

      const result: Page<Exhibition> = {
        items: paginatedItems,
        page,
        perPage,
        totalItems: exhibitions.value.length,
        totalPages: Math.ceil(exhibitions.value.length / perPage)
      };

      return result;
    } catch (err) {
      error.value = '获取展览数据失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 创建展览
  const createExhibition = async (data: Omit<Exhibition, 'id' | 'likes'>): Promise<Exhibition> => {
    loading.value = true;
    error.value = null;

    try {
      const newExhibition: Exhibition = {
        ...data,
        id: Date.now().toString(),
        likes: 0
      };

      exhibitions.value.push(newExhibition);
      return newExhibition;
    } catch (err) {
      error.value = '创建展览失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 更新展览
  const updateExhibition = async (exhibitionId: string, data: Exhibition): Promise<Exhibition> => {
    loading.value = true;
    error.value = null;

    try {
      const index = exhibitions.value.findIndex((item) => item.id === exhibitionId);
      if (index === -1) {
        throw new Error('展览不存在');
      }
      exhibitions.value[index] = { ...data, id: exhibitionId };
      return exhibitions.value[index];
    } catch (err) {
      error.value = '更新展览失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 删除展览
  const deleteExhibition = async (exhibitionId: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const index = exhibitions.value.findIndex((item) => item.id === exhibitionId);
      if (index === -1) {
        throw new Error('展览不存在');
      }

      exhibitions.value.splice(index, 1);
    } catch (err) {
      error.value = '删除展览失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 根据ID获取展览
  const getExhibitionById = (id: string): Exhibition | undefined => {
    return exhibitions.value.find((item) => item.id === id);
  };

  // 为展览添加文物
  const addArtifactToExhibition = async (
    exhibitionId: string,
    artifactId: string
  ): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const exhibition = exhibitions.value.find((item) => item.id === exhibitionId);
      if (!exhibition) {
        throw new Error('展览不存在');
      }

      if (!exhibition.artifactIds.includes(artifactId)) {
        exhibition.artifactIds.push(artifactId);
      }
    } catch (err) {
      error.value = '添加文物到展览失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 从展览中移除文物
  const removeArtifactFromExhibition = async (
    exhibitionId: string,
    artifactId: string
  ): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const exhibition = exhibitions.value.find((item) => item.id === exhibitionId);
      if (!exhibition) {
        throw new Error('展览不存在');
      }

      const index = exhibition.artifactIds.indexOf(artifactId);
      if (index > -1) {
        exhibition.artifactIds.splice(index, 1);
      }
    } catch (err) {
      error.value = '从展览中移除文物失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 批量分配文物给展览
  const assignArtifactsToExhibition = async (
    exhibitionId: string,
    artifactIds: string[]
  ): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const exhibition = exhibitions.value.find((item) => item.id === exhibitionId);
      if (!exhibition) {
        throw new Error('展览不存在');
      }

      // 合并文物ID并去重
      const uniqueArtifactIds = [...new Set([...exhibition.artifactIds, ...artifactIds])];
      exhibition.artifactIds = uniqueArtifactIds;
    } catch (err) {
      error.value = '分配文物到展览失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 清除错误
  const clearError = () => {
    error.value = null;
  };

  return {
    exhibitions,
    loading,
    error,
    totalItems,
    ongoingExhibitions,
    upcomingExhibitions,
    // 方法
    fetchExhibitions,
    createExhibition,
    updateExhibition,
    deleteExhibition,
    getExhibitionById,
    addArtifactToExhibition,
    removeArtifactFromExhibition,
    assignArtifactsToExhibition,
    clearError,
    initializeData
  };
});
