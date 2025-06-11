<template>
  <!-- 主内容区 -->
  <n-layout>
    <n-layout-header
      bordered
      style="height: 64px; padding: 0 24px; display: flex; align-items: center">
      <n-space align="center" justify="space-between" style="width: 100%">
        <h2 style="margin: 0">文物管理系统</h2>
        <n-space>
          <n-button @click="showAddModal = true" type="primary">
            <template #icon>
              <n-icon><Plus /></n-icon>
            </template>
            添加文物
          </n-button>
        </n-space>
      </n-space>
    </n-layout-header>

    <n-layout-content content-style="padding: 24px">
      <!-- 搜索和筛选 -->
      <n-card style="margin-bottom: 16px">
        <n-space>
          <n-input
            v-model:value="searchQuery"
            placeholder="搜索文物名称..."
            style="width: 300px"
            clearable>
            <template #prefix>
              <n-icon><Search /></n-icon>
            </template>
          </n-input>
          <n-select
            v-model:value="categoryFilter"
            placeholder="选择分类"
            style="width: 150px"
            clearable
            :options="categoryOptions" />
          <n-select
            v-model:value="eraFilter"
            placeholder="选择年代"
            style="width: 150px"
            clearable
            :options="eraOptions" />
        </n-space>
      </n-card>

      <!-- 文物数据表格 -->
      <n-card>
        <n-data-table
          :columns="columns"
          :data="filteredArtifacts"
          :loading="loading"
          :pagination="pagination"
          :remote="true"
          striped
          :max-height="600" />
      </n-card>
    </n-layout-content>
  </n-layout>

  <!-- 添加/编辑文物模态框 -->
  <n-modal v-model:show="showAddModal" preset="dialog" :title="isEditing ? '编辑文物' : '添加文物'">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="left"
      label-width="80px">
      <n-form-item label="名称" path="name">
        <n-input v-model:value="formData.name" placeholder="请输入文物名称" />
      </n-form-item>
      <n-form-item label="年代" path="era">
        <n-input v-model:value="formData.era" placeholder="请输入年代" />
      </n-form-item>
      <n-form-item label="分类" path="category">
        <n-select
          v-model:value="formData.category"
          placeholder="请选择分类"
          :options="categoryOptions" />
      </n-form-item>
      <n-form-item label="图片URL" path="image">
        <n-input v-model:value="formData.image" placeholder="请输入图片URL" />
      </n-form-item>
      <n-form-item label="描述" path="description">
        <n-input
          v-model:value="formData.description"
          type="textarea"
          placeholder="请输入文物描述"
          :rows="3" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="showAddModal = false">取消</n-button>
        <n-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEditing ? '更新' : '添加' }}
        </n-button>
      </n-space>
    </template>
  </n-modal>

  <!-- 删除确认模态框 -->
  <n-modal v-model:show="showDeleteModal" preset="dialog" title="确认删除">
    <p>确定要删除文物 "{{ deleteTarget?.name }}" 吗？此操作不可恢复。</p>
    <template #action>
      <n-space>
        <n-button @click="showDeleteModal = false">取消</n-button>
        <n-button type="error" @click="handleConfirmDelete" :loading="deleting">删除</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h } from 'vue';
import type { DataTableColumns, FormInst, FormRules, SelectOption } from 'naive-ui';
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NCard,
  NSpace,
  NButton,
  NIcon,
  NInput,
  NSelect,
  NDataTable,
  NModal,
  NForm,
  NFormItem,
  NImage,
  NTag,
  useMessage,
  useDialog,
  type PaginationProps
} from 'naive-ui';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-vue-next';
import { FetchArtifact, CreateArtifact, UpdateArtifact, DeleteArtifact } from '@/api/artifact';
import type { Artifact } from '@/api/type';

// 消息和对话框
const message = useMessage();
const dialog = useDialog();

// 菜单配置

// 数据状态
const artifacts = ref<Artifact[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const categoryFilter = ref<string | null>(null);
const eraFilter = ref<string | null>(null);

// 表单状态
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const formRef = ref<FormInst | null>(null);
const deleteTarget = ref<Artifact | null>(null);

// 表单数据
const formData = reactive<Partial<Artifact>>({
  name: '',
  era: '',
  category: '',
  image: '',
  description: '',
  likes: 0
});

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入文物名称', trigger: 'blur' }],
  era: [{ required: true, message: '请输入年代', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  image: [{ required: true, message: '请输入图片URL', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
};

// 分类选项
const categoryOptions: SelectOption[] = [
  { label: '青铜器', value: '青铜器' },
  { label: '陶瓷', value: '陶瓷' },
  { label: '玉器', value: '玉器' },
  { label: '书画', value: '书画' },
  { label: '金银器', value: '金银器' },
  { label: '织物', value: '织物' },
  { label: '石器', value: '石器' },
  { label: '其他', value: '其他' }
];

// 年代选项
const eraOptions: SelectOption[] = [
  { label: '商朝', value: '商朝' },
  { label: '周朝', value: '周朝' },
  { label: '秦朝', value: '秦朝' },
  { label: '汉朝', value: '汉朝' },
  { label: '三国', value: '三国' },
  { label: '晋朝', value: '晋朝' },
  { label: '南北朝', value: '南北朝' },
  { label: '隋朝', value: '隋朝' },
  { label: '唐朝', value: '唐朝' },
  { label: '宋朝', value: '宋朝' },
  { label: '元朝', value: '元朝' },
  { label: '明朝', value: '明朝' },
  { label: '清朝', value: '清朝' },
  { label: '现代', value: '现代' }
];

// 分页配置
const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    pagination.page = page;
    loadArtifacts();
  }
});

// 过滤后的文物数据
const filteredArtifacts = computed(() => {
  let result = artifacts.value;

  // 名称搜索
  if (searchQuery.value) {
    result = result.filter((artifact) =>
      artifact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // 分类筛选
  if (categoryFilter.value) {
    result = result.filter((artifact) => artifact.category === categoryFilter.value);
  }

  // 年代筛选
  if (eraFilter.value) {
    result = result.filter((artifact) => artifact.era === eraFilter.value);
  }

  return result;
});

// 表格列配置
const columns: DataTableColumns<Artifact> = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
    ellipsis: true
  },
  {
    title: '图片',
    key: 'image',
    width: 80,
    render(row) {
      return h(NImage, {
        width: 50,
        height: 50,
        src: row.image,
        objectFit: 'cover',
        style: 'border-radius: 4px'
      });
    }
  },
  {
    title: '名称',
    key: 'name',
    width: 80
  },
  {
    title: '年代',
    key: 'era',
    width: 100,
    render(row) {
      return h(NTag, { type: 'info', size: 'small' }, { default: () => row.era });
    }
  },
  {
    title: '分类',
    key: 'category',
    width: 100,
    render(row) {
      return h(NTag, { type: 'success', size: 'small' }, { default: () => row.category });
    }
  },
  {
    title: '描述',
    key: 'description',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '点赞数',
    key: 'likes',
    width: 80,
    sorter: (a, b) => a.likes - b.likes
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row) {
      return h(
        NSpace,
        { size: 'small' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'info',
                ghost: true,
                onClick: () => handleView(row)
              },
              {
                default: () => '查看',
                icon: () => h(NIcon, null, { default: () => h(Eye) })
              }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                ghost: true,
                onClick: () => handleEdit(row)
              },
              {
                default: () => '编辑',
                icon: () => h(NIcon, null, { default: () => h(Edit) })
              }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                ghost: true,
                onClick: () => handleDelete(row)
              },
              {
                default: () => '删除',
                icon: () => h(NIcon, null, { default: () => h(Trash2) })
              }
            )
          ]
        }
      );
    }
  }
];

// 查看文物
const handleView = (artifact: Artifact) => {
  dialog.info({
    title: `文物详情 - ${artifact.name}`,
    content: () =>
      h('div', [
        h('p', `年代: ${artifact.era}`),
        h('p', `分类: ${artifact.category}`),
        h('p', `点赞数: ${artifact.likes}`),
        h('p', `描述: ${artifact.description}`),
        h(NImage, {
          width: 200,
          src: artifact.image,
          fallbackSrc: '/placeholder-artifact.jpg'
        })
      ]),
    positiveText: '关闭'
  });
};

// 编辑文物
const handleEdit = (artifact: Artifact) => {
  isEditing.value = true;
  Object.assign(formData, artifact);
  showAddModal.value = true;
};

// 删除文物
const handleDelete = (artifact: Artifact) => {
  deleteTarget.value = artifact;
  showDeleteModal.value = true;
};

// 确认删除
const handleConfirmDelete = async () => {
  if (!deleteTarget.value) return;

  deleting.value = true;
  try {
    await DeleteArtifact(deleteTarget.value.id);
    message.success('文物删除成功');
    showDeleteModal.value = false;
    await loadArtifacts();
  } catch (error) {
    message.error('删除失败，请重试');
    console.error('Delete artifact error:', error);
  } finally {
    deleting.value = false;
    deleteTarget.value = null;
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitting.value = true;

    if (isEditing.value) {
      await UpdateArtifact(formData.id!, formData as Artifact);
      message.success('文物更新成功');
    } else {
      await CreateArtifact(formData as Artifact);
      message.success('文物添加成功');
    }

    showAddModal.value = false;
    resetForm();
    await loadArtifacts();
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      message.error(`操作失败: ${error.message}`);
    } else {
      message.error('操作失败，请检查输入信息');
    }
    console.error('Submit error:', error);
  } finally {
    submitting.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    era: '',
    category: '',
    image: '',
    description: '',
    likes: 0
  });
  isEditing.value = false;
  formRef.value?.restoreValidation();
};

// 加载文物数据
const loadArtifacts = async () => {
  loading.value = true;
  try {
    const response = await FetchArtifact(pagination.page!, pagination.pageSize!);
    artifacts.value = response.items;
    pagination.page = response.page;
    pagination.itemCount = response.totalItems;
    pagination.pageSize = response.perPage;
  } catch (error) {
    message.error('加载文物数据失败');
    console.error('Load artifacts error:', error);
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadArtifacts();
});
</script>
