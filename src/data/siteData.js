export const heroData = {
  name: '陈知行',
  signature: '中山大学智能工程学院学生会成员，记录学习、服务与校园成长。',
  intro:
    '你好，我是陈知行，来自中山大学智能工程学院，目前在学院学生会参与宣传与活动策划。这个主页会分享学习笔记、学生工作复盘和校园生活记录。',
  welcome: '欢迎来到我的主页，和你一起把大学生活过得热烈又踏实。',
  avatar: '/assets/images/avatar.svg'
};

export const profileData = {
  name: '陈知行',
  school: '中山大学',
  major: '智能工程学院 · 智能科学与技术',
  grade: '2022 级 本科生',
  interests: ['学生工作组织', '人工智能应用', '校园活动策划', '摄影与写作'],
  skills: ['Python', 'C++', 'JavaScript', '机器学习', '新媒体运营', '活动执行'],
  contact: {
    email: 'ise-studentunion@example.com',
    wechat: 'sysu_ise_union',
    location: '广东省 · 广州市'
  }
};

export const externalLinks = [
  {
    title: '个人博客专栏',
    description: '持续更新课程学习、学生会工作复盘和成长记录。',
    url: 'https://example.com/blog',
    action: '去看看'
  },
  {
    title: 'GitHub 主页',
    description: '放课程项目、活动小工具和前端练习作品。',
    url: 'https://github.com/example-sysu-ise',
    action: '访问仓库'
  },
  {
    title: '知乎主页',
    description: '分享学习经验、校园活动组织心得和干货。',
    url: 'https://www.zhihu.com/people/example-sysu-ise',
    action: '阅读回答'
  }
];

export const footerData = {
  copyright: `© ${new Date().getFullYear()} 陈知行`,
  slogan: '由中山大学智能工程学院学生会同学的个人主页驱动',
  socials: [
    { label: 'GitHub', url: 'https://github.com/example-sysu-ise' },
    { label: '博客', url: 'https://example.com/blog' },
    { label: '知乎', url: 'https://www.zhihu.com/people/example-sysu-ise' }
  ]
};

export const guestbookConfig = {
  // 可选值：'local' | 'github-issues'
  mode: 'github-issues',
  // 推荐使用 'auto'，会自动识别当前 GitHub 仓库，无需手填账号和仓库名。
  repo: 'auto',
  // 固定使用同一个 Issue 作为留言板入口（如果不存在会自动创建）。
  issueTerm: '中大智能工程留言板',
  // 可选：你可在仓库里新建该 label，便于筛选留言相关 issue。
  label: 'guestbook',
  // 预留主题字段（当前方案未使用）。
  theme: 'github-light'
};
