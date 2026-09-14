# 食味人间 · 中华美食志

一个纯静态的中式美食主题网站。零构建、零依赖，双击 `index.html` 即可打开。

## 文件清单

| 文件 | 说明 |
|---|---|
| `index.html` | **首页主版本**。单文件，含全部 HTML / CSS / JS / SVG 插画 |
| `cuisine-chuan.html` | 川菜专栏页（8 个菜系各一页，由脚本生成） |
| `cuisine-yue.html` | 粤菜专栏页 |
| `cuisine-lu.html` | 鲁菜专栏页 |
| `cuisine-su.html` | 苏菜专栏页 |
| `cuisine-zhe.html` | 浙菜专栏页 |
| `cuisine-min.html` | 闽菜专栏页 |
| `cuisine-xiang.html` | 湘菜专栏页 |
| `cuisine-hui.html` | 徽菜专栏页 |
| `season-spring.html` | 春季节气页（立春→谷雨，由脚本生成） |
| `season-summer.html` | 夏季节气页（立夏→大暑） |
| `season-autumn.html` | 秋季节气页（立秋→霜降） |
| `season-winter.html` | 冬季节气页（立冬→大寒） |
| `build-cuisines.mjs` | **菜系专栏页生成器**。改完菜系数据重跑即可覆盖那 8 个页面 |
| `build-seasons.mjs` | **季节专栏页生成器**。改完节气数据重跑即可覆盖那 4 个页面 |
| `index-before-season.html` | 2026-09-14 节气食单改版前的备份，回退用，可删 |
| `index-before-cuisine8.html` | 2026-09-14 菜系扩到 8 道菜 + 进专栏前的备份，回退用，可删 |
| `index-before-mobile.html` | 2026-09-14 手机端横向溢出修复前的备份，回退用，可删 |
| `index-before-640fix.html` | 2026-09-13 修窄屏按钮 / nav 具名化前的备份，回退用，可删 |
| `index-before-xdj.html` | 2026-09-13 加「中华小当家」风格前的备份，回退用，可删 |
| `index-before-3pane.html` | 2026-09-12 三屏改版前的旧版备份，回退用，可删 |
| `README.md` | 本文件 |

> 早期简洁模板版 `simple.html` 已于 2026-09-12 删除，不再保留。

## 两套视觉风格（可切换）

页面内置两套风格，**右上角导航栏内的星形按钮**切换（窄屏下只留图标），选择记在 `localStorage`（键 `foodpage-style`），首页与 8 个专栏页共用同一个键，切换一次全站跟着变。

| 风格 | 启用方式 | 特征 |
|---|---|---|
| **水墨志**（默认） | `body` 无额外 class | 宣纸米底、朱砂红、书法字、手绘线稿、柔和阴影 |
| **中华小当家** | `body.xdj` | 暖黄纸底、高饱和红金、漫画集中线、金光爆闪、粗黑描边、硬阴影、拟声词爆框「唰——！」、闪光星 |

- 小当家风格的全部样式都写在 `<style>` 末尾的 `body.xdj` 区块里（约 70 条规则），**不改动任何原有结构**，删掉这一整块就回到水墨版
- 新增的漫画元素（`.bang` 爆框、`.spark` 闪光星）默认 `display:none`，只在 `body.xdj` 下显示
- 只是视觉语言的致敬（集中线 / 金光 / 粗描边 / 拟声词），**不描绘任何具体作品的角色形象**
- 想默认就用小当家风格：把 JS 里 `apply(saved==='xdj'?'xdj':'ink',false)` 改成 `apply('xdj',false)`

## 页面结构（共 3 屏）

1. **第 1 屏 · 封面 Hero** — 「食味人间」竖排书法标题 + 朱砂印章 + 手绘汤面碗（面条、溏心蛋、青菜、筷子），蒸汽飘动动画，外圈缓慢旋转的环形文字；下方接跑马灯条（早茶 · 烧烤 · 涮锅 · 卤味……，悬停暂停）
2. **第 2 屏 · 每日一味**（`id="daily"`）— 居中画框，带中式回纹边框，按当天日期在 8 道菜中自动轮换，显示当天日期与期数
3. **第 3 屏 · 寻味栏目**（`id="columns"`）— 三档栏目用 tab 切换，同屏内切换、不再往下铺页面。顶部是一行**轻量子标题**「寻味栏目 · Columns」+ 三个下划线式 tab，**不用** `.sec-head` 大标题，避免抢主屏标题的层级：

   | 栏目 | 面板 id | 内容 |
   |---|---|---|
   | 八大菜系 | `p-cuisines` | 川粤鲁苏浙闽湘徽，每格书法字水印 + 专属 SVG 底纹 + **8 道代表菜（带手绘图标）**，**整张卡片可点，进各自专栏页** |
   | 街头巷尾 | `p-snacks` | 6 张小吃横滑卡，全部手绘矢量插画 |
   | 节气食单 | `p-seasonal` | 春夏秋冬 4 张暗色卡，每卡列该季 6 个节气的当令食物，**整卡可点**进季节页 |

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

每个菜系卡片里的菜品是一组 `<ul class="cu-dishes">`（**两列 8 道**），每项 = 图标 + 菜名：

```html
<li><svg class="ic" aria-hidden="true"><use href="#ic-tofu"/></svg>麻婆豆腐</li>
```

图标是一套内联 SVG `<symbol>` 图标库，定义在栏目 section 开头的 `<svg class="defs">` 里，现有 28 个：

`ic-fish` 鱼 · `ic-chicken` 鸡腿 · `ic-pork` 肉块 · `ic-shrimp` 虾 · `ic-crab` 蟹 · `ic-duck` 鸭 · `ic-tofu` 豆腐 · `ic-soup` 汤盅 · `ic-noodle` 面碗 · `ic-dumpling` 饺子 · `ic-bamboo` 笋 · `ic-greens` 青菜 · `ic-chili` 辣椒 · `ic-hotpot` 火锅 · `ic-rice` 米饭 · `ic-meatball` 丸子 · `ic-seacucumber` 海参 · `ic-tripe` 卤味肚片 · `ic-beef` 牛 · `ic-egg` 蛋 · `ic-eel` 鳝鳗 · `ic-clam` 贝蚝 · `ic-cake` 糕点 · `ic-abalone` 鲍螺 · `ic-ribs` 排骨 · `ic-sausage` 腊味 · `ic-pot` 砂锅 · `ic-skewer` 串炸

加新图标：在图标库的 `<defs>` 里加一个 `<symbol id="ic-xxx" viewBox="0 0 40 40">`，用 40×40 坐标画线即可，**不用写 stroke 颜色**——描边由 CSS `.cu-dishes .ic{stroke:currentColor;color:var(--red)}` 统一继承，hover 时会整体变色放大。

> 图标库的**唯一真源是 `index.html`**。专栏页生成脚本会从这里按需抽取 symbol 内联进各页，所以新增图标只需改 `index.html`，再重跑生成脚本。

### 菜系专栏页（8 个独立页面）

首页每张菜系卡片是一整块 `<a>`（不是 `article`），指向 `cuisine-<key>.html`，可中键 / 右键新标签打开：

```html
<a class="cu rv" href="cuisine-chuan.html" aria-label="川菜专栏 · 麻辣鲜香，查看 8 道代表菜">
  ...
  <span class="cu-more">进入专栏<i aria-hidden="true">→</i></span>
</a>
```

> 卡片去掉 `display:block` 会退回行内布局、整块点不动——`.cu` 里那行别删。

每页包含四个版块：**历史渊源与地理成因 / 口味特点与核心技法（味型 + 技法标签）/ 八道代表菜逐一详解 / 冷知识与食俗**，底部有上一下一菜系导航与返回首页，并沿用与首页完全一致的两套风格切换（共用同一个 `localStorage` 键 `foodpage-style`）。

**改内容或改版式**：不要直接编辑那 8 个 `.html`，它们会被覆盖。改 `build-cuisines.mjs`：

- 文字内容在文件顶部的 `CUISINES` 数组里，改完在 `food-page/` 目录执行 `node build-cuisines.mjs` 重新生成 8 页
- 版式在 `page()` 函数返回的模板字符串里，八个页面共用同一份模板
- 脚本会校验图标：引用了 `index.html` 里不存在的 `ic-*` 会直接报错并中止，不会生成半成品

### 改节气食单的季节页

`season-spring / summer / autumn / winter.html` 由 `build-seasons.mjs` 生成，**别手改**。每页含：季节导语 + 该季 6 个节气，每个节气三段 = **由来与物候 / 食俗讲究 / 当令食材详解**（每项配图标），底部上一下一季节循环导航。

改法：`build-seasons.mjs` 顶部的 `SEASONS` 数组（`terms` 里每个节气含 `origin` / `custom` / `foods`），改完执行 `node build-seasons.mjs`。同样有图标引用校验。

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
├── index.html                ← 首页，入口
├── cuisine-*.html            ← 8 个菜系专栏页（互链，也链回 index）
├── season-*.html             ← 4 个季节节气页（互链，也链回 index）
├── build-cuisines.mjs        ← 菜系页生成器（只有改内容时才需要 node）
├── build-seasons.mjs         ← 季节页生成器
├── README.md
└── index-before-*.html       ← 历史备份（可删）
```

首页与专栏页之间是**相对路径互链**，整个目录一起搬走链接就不会断（不要只搬 `index.html`）。
也可以直接丢进任意静态托管（GitHub Pages / Nginx / 对象存储），把 `index.html` 作为入口即可。

## 注意事项

- 所有插画都是内联 SVG，不依赖任何图片文件，**不存在图片 404 风险**
- 不要引入外部图片链接或 CDN 资源，会破坏离线可用性
- 编辑 `index.html` 时注意保留 `<script>` 中的四个 IIFE（每日轮换、滚动入场 IntersectionObserver、栏目切换、风格切换）
- 顶部导航用的是具名选择器 `.topbar`（**不是**元素选择器 `nav`），所以页面里可以安全地再加 `<nav>`；栏目切换容器仍保持 `<div role="tablist">` 写法
- **`overflow:hidden` 的容器里，绝对定位的装饰元素不要写负偏移**，右下角会被裁掉（`.cu .big`、`.se .wm` 都踩过）；hover 有 scale/rotate 时还要多留约 10px 余量
- **靠 `transform` 居中的元素，写 keyframes 时末帧必须带上基础 transform**（如 `translate(-50%,-50%)`），否则动画结束会跑到别处
- 手机端横向溢出优先查**伪元素**：`overflow:hidden` 容器里的 `::before` 若用负 `inset`，DOM 遍历查不出来，要靠逐个禁用伪元素二分定位。修复时给该 section 加 `overflow:hidden`，并确认 `html` 与 `body` 都写了 `overflow-x:hidden`
