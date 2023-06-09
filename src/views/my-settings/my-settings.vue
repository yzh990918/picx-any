<template>
  <div class="page-container settings-page-container">
    <el-collapse>
      <el-collapse-item title="图片名称设置" name="1">
        <ul class="setting-list" style="margin-top: 10rem">
          <li class="setting-item has-desc">
            <el-switch
              v-model="userSettings.defaultHash"
              @change="persistUserSettings"
              active-text="自动哈希化"
            ></el-switch>
            <span class="desc">上传前自动给图片名增加哈希码，确保图片名唯一，强烈建议开启</span>
          </li>
          <li class="setting-item has-desc">
            <el-switch
              v-model="userSettings.prefixNaming.enable"
              @change="persistUserSettings"
              active-text="添加前缀命名"
            ></el-switch>
            <span class="desc">上传前自动给图片名增加前缀，例如：abc-image.jpg，abc- 为前缀</span>
          </li>
          <li class="setting-item has-desc" v-if="userSettings.prefixNaming.enable">
            <el-input
              class="prefix-input"
              v-model="userSettings.prefixNaming.prefix"
              placeholder="请输入命名前缀"
              @input="persistUserSettings"
              clearable
              autofocus
            ></el-input>
          </li>
        </ul>
      </el-collapse-item>

      <el-collapse-item title="图片水印设置" name="2">
        <ul class="setting-list">
          <li class="setting-item has-desc">
            <el-switch
              v-model="userSettings.watermark.enable"
              @change="persistUserSettings"
              active-text="是否添加水印"
            ></el-switch>
            <span class="desc">开启后可以自定义水印文字、字体大小、位置、颜色和透明度</span>
          </li>
          <li class="setting-item">
            <el-card class="settings-item-card">
              <watermark-config-box
                :disabled="!userSettings.watermark.enable"
                @watermarkConfig="setWatermarkConfig"
              />
            </el-card>
          </li>
        </ul>
      </el-collapse-item>

      <el-collapse-item title="图片压缩设置" name="3">
        <ul class="setting-list">
          <li class="setting-item has-desc">
            <el-switch
              v-model="userSettings.compress.enable"
              @change="persistUserSettings"
              active-text="是否压缩图片"
            ></el-switch>
            <span class="desc">开启后上传前会自动压缩图片，有效缩短图片加载时间，强烈建议开启</span>
          </li>
          <li class="setting-item">
            <el-card class="settings-item-card">
              <compress-config-box
                ref="compressConfigBoxRef"
                :disabled="!userSettings.compress.enable"
                @encoder=";(userSettings.compress.encoder = $event), persistUserSettings()"
              />
            </el-card>
          </li>
        </ul>
      </el-collapse-item>

      <el-collapse-item title="图片链接规则配置" name="4">
        <ul class="setting-list">
          <li class="setting-item cdn">
            选择图片链接规则：
            <el-select
              v-model="userSettings.imageLinkType.selected"
              placeholder="选择一个图片链接类型规则"
              @change="saveUserSettings"
            >
              <el-option
                v-for="item in userSettings.imageLinkType.presetList"
                :key="item.name + '-' + item.id"
                :label="item.name"
                :value="item.name"
                class="image-link-type-rule-option"
              >
                <span class="left">{{ item.name }}</span>
                <span class="right">{{ item.rule }}</span>
              </el-option>
            </el-select>
          </li>
          <li class="setting-item" style="margin-top: 20rem">
            <image-link-rule-config />
          </li>
        </ul>
      </el-collapse-item>

      <el-collapse-item title="图片链接格式设置" name="5">
        <ul class="setting-list">
          <li class="setting-item has-desc">
            <el-switch
              v-model="userSettings.imageLinkFormat.enable"
              @change="persistUserSettings"
              active-text="自动转换图片链接格式"
            ></el-switch>
            <span class="desc">
              上传成功后复制的图片链接时使用 {{ userSettings.imageLinkFormat.selected }} 格式
            </span>
          </li>
          <li class="setting-item">
            选择图片链接格式：
            <el-select
              v-model="userSettings.imageLinkFormat.selected"
              placeholder="选择一个图片链接格式"
              @change="saveUserSettings"
            >
              <el-option
                v-for="item in userSettings.imageLinkFormat.presetList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                class="image-link-type-rule-option"
              >
                <span class="left">{{ item.name }}</span>
                <span class="right">{{ item.format }}</span>
              </el-option>
            </el-select>
          </li>
        </ul>
      </el-collapse-item>

      <el-collapse-item title="主题设置" name="6">
        <ul class="setting-list">
          <li class="setting-item">
            选择主题模式：
            <el-select
              v-model="userSettings.theme.mode"
              placeholder="主题模式"
              @change="saveUserSettings"
            >
              <el-option label="跟随系统" :value="ThemeModeEnum.follow"></el-option>
              <el-option label="白昼主题" :value="ThemeModeEnum.light"></el-option>
              <el-option label="暗夜主题" :value="ThemeModeEnum.dark"></el-option>
            </el-select>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@/store'
import { ThemeModeEnum, UserSettingsModel } from '@/common/model'

const userSettings = computed(() => store.getters.getUserSettings).value

const persistUserSettings = () => {
  store.dispatch('USER_SETTINGS_PERSIST')
}

const saveUserSettings = () => {
  store.dispatch('SET_USER_SETTINGS', {
    ...userSettings
  })
  persistUserSettings()
}

const setWatermarkConfig = (config: UserSettingsModel['watermark']) => {
  userSettings.watermark.text = config.text
  userSettings.watermark.textColor = config.textColor
  userSettings.watermark.opacity = config.opacity
  userSettings.watermark.position = config.position
  userSettings.watermark.fontSize = config.fontSize
  persistUserSettings()
}
</script>

<style scoped lang="stylus">
@import "my-settings.styl"
</style>
