# 中山大学智能工程学院学生会个人博客（免编译版）

这是一个 **纯 HTML + CSS + JavaScript** 的静态站点。

- 不需要 `npm run build`
- 不需要任何编译工具
- `clone` 后直接可打开使用
- 推送到 GitHub 后可直接用 GitHub Pages 托管源码站点

## 目录（核心）

```text
.
├─ index.html
├─ blogs.html
├─ article.html
├─ styles/
│  └─ main.css
├─ js/
│  ├─ data.js
│  ├─ common.js
│  ├─ home.js
│  ├─ blogs-page.js
│  ├─ article-page.js
│  └─ guestbook.js
└─ assets/
   └─ images/
      ├─ avatar.svg
      ├─ photo1.svg
      ├─ photo2.svg
      ├─ photo3.svg
      ├─ photo4.svg
      ├─ photo5.svg
      ├─ photo6.svg
      ├─ photo7.svg
      └─ photo8.svg
```

## 本地直接使用

方式 1：双击 `index.html` 直接打开。

方式 2（推荐）：本地静态服务器预览。

```bash
cd "/Users/hiwebsun/科研与成长/个人博客"
python3 -m http.server 8080
```

浏览器打开：`http://localhost:8080`

## GitHub Pages（不编译部署）

你只需要：建仓库、push 源码。

然后在仓库设置：

1. `Settings -> Pages`
2. `Build and deployment -> Source` 选择 `Deploy from a branch`
3. Branch 选择 `main`，文件夹选择 `/ (root)`
4. 保存

几分钟后访问：

- `https://<你的用户名>.github.io/<仓库名>/`

## 留言板

留言板默认是 `github-issues` 模式：

- 页面自动识别当前 GitHub 仓库（`repo: auto`）
- 发布留言时跳转到仓库 Issue 新建页确认提交
- 页面自动读取带 `guestbook` 标签的 Issue 列表
- 如果当前不是 GitHub Pages，自动回退本地留言（localStorage）

配置文件：`js/data.js` 中 `guestbookConfig`。

## 中大智能工程学院学生会示例信息位置

- 个人信息：`js/data.js` 的 `heroData`、`profileData`
- 外部链接：`js/data.js` 的 `externalLinks`
- 博客文章：`js/data.js` 的 `blogs`
- 照片墙：`js/data.js` 的 `galleryImages`

## 图片占位说明

当前所有占位图都已放在 `assets/images/`，并已在各模块实际引用：

- 头像：`avatar.svg`
- 博客/照片墙占位：`photo1.svg` 到 `photo8.svg`
