import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import config from '@/views/my-config/my-config.vue'
import upload from '@/views/upload-image/upload-image.vue'
import management from '@/views/imgs-management/imgs-management.vue'
import settings from '@/views/my-settings/my-settings.vue'
import toolbox from '@/views/picx-toolbox/picx-toolbox.vue'
import feedback from '@/views/feedback-info/feedback-info.vue'
import compressTool from '@/components/tools/compress-tool/compress-tool.vue'
import base64Tool from '@/components/tools/base64-tool/base64-tool.vue'
import watermarkTool from '@/components/tools/watermark-tool/watermark-tool.vue'

const titleSuffix = ` | PicX 图床`

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    redirect: {
      name: 'upload'
    }
  },
  {
    path: '/config',
    name: 'config',
    component: config,
    meta: {
      title: `图床配置${titleSuffix}`
    }
  },
  {
    path: '/upload',
    name: 'upload',
    component: upload,
    meta: {
      title: `图片上传${titleSuffix}`
    }
  },
  {
    path: '/management',
    name: 'Management',
    component: management,
    meta: {
      title: `图床管理${titleSuffix}`
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: settings,
    meta: {
      title: `我的设置${titleSuffix}`
    }
  },
  {
    path: '/toolbox',
    name: 'Toolbox',
    component: toolbox,
    meta: {
      title: `工具箱${titleSuffix}`
    },
    children: [
      {
        path: '/toolbox/compress',
        name: 'Compress',
        component: compressTool
      },
      {
        path: '/toolbox/base64',
        name: 'Base64',
        component: base64Tool
      },
      {
        path: '/toolbox/watermark',
        name: 'Watermark',
        component: watermarkTool
      }
    ]
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: feedback,
    meta: {
      title: `帮助反馈${titleSuffix}`
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) (<any>window).document.title = to.meta.title
  next()
})

export default router
