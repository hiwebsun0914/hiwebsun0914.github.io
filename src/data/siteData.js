export const heroData = {
  name: '林知夏',
  signature: '在代码、文字和镜头里，记录大学四年的慢慢成长。',
  intro:
    '你好呀，我是林知夏，目前是一名大三学生。这里是我的个人主页，会分享学习笔记、校园日常、作品和一些认真生活的小瞬间。',
  welcome: '欢迎来到我的小站，愿我们都能在热爱里发光。',
  avatar: '/assets/images/avatar.svg'
};

export const profileData = {
  name: '林知夏',
  school: '示例大学',
  major: '计算机科学与技术',
  grade: '2023 级 本科生',
  interests: ['人工智能应用', '前端开发', '摄影记录', '校园写作'],
  skills: ['Python', 'C++', 'JavaScript', 'AI', '摄影', '写作'],
  contact: {
    email: 'linzhixia@example.com',
    wechat: 'linzhixia_study',
    location: '中国 · 某某城市'
  }
};

export const externalLinks = [
  {
    title: '我的博客专栏',
    description: '持续更新课程学习、项目复盘与成长记录。',
    url: 'https://example.com/blog',
    action: '去看看'
  },
  {
    title: 'GitHub',
    description: '放一些课程作业、练手项目和开源尝试。',
    url: 'https://github.com/example-student',
    action: '访问仓库'
  },
  {
    title: '知乎主页',
    description: '会写一些学习经验和大学生活观察。',
    url: 'https://www.zhihu.com/people/example-student',
    action: '阅读回答'
  }
];

export const footerData = {
  copyright: `© ${new Date().getFullYear()} 林知夏`,
  slogan: '由林知夏同学的个人主页驱动',
  socials: [
    { label: 'GitHub', url: 'https://github.com/example-student' },
    { label: '博客', url: 'https://example.com/blog' },
    { label: '知乎', url: 'https://www.zhihu.com/people/example-student' }
  ]
};

export const guestbookConfig = {
  // 可选值：'local' | 'github-issues'
  mode: 'github-issues',
  // 推荐使用 'auto'，会自动识别当前 GitHub 仓库，无需手填账号和仓库名。
  repo: 'auto',
  // 固定使用同一个 Issue 作为留言板入口（如果不存在会自动创建）。
  issueTerm: '校园留言板',
  // 可选：你可在仓库里新建该 label，便于筛选留言相关 issue。
  label: 'guestbook',
  // 预留主题字段（当前方案未使用）。
  theme: 'github-light'
};
