# 食味人间 · 中华美食志

一个纯静态的中式美食主题单页网站。零构建、零依赖，双击 `index.html` 即可打开。

## 文件清单

| 文件 | 说明 |
|---|---|
| `index.html` | **主版本**。单文件，含全部 HTML / CSS / JS / SVG 插画 |
| `index-before-3pane.html` | 2026-09-12 三屏改版前的旧版备份，回退用，可删 |
| `README.md` | 本文件 |

> 早期简洁模板版 `simple.html` 已于 2026-09-12 删除，不再保留。

## 页面结构（共 3 屏）

1. **第 1 屏 · 封面 Hero** — 「食味人间」竖排书法标题 + 朱砂印章 + 手绘汤面碗（面条、溏心蛋、青菜、筷子），蒸汽飘动动画，外圈缓慢旋转的环形文字；下方接跑马灯条（早茶 · 烧烤 · 涮锅 · 卤味……，悬停暂停）
2. **第 2 屏 · 每日一味**（`id="daily"`）— 居中画框，带中式回纹边框，按当天日期在 8 道菜中自动轮换，显示当天日期与期数
3. **第 3 屏 · 寻味栏目**（`id="columns"`）— 三档栏目用 tab 切换，同屏内切换、不再往下铺页面。顶部是一行**轻量子标题**「寻味栏目 · Columns」+ 三个下划线式 tab，**不用** `.sec-head` 大标题，避免抢主屏标题的层级：

   | 栏目 | 面板 id | 内容 |
   |---|---|---|
   | 八大菜系 | `p-cuisines` | 川粤鲁苏浙闽湘徽，每格书法字水印 + 专属 SVG 底纹 + **3 道代表菜（带手绘图标）** |
   | 街头巷尾 | `p-snacks` | 6 张小吃横滑卡，全部手绘矢量插画 |
   | 节气食单 | `p-seasonal` | 春夏秋冬，暗色面板 |

4. **页脚** — 「人间烟火气，最抚凡人心」

> 原来的 `#cuisines` / `#snacks` / `#seasonal` 三个独立版块已合并进第 3 屏，锚点改为 `#columns` + 面板 id。导航栏只剩「每日一味 / 寻味栏目」两项。

## 二次开发

### 改菜品（每日轮换的 8 道菜）
在 `index.html` 末尾 `<script>` 中编辑 `DISHES` 数组（约第 1190 行）：

```js
var DISHES=[
  {id:'f1',name:'红烧肉',en:'Braised Pork Belly',desc:'……',tags:['浓油赤酱','肥而不腻','慢工细活']},
  ...
];
```

- `id` 必须与该菜插图元素的 `id` 对应（形如 `f1`–`f8`，是八张 `.feat-dish` 插画），否则当日插图不会高亮
- 轮换规则：`第 N 天 = DISHES[当天是第几天 % DISHES.length]`，纯前端，无后端。增删菜品会自动改变轮换周期
- 想固定某道菜调试：临时把 `doy` 改成常量即可

### 改八大菜系底纹
8 套底纹是内联 SVG `<pattern>`，定义在 `<body>` 顶部的 SVG defs 中，id 形如 `pat-chuan` / `pat-yue` / `pat-lu` / `pat-su` / `pat-zhe` / `pat-min` / `pat-xiang` / `pat-hui`。卡片通过 CSS 变量引用。底纹用径向遮罩集中在卡片右下角以避开文字。

### 改八大菜系里的代表菜（带配图）

每个菜系卡片里的菜品是一组 `<ul class="cu-dishes">`，每项 = 图标 + 菜名：

```html
<li><svg class="ic" aria-hidden="true"><use href="#ic-tofu"/></svg>麻婆豆腐</li>
```

图标是一套内联 SVG `<symbol>` 图标库，定义在栏目 section 开头的 `<svg class="defs">` 里，现有 17 个：

`ic-fish` 鱼 · `ic-chicken` 鸡腿 · `ic-pork` 肉块 · `ic-shrimp` 虾 · `ic-crab` 蟹 · `ic-duck` 鸭 · `ic-tofu` 豆腐 · `ic-soup` 汤盅 · `ic-noodle` 面碗 · `ic-dumpling` 饺子 · `ic-bamboo` 笋 · `ic-greens` 青菜 · `ic-chili` 辣椒 · `ic-hotpot` 火锅 · `ic-rice` 米饭 · `ic-meatball` 丸子 · `ic-seacucumber` 海参

加新图标：在图标库的 `<defs>` 里加一个 `<symbol id="ic-xxx" viewBox="0 0 40 40">`，用 40×40 坐标画线即可，**不用写 stroke 颜色**——描边由 CSS `.cu-dishes .ic{stroke:currentColor;color:var(--red)}` 统一继承，hover 时会整体变色放大。

### 改栏目切换

tab 按钮带 `data-panel`，面板是同 id 的 `.col-panel`，切换逻辑在末尾脚本「寻味栏目：三档切换」里。面板默认 `display:none`，激活时加 `.on` 并给内部 `.rv` 补 `.on`（否则隐藏时滚动入场动画不会触发）。加第四档栏目时：复制一个 `.col-panel` + 一个 `data-panel` 匹配的 tab 即可，JS 不用改。

### 改配色
主色集中在 `:root` CSS 变量里（朱砂红、宣纸米、墨色等），改变量即可整体换肤。

## 依赖与离线

- **唯一外部依赖**：Google Fonts（思源宋体 Noto Serif SC + 马善政楷书 Ma Shan Zheng + Cormorant Garamond），在 `<head>` 第 9–11 行
- **断网时**：自动回落到系统楷体 / 宋体，版式不会散
- **要完全离线**：删除 `<head>` 里那 3 行 `<link>` 即可，页面功能不受任何影响

## 迁移

整个 `food-page/` 目录可直接复制到任何位置 / 任何机器，无需安装环境：

```
food-page/
├── index.html                ← 主版本
├── index-before-3pane.html   ← 旧版备份（可删）
└── README.md                 ← 本文件
```

也可以直接丢进任意静态托管（GitHub Pages / Nginx / 对象存储），把 `index.html` 作为入口即可。

## 注意事项

- 所有插画都是内联 SVG，不依赖任何图片文件，**不存在图片 404 风险**
- 不要引入外部图片链接或 CDN 资源，会破坏离线可用性
- 编辑 `index.html` 时注意保留 `<script>` 中的三个 IIFE（每日轮换、滚动入场 IntersectionObserver、栏目切换）
- **除了顶部导航，页面里不要再写 `<nav>` 标签**：CSS 有一条全局 `nav{position:fixed;top:0;...}`，任何 `<nav>` 都会被钉到视口顶端。栏目切换容器已用 `<div role="tablist">` 实现，这是刻意规避，别改回 `<nav>`
