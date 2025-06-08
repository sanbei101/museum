<template>
  <Header></Header>
  <div class="container">
    <n-space vertical size="large" :style="{ padding: '20px' }">
      <n-card title="博物馆参观指南" hoverable>
        <template #header-extra>
          <n-icon :component="Info" size="20" />
        </template>

        <n-card title="开放时间" size="small" hoverable>
          <template #header-extra>
            <n-icon :component="Clock" size="18" />
          </template>
          <n-descriptions label-placement="top" bordered :column="1">
            <n-descriptions-item label="周二至周日">
              <n-text>上午 9:00 - 下午 5:00 (最后入场时间 下午 4:30)</n-text>
              <n-tag type="success" size="small" :style="{ marginLeft: '8px' }">开放中</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="周一">
              <n-text>闭馆（法定节假日除外）</n-text>
              <n-tag type="error" size="small" :style="{ marginLeft: '8px' }">闭馆</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="特殊通知">
              <n-text>具体开放时间可能因特殊活动或节假日调整，请关注官网公告。</n-text>
            </n-descriptions-item>
          </n-descriptions>
        </n-card>

        <n-card title="门票信息" size="small" hoverable :style="{ marginTop: '20px' }">
          <template #header-extra>
            <n-icon :component="Ticket" size="18" />
          </template>
          <n-descriptions label-placement="top" bordered :column="2">
            <n-descriptions-item label="成人票">
              <n-text strong>20¥ / 人</n-text>
            </n-descriptions-item>
            <n-descriptions-item label="学生票">
              <n-text strong>10¥ / 人(需持有效学生证)</n-text>
            </n-descriptions-item>
            <n-descriptions-item label="优惠政策">
              <n-text>
                <n-ul>
                  <n-li>60岁以上老人、残疾人凭有效证件免费</n-li>
                  <n-li>1.2米以下儿童免费 (需成人陪同)</n-li>
                </n-ul>
              </n-text>
            </n-descriptions-item>
            <n-descriptions-item label="购票方式">
              <n-space>
                <n-button type="primary" ghost>
                  <template #icon>
                    <n-icon :component="TicketCheck" />
                  </template>
                  在线预约
                </n-button>
                <n-button type="default" secondary>
                  <template #icon>
                    <n-icon :component="Building" />
                  </template>
                  现场购票
                </n-button>
              </n-space>
            </n-descriptions-item>
          </n-descriptions>
        </n-card>

        <n-card title="地址与交通" size="small" hoverable :style="{ marginTop: '20px' }">
          <template #header-extra>
            <n-icon :component="MapPin" size="18" />
          </template>
          <n-grid :cols="4" :x-gap="12">
            <n-gi :span="1">
              <n-space vertical>
                <n-text strong>地址:</n-text>
                <n-text> 北京市海淀区清华东路17号中国农业大学东校区博物馆 </n-text>
                <n-button text type="primary">
                  <template #icon>
                    <n-icon :component="Map" />
                  </template>
                  查看地图
                </n-button>
              </n-space>
            </n-gi>
            <n-gi :span="3">
              <n-text strong>交通方式:</n-text>
              <n-list>
                <n-list-item>
                  <template #prefix>
                    <n-icon :component="Bus" color="#18a058" />
                  </template>
                  <n-text> 乘坐公交 1路, 15路, 28路 至 "中国农业大学站" 下车。</n-text>
                </n-list-item>
                <n-list-item>
                  <template #prefix>
                    <n-icon :component="TrainFront" color="#2080f0" />
                  </template>
                  <n-text>乘坐地铁 2号线 至 "文化广场站" 下车，步行约 10 分钟。</n-text>
                </n-list-item>
                <n-list-item>
                  <template #prefix>
                    <n-icon :component="Car" color="#f0a020" />
                  </template>
                  <n-text>自驾:导航至 "某某博物馆停车场"，车位有限。</n-text>
                </n-list-item>
              </n-list>
            </n-gi>
          </n-grid>
        </n-card>

        <n-card title="参观须知" size="small" hoverable :style="{ marginTop: '20px' }">
          <template #header-extra>
            <n-icon :component="AlertTriangle" size="18" color="#f0a020" />
          </template>
          <n-ul>
            <n-li>请自觉维护馆内秩序，保持安静。</n-li>
            <n-li>严禁携带易燃易爆、管制器具等危险品入馆。</n-li>
            <n-li>馆内禁止吸烟、饮食。</n-li>
            <n-li>请爱护展品及公共设施，禁止触摸展品。</n-li>
            <n-li>部分展厅允许拍照，但请勿使用闪光灯和三脚架。</n-li>
            <n-li>如遇紧急情况，请听从工作人员指挥。</n-li>
          </n-ul>
        </n-card>

        <n-card title="联系我们" size="small" hoverable :style="{ marginTop: '20px' }">
          <template #header-extra>
            <n-icon :component="Phone" size="18" />
          </template>
          <n-space vertical>
            <n-text>
              <n-icon
                :component="PhoneCall"
                :style="{ marginRight: '5px', verticalAlign: 'middle' }" />
              咨询电话:010-12345678
            </n-text>
            <n-text>
              <n-icon :component="Mail" :style="{ marginRight: '5px', verticalAlign: 'middle' }" />
              电子邮箱:info@museum.example.com
            </n-text>
            <n-text>
              <n-icon :component="Globe" :style="{ marginRight: '5px', verticalAlign: 'middle' }" />
              官方网站:
              <n-button text tag="a" href="YOUR_WEBSITE_LINK_HERE" target="_blank" type="primary">
                museum.example.com
              </n-button>
            </n-text>
          </n-space>
        </n-card>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NSpace,
  NDescriptions,
  NDescriptionsItem,
  NText,
  NTag,
  NIcon,
  NButton,
  NList,
  NListItem,
  NUl,
  NLi,
  NGrid,
  NGi
} from 'naive-ui';
import {
  Clock,
  Ticket,
  MapPin,
  Info,
  Bus,
  TrainFront,
  Car,
  Map,
  AlertTriangle,
  Phone,
  PhoneCall,
  Mail,
  Globe,
  TicketCheck,
  Building
} from 'lucide-vue-next';
import Header from '@/views/index/components/Header.vue';
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
