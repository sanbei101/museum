<template>
  <!-- 主内容区 -->
  <n-layout>
    <n-layout-header
      bordered
      style="height: 64px; padding: 0 24px; display: flex; align-items: center">
      <n-space align="center" justify="space-between" style="width: 100%">
        <h2 style="margin: 0">展览管理系统</h2>
        <n-space>
          <n-button @click="showAddModal = true" type="primary">
            <template #icon>
              <n-icon><Plus /></n-icon>
            </template>
            添加展览
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
            placeholder="搜索展览名称..."
            style="width: 300px"
            clearable>
            <template #prefix>
              <n-icon><Search /></n-icon>
            </template>
          </n-input>
          <n-select
            v-model:value="statusFilter"
            placeholder="选择状态"
            style="width: 150px"
            clearable
            :options="statusOptions" />
          <n-select
            v-model:value="locationFilter"
            placeholder="选择场地"
            style="width: 150px"
            clearable
            :options="locationOptions" />
        </n-space>
      </n-card>

      <!-- 展览数据表格 -->
      <n-card>
        <n-data-table
          :columns="columns"
          :data="filteredExhibitions"
          :loading="loading"
          :pagination="pagination"
          :remote="true"
          striped
          :max-height="600" />
      </n-card>
    </n-layout-content>
  </n-layout>

  <!-- 添加/编辑展览模态框 -->
  <n-modal v-model:show="showAddModal" preset="dialog" :title="isEditing ? '编辑展览' : '添加展览'">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="left"
      label-width="80px">
      <n-form-item label="名称" path="name">
        <n-input v-model:value="formData.name" placeholder="请输入展览名称" />
      </n-form-item>
      <n-form-item label="描述" path="description">
        <n-input
          v-model:value="formData.description"
          type="textarea"
          placeholder="请输入展览描述"
          :rows="3" />
      </n-form-item>
      <n-form-item label="开始日期" path="startDate">
        <n-date-picker
          v-model:value="startDateValue"
          type="date"
          placeholder="请选择开始日期"
          style="width: 100%" />
      </n-form-item>
      <n-form-item label="结束日期" path="endDate">
        <n-date-picker
          v-model:value="endDateValue"
          type="date"
          placeholder="请选择结束日期"
          style="width: 100%" />
      </n-form-item>
      <n-form-item label="展览场地" path="location">
        <n-select
          v-model:value="formData.location"
          placeholder="请选择展览场地"
          :options="locationOptions" />
      </n-form-item>
      <n-form-item label="图片URL" path="image">
        <n-input v-model:value="formData.image" placeholder="请输入图片URL" />
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

  <!-- 文物管理模态框 -->
  <n-modal
    v-model:show="showArtifactModal"
    preset="dialog"
    title="管理展览文物"
    style="width: 800px">
    <div style="height: 500px">
      <n-space vertical>
        <n-card title="已选择的文物" size="small">
          <n-space v-if="selectedExhibition?.artifactIds.length" wrap>
            <n-tag
              v-for="artifactId in selectedExhibition.artifactIds"
              :key="artifactId"
              closable
              @close="removeArtifactFromExhibition(artifactId)">
              {{ getArtifactName(artifactId) }}
            </n-tag>
          </n-space>
          <n-empty v-else description="暂无文物" size="small" />
        </n-card>

        <n-card title="可选择的文物" size="small">
          <n-space style="margin-bottom: 16px">
            <n-input
              v-model:value="artifactSearchQuery"
              placeholder="搜索文物..."
              style="width: 200px"
              clearable>
              <template #prefix>
                <n-icon><Search /></n-icon>
              </template>
            </n-input>
          </n-space>

          <div style="max-height: 250px; overflow-y: auto">
            <n-space vertical size="small">
              <div
                v-for="artifact in filteredAvailableArtifacts"
                :key="artifact.id"
                style="
                  display: flex;
                  align-items: center;
                  padding: 8px;
                  border: 1px solid #e0e0e0;
                  border-radius: 4px;
                ">
                <n-image
                  :src="artifact.image"
                  width="40"
                  height="40"
                  object-fit="cover"
                  style="border-radius: 4px; margin-right: 12px" />
                <div style="flex: 1">
                  <div style="font-weight: 500">{{ artifact.name }}</div>
                  <div style="font-size: 12px; color: #666">
                    {{ artifact.era }} · {{ artifact.category }}
                  </div>
                </div>
                <n-button
                  size="small"
                  type="primary"
                  ghost
                  @click="addArtifactToExhibition(artifact.id)"
                  :disabled="selectedExhibition?.artifactIds.includes(artifact.id)">
                  {{ selectedExhibition?.artifactIds.includes(artifact.id) ? '已添加' : '添加' }}
                </n-button>
              </div>
            </n-space>
          </div>
        </n-card>
      </n-space>
    </div>
    <template #action>
      <n-button @click="showArtifactModal = false">关闭</n-button>
    </template>
  </n-modal>

  <!-- 删除确认模态框 -->
  <n-modal v-model:show="showDeleteModal" preset="dialog" title="确认删除">
    <p>确定要删除展览 "{{ deleteTarget?.name }}" 吗？此操作不可恢复。</p>
    <template #action>
      <n-space>
        <n-button @click="showDeleteModal = false">取消</n-button>
        <n-button type="error" @click="handleConfirmDelete" :loading="deleting">删除</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h, watch } from 'vue';
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
  NDatePicker,
  NEmpty,
  useMessage,
  useDialog,
  type PaginationProps
} from 'naive-ui';
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-vue-next';
import { useExhibitionStore } from '@/store/exhibition';
import { useArtifactStore } from '@/store/artifact';
import type { Exhibition } from '@/api/type';

// 消息和对话框
const message = useMessage();
const dialog = useDialog();

// Store
const exhibitionStore = useExhibitionStore();
const artifactStore = useArtifactStore();

// 数据状态
const exhibitions = ref<Exhibition[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref<string | null>(null);
const locationFilter = ref<string | null>(null);

// 表单状态
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const showArtifactModal = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const formRef = ref<FormInst | null>(null);
const deleteTarget = ref<Exhibition | null>(null);
const selectedExhibition = ref<Exhibition | null>(null);

// 文物搜索
const artifactSearchQuery = ref('');

// 日期状态
const startDateValue = ref<number | null>(null);
const endDateValue = ref<number | null>(null);

// 表单数据
const formData = reactive<Partial<Exhibition>>({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  image: '',
  location: '',
  status: 'upcoming'
});

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入展览名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入展览描述', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  location: [{ required: true, message: '请选择展览场地', trigger: 'change' }],
  image: [{ required: true, message: '请输入图片URL', trigger: 'blur' }]
};

// 状态选项
const statusOptions: SelectOption[] = [
  { label: '即将开始', value: 'upcoming' },
  { label: '进行中', value: 'ongoing' },
  { label: '已结束', value: 'ended' }
];

// 场地选项
const locationOptions: SelectOption[] = [
  { label: '一号展厅', value: '一号展厅' },
  { label: '二号展厅', value: '二号展厅' },
  { label: '三号展厅', value: '三号展厅' },
  { label: '特别展厅', value: '特别展厅' },
  { label: '临时展厅', value: '临时展厅' }
];

// 监听日期变化
watch(startDateValue, (val) => {
  if (val) {
    formData.startDate = new Date(val).toISOString().split('T')[0];
  }
});

watch(endDateValue, (val) => {
  if (val) {
    formData.endDate = new Date(val).toISOString().split('T')[0];
  }
});

// 分页配置
const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    pagination.page = page;
    loadExhibitions();
  }
});

// 过滤后的展览数据
const filteredExhibitions = computed(() => {
  let result = exhibitions.value;

  // 名称搜索
  if (searchQuery.value) {
    result = result.filter((exhibition) =>
      exhibition.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // 状态筛选
  if (statusFilter.value) {
    result = result.filter((exhibition) => exhibition.status === statusFilter.value);
  }

  // 场地筛选
  if (locationFilter.value) {
    result = result.filter((exhibition) => exhibition.location === locationFilter.value);
  }

  return result;
});

// 可用文物列表（过滤已添加的）
const filteredAvailableArtifacts = computed(() => {
  // 初始化文物数据
  artifactStore.initializeData();

  let result = artifactStore.artifacts;

  // 搜索过滤
  if (artifactSearchQuery.value) {
    result = result.filter((artifact) =>
      artifact.name.toLowerCase().includes(artifactSearchQuery.value.toLowerCase())
    );
  }

  return result;
});

// 获取文物名称
const getArtifactName = (artifactId: string): string => {
  const artifact = artifactStore.artifacts.find((a) => a.id === artifactId);
  return artifact?.name || `文物${artifactId}`;
};

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'info';
    case 'ongoing':
      return 'success';
    case 'ended':
      return 'default';
    default:
      return 'default';
  }
};

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'upcoming':
      return '即将开始';
    case 'ongoing':
      return '进行中';
    case 'ended':
      return '已结束';
    default:
      return status;
  }
};

// 表格列配置
const columns: DataTableColumns<Exhibition> = [
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
    width: 150
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(
        NTag,
        { type: getStatusType(row.status), size: 'small' },
        { default: () => getStatusText(row.status) }
      );
    }
  },
  {
    title: '场地',
    key: 'location',
    width: 100,
    render(row) {
      return h(NTag, { type: 'warning', size: 'small' }, { default: () => row.location });
    }
  },
  {
    title: '展期',
    key: 'date',
    width: 180,
    render(row) {
      return `${row.startDate} 至 ${row.endDate}`;
    }
  },
  {
    title: '文物数量',
    key: 'artifactCount',
    width: 100,
    render(row) {
      return `${row.artifactIds.length} 件`;
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
    width: 200,
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
                type: 'warning',
                ghost: true,
                onClick: () => handleManageArtifacts(row)
              },
              {
                default: () => '文物',
                icon: () => h(NIcon, null, { default: () => h(Users) })
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

// 查看展览
const handleView = (exhibition: Exhibition) => {
  const artifactList = exhibition.artifactIds.map((id) => getArtifactName(id)).join('、');

  dialog.info({
    title: `展览详情 - ${exhibition.name}`,
    content: () =>
      h('div', [
        h('p', `状态: ${getStatusText(exhibition.status)}`),
        h('p', `场地: ${exhibition.location}`),
        h('p', `展期: ${exhibition.startDate} 至 ${exhibition.endDate}`),
        h('p', `点赞数: ${exhibition.likes}`),
        h('p', `文物数量: ${exhibition.artifactIds.length} 件`),
        h('p', `展品: ${artifactList || '暂无'}`),
        h('p', `描述: ${exhibition.description}`),
        h(NImage, {
          width: 200,
          src: exhibition.image,
          fallbackSrc: '/placeholder-exhibition.jpg'
        })
      ]),
    positiveText: '关闭'
  });
};

// 管理文物
const handleManageArtifacts = (exhibition: Exhibition) => {
  selectedExhibition.value = exhibition;
  artifactSearchQuery.value = '';
  showArtifactModal.value = true;
};

// 添加文物到展览
const addArtifactToExhibition = async (artifactId: string) => {
  if (!selectedExhibition.value) return;

  try {
    await exhibitionStore.addArtifactToExhibition(selectedExhibition.value.id, artifactId);
    message.success('文物添加成功');
    // 更新本地数据
    const exhibition = exhibitions.value.find((e) => e.id === selectedExhibition.value!.id);
    if (exhibition && !exhibition.artifactIds.includes(artifactId)) {
      exhibition.artifactIds.push(artifactId);
    }
    if (selectedExhibition.value && !selectedExhibition.value.artifactIds.includes(artifactId)) {
      selectedExhibition.value.artifactIds.push(artifactId);
    }
  } catch (error) {
    message.error('添加文物失败');
    console.error('Add artifact error:', error);
  }
};

// 从展览中移除文物
const removeArtifactFromExhibition = async (artifactId: string) => {
  if (!selectedExhibition.value) return;

  try {
    await exhibitionStore.removeArtifactFromExhibition(selectedExhibition.value.id, artifactId);
    message.success('文物移除成功');
    // 更新本地数据
    const exhibition = exhibitions.value.find((e) => e.id === selectedExhibition.value!.id);
    if (exhibition) {
      const index = exhibition.artifactIds.indexOf(artifactId);
      if (index > -1) {
        exhibition.artifactIds.splice(index, 1);
      }
    }
    if (selectedExhibition.value) {
      const index = selectedExhibition.value.artifactIds.indexOf(artifactId);
      if (index > -1) {
        selectedExhibition.value.artifactIds.splice(index, 1);
      }
    }
  } catch (error) {
    message.error('移除文物失败');
    console.error('Remove artifact error:', error);
  }
};

// 编辑展览
const handleEdit = (exhibition: Exhibition) => {
  isEditing.value = true;
  Object.assign(formData, exhibition);
  startDateValue.value = new Date(exhibition.startDate).getTime();
  endDateValue.value = new Date(exhibition.endDate).getTime();
  showAddModal.value = true;
};

// 删除展览
const handleDelete = (exhibition: Exhibition) => {
  deleteTarget.value = exhibition;
  showDeleteModal.value = true;
};

// 确认删除
const handleConfirmDelete = async () => {
  if (!deleteTarget.value) return;

  deleting.value = true;
  try {
    await exhibitionStore.deleteExhibition(deleteTarget.value.id);
    message.success('展览删除成功');
    showDeleteModal.value = false;
    await loadExhibitions();
  } catch (error) {
    message.error('删除失败，请重试');
    console.error('Delete exhibition error:', error);
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

    // 计算状态
    const now = new Date();
    const startDate = new Date(formData.startDate!);
    const endDate = new Date(formData.endDate!);

    let status: 'upcoming' | 'ongoing' | 'ended';
    if (startDate > now) {
      status = 'upcoming';
    } else if (endDate < now) {
      status = 'ended';
    } else {
      status = 'ongoing';
    }

    const submitData = {
      ...formData,
      status,
      artifactIds: formData.artifactIds || []
    } as Exhibition;

    if (isEditing.value) {
      await exhibitionStore.updateExhibition(formData.id!, submitData);
      message.success('展览更新成功');
    } else {
      await exhibitionStore.createExhibition(submitData);
      message.success('展览添加成功');
    }

    showAddModal.value = false;
    resetForm();
    await loadExhibitions();
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
    description: '',
    startDate: '',
    endDate: '',
    image: '',
    location: '',
    status: 'upcoming',
    artifactIds: []
  });
  startDateValue.value = null;
  endDateValue.value = null;
  isEditing.value = false;
  formRef.value?.restoreValidation();
};

// 加载展览数据
const loadExhibitions = async () => {
  loading.value = true;
  try {
    const response = await exhibitionStore.fetchExhibitions(pagination.page!, pagination.pageSize!);
    exhibitions.value = response.items;
    pagination.page = response.page;
    pagination.itemCount = response.totalItems;
    pagination.pageSize = response.perPage;
  } catch (error) {
    message.error('加载展览数据失败');
    console.error('Load exhibitions error:', error);
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  // 初始化数据
  exhibitionStore.initializeData();
  artifactStore.initializeData();
  loadExhibitions();
});
</script>
