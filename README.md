# 🎬 每一帧都是我们一起呼吸过的时光

互动式电影回忆网站，记录和伴侣一起看过的每一部电影和剧。

## 🚀 使用方式

直接用浏览器打开 `index.html` 即可。

## 🎵 音频设置

将以下音频文件放入 `audio/` 文件夹：

### 必需（背景音乐）
- `audio/bloody-mary-girl.mp3` — She Her Her Hers 的 Bloody Mary Girl

### 可选（各电影主题曲）
- `audio/mystery-of-love.mp3` — Sufjan Stevens (Call Me by Your Name)
- `audio/suzume-theme.mp3` — 铃芽之旅主题曲
- `audio/hanamizuki-theme.mp3` — 花束般的恋爱主题曲
- `audio/the-handmaiden-theme.mp3` — 小姐主题曲
- `audio/chainsaw-man-theme.mp3` — 电锯人主题曲
- `audio/zootopia-theme.mp3` — 疯狂动物城主题曲
- `audio/blue-warmest-theme.mp3` — 阿黛尔的生活主题曲

> 没有音频文件也不影响网站浏览，只是没有音乐。

## 🖼️ 海报图片设置

要添加电影海报图片，在 `index.html` 中找到对应电影的 `.movie-bg`，修改为：

```css
background-image: url('posters/chainsaw-man.jpg');
background-size: cover;
background-position: center;
```

建议在 `our-films/` 下创建 `posters/` 文件夹存放海报图片。

## ✨ 功能特点

- 开场动画：16部电影海报飞入组成标题
- 滚动浏览：逐页展示每部电影和评语
- 自动音乐切换：滚动到不同电影自动切换主题曲
- 每部电影独特配色和排版
- 响应式设计，支持手机和电脑

## 🛠️ 自定义

所有电影的评语、顺序、配色都可以在 `index.html` 中自由修改。
