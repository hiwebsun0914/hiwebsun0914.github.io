# 大学生个人博客 / 个人主页（React + Vite）

这个项目支持：

- 本地开发预览
- 推送到 GitHub 后自动部署到 GitHub Pages
- 留言板自动联动当前仓库的 GitHub Issues（无需手填账号/仓库名）

## 一次性准备

```bash
# 已安装可跳过
conda install -n base -c conda-forge nodejs=20 -y
```

## 本地运行

```bash
cd "/Users/hiwebsun/科研与成长/个人博客"
npm install
npm run dev
```

## 你要求的“只要 clone + push”部署流程

你自己登录 GitHub、建仓库、push 即可，不需要再跑额外脚本。

```bash
cd "/Users/hiwebsun/科研与成长/个人博客"
git init
git add .
git commit -m "init blog"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<你的仓库名>.git
git push -u origin main
```

然后等待 GitHub Actions 自动部署（仓库里已带工作流）：

- `.github/workflows/deploy-pages.yml`

站点地址：

- `https://<你的用户名>.github.io/<你的仓库名>/`

## 留言板（GitHub Issue 联动）

默认配置在 `src/data/siteData.js`：

```js
export const guestbookConfig = {
  mode: 'github-issues',
  repo: 'auto',
  issueTerm: '校园留言板',
  label: 'guestbook',
  theme: 'github-light'
};
```

说明：

- `repo: 'auto'` 会自动识别当前 Pages 对应仓库
- 留言发布时会跳转到该仓库的「新建 Issue」页面确认提交
- 已发布的留言会在页面中自动读取并展示

## 常改内容

- 个人信息：`src/data/siteData.js`
- 博客文章：`src/data/blogs.js`
- 照片墙：`src/data/gallery.js`
- 本地留言初始数据：`src/data/guestbookSeed.js`
- 图片资源：`public/assets/images/`

## 如果要改回本地留言

`src/data/siteData.js` 中：

```js
mode: 'local'
```
