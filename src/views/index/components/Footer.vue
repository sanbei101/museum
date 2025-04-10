<template>
  <!-- 页脚区域 -->
  <n-layout-footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <div class="footer-logo">
          <h2>博物馆藏品管理</h2>
        </div>
        <p>探索历史，保护文化，传承文明</p>
      </div>
      <div class="footer-section">
        <h3>快速链接</h3>
        <ul>
          <li><n-button text color="white">首页</n-button></li>
          <li><n-button text color="white">藏品展示</n-button></li>
          <li><n-button text color="white">参观指南</n-button></li>
          <li><n-button text color="white">关于我们</n-button></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>联系我们</h3>
        <ul>
          <li><Mail /> sanbei101@outlook.com</li>
          <li><Phone /> +86 13672246940</li>
          <li><MapPin />中国农业大学计算机231数据库作业小组</li>
        </ul>
      </div>
    </div>
    <div class="copyright">
      <p>© 2025 博物馆藏品管理系统. 保留所有权利.</p>
    </div>
  </n-layout-footer>
</template>

<script setup lang="ts">
import { NLayoutFooter, NButton } from "naive-ui";
import { Mail, Phone, MapPin } from "lucide-vue-next";
</script>

<style scoped>
/* 页脚区域 */
.footer {
  background-color: #333;
  color: #fff;
  padding: 40px 16px 16px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.footer-section h2,
.footer-section h3 {
  color: #fff;
  margin-top: 0;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.social-links {
  display: flex;
  gap: 8px;
}

.copyright {
  max-width: 1200px;
  margin: 40px auto 0;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 14px;
  color: #aaa;
}
</style>
