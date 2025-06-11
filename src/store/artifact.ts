import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type Artifact, type Page } from '../api/type';

export const useArtifactStore = defineStore('artifact', () => {
  // 状态
  const artifacts = ref<Artifact[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 模拟一些初始数据
  const initializeData = () => {
    if (artifacts.value.length === 0) {
      const imageList = [
        'https://images.unsplash.com/photo-1644176041496-393d63975fba',
        'https://images.unsplash.com/photo-1695902263752-992a68bb8a5e',
        'https://images.unsplash.com/photo-1628074958552-7c9d0b4173b7',
        'https://images.unsplash.com/photo-1695902263752-992a68bb8a5e',
        'https://images.unsplash.com/photo-1745655604884-dd4fad590504',
        'https://images.unsplash.com/photo-1695902263725-96a82974d297',
        'https://images.unsplash.com/photo-1695902046953-1bf8caee5ac3',
        'https://images.unsplash.com/photo-1618722060945-b87f7326995b',
        'https://images.unsplash.com/photo-1742495212324-d488f48d0502'
      ];

      const eraList = ['唐代', '宋代', '元代', '明代', '清代'];

      const categoryList = [
        '陶瓷',
        '青铜器',
        '玉器',
        '书画',
        '金银器',
        '石器',
        '漆器',
        '织绣',
        '文房四宝',
        '其他'
      ];

      // 生成100条初始数据
      const generatedArtifacts: Artifact[] = [];
      for (let i = 0; i < 100; i++) {
        const artifact: Artifact = {
          id: (i + 1).toString(),
          name: `文物${i + 1}`,
          category: categoryList[i % categoryList.length],
          description: `这是文物的描述${i + 1}`,
          image: imageList[i % imageList.length],
          era: eraList[i % eraList.length],
          likes: Math.floor(Math.random() * 100) // 随机生成0-99之间的点赞数
        };
        generatedArtifacts.push(artifact);
      }

      artifacts.value = generatedArtifacts;
    }
  };

  // 计算属性
  const totalItems = computed(() => artifacts.value.length);

  const fetchArtifacts = async (page: number, perPage: number): Promise<Page<Artifact>> => {
    loading.value = true;
    error.value = null;

    try {
      initializeData();

      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedItems = artifacts.value.slice(startIndex, endIndex);

      const result: Page<Artifact> = {
        items: paginatedItems,
        page,
        perPage,
        totalItems: artifacts.value.length,
        totalPages: Math.ceil(artifacts.value.length / perPage)
      };

      return result;
    } catch (err) {
      error.value = '获取文物数据失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 创建文物
  const createArtifact = async (data: Omit<Artifact, 'id'>): Promise<Artifact> => {
    loading.value = true;
    error.value = null;

    try {
      const newArtifact: Artifact = {
        ...data,
        id: Date.now().toString(),
        likes: 0
      };

      artifacts.value.push(newArtifact);
      return newArtifact;
    } catch (err) {
      error.value = '创建文物失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateArtifact = async (artifactId: string, data: Artifact): Promise<Artifact> => {
    loading.value = true;
    error.value = null;

    try {
      const index = artifacts.value.findIndex((item) => item.id === artifactId);
      if (index === -1) {
        throw new Error('文物不存在');
      }
      artifacts.value[index] = { ...data, id: artifactId };
      return artifacts.value[index];
    } catch (err) {
      error.value = '更新文物失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteArtifact = async (artifactId: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const index = artifacts.value.findIndex((item) => item.id === artifactId);
      if (index === -1) {
        throw new Error('文物不存在');
      }

      artifacts.value.splice(index, 1);
    } catch (err) {
      error.value = '删除文物失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getArtifactById = (id: string): Artifact | undefined => {
    return artifacts.value.find((item) => item.id === id);
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    artifacts,
    loading,
    error,
    totalItems,
    // 方法
    fetchArtifacts,
    createArtifact,
    updateArtifact,
    deleteArtifact,
    getArtifactById,
    clearError,
    initializeData
  };
});
