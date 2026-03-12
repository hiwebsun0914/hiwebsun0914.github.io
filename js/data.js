export const heroData = {
  name: '陈知行',
  signature: '中山大学智能工程学院学生会成员，记录学习、服务与校园成长。',
  intro:
    '你好，我是陈知行，来自中山大学智能工程学院，目前在学院学生会参与宣传与活动策划。这个主页会分享学习笔记、学生工作复盘和校园生活记录。',
  welcome: '欢迎来到我的主页，和你一起把大学生活过得热烈又踏实。',
  avatar: 'assets/images/avatar.svg'
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

export const blogs = [
  {
    id: 1,
    slug: 'sysu-ise-student-union-growth',
    title: '在中大智能工程学院学生会的一学期：忙碌但很值得',
    excerpt: '从活动策划到现场执行，记录我在学生会一学期的真实成长。',
    date: '2026-03-01',
    tags: ['学生会', '校园活动'],
    cover: 'assets/images/photo1.svg',
    content: [
      '加入中山大学智能工程学院学生会后，我第一次完整参与了学院迎新与科技文化节的组织工作。',
      '前期最难的是把想法变成可执行清单：场地、物料、主持、宣传、志愿者排班，每个环节都要提前确认。',
      '活动当天虽然很累，但看到同学们积极参与，真的会有很强的成就感。',
      '这段经历让我更懂“团队协作”的价值，也让我学会在压力下保持稳定节奏。'
    ]
  },
  {
    id: 2,
    slug: 'ise-ai-course-notes',
    title: '智能工程课程笔记：我如何整理 AI 课内外学习路径',
    excerpt: '把课程内容、实验作业和项目实践串起来，形成一条可坚持的学习路线。',
    date: '2026-02-16',
    tags: ['AI学习', '课程笔记'],
    cover: 'assets/images/photo2.svg',
    content: [
      '在智能工程学院的课程里，知识点很多，如果不做结构化整理，很容易学完就忘。',
      '我把每门课都拆成三个文件夹：核心概念、实验代码、复盘总结。',
      '每周固定一晚做“知识回放”：只看自己写的总结，不再从零刷一遍教材。',
      '这个方法帮我在考试周和项目周都能更快找回重点，也减少了临时抱佛脚。'
    ]
  },
  {
    id: 3,
    slug: 'publicity-workflow-for-campus-events',
    title: '学院活动宣传复盘：从海报到推文的完整流程',
    excerpt: '分享学生会宣传工作的实际流程，以及如何在有限时间内保证质量。',
    date: '2026-01-22',
    tags: ['宣传设计', '学生工作'],
    cover: 'assets/images/photo3.svg',
    content: [
      '宣传工作看起来只是“做图发文”，实际是一个串联多方信息的协作过程。',
      '我通常先和活动负责人确认关键信息，再做统一视觉模板，避免每次从零开始。',
      '发布前会做三轮检查：时间地点、报名方式、文案错别字，尽量把低级错误挡在发布前。',
      '流程化之后，出稿速度明显提升，也更容易保持学院品牌风格一致。'
    ]
  },
  {
    id: 4,
    slug: 'campus-life-and-self-management',
    title: '学习 + 学生工作 + 生活：我的时间管理实践',
    excerpt: '课程、学生会任务和日常生活并行时，我用这套方法维持节奏。',
    date: '2025-12-30',
    tags: ['时间管理', '大学生活'],
    cover: 'assets/images/photo4.svg',
    content: [
      '大二之后任务明显变多，最怕的不是忙，而是“忙乱”。',
      '我会把任务分为“必须当天完成”和“本周推进”，并给每件事设定可交付结果。',
      '每天晚上花 10 分钟回顾：今天推进了什么、明天最重要的一件事是什么。',
      '稳定执行这个习惯后，我的焦虑感明显下降，效率也更可控了。'
    ]
  }
];

export const galleryImages = [
  { id: 1, src: 'assets/images/photo1.svg', title: '晨光操场', desc: '清晨活动前拍下的第一缕阳光。' },
  { id: 2, src: 'assets/images/photo2.svg', title: '图书馆一角', desc: '复习周最常待着的地方。' },
  { id: 3, src: 'assets/images/photo3.svg', title: '晚霞教学楼', desc: '下课后天色特别温柔。' },
  { id: 4, src: 'assets/images/photo4.svg', title: '秋叶小路', desc: '忙完工作后慢慢走回宿舍。' },
  { id: 5, src: 'assets/images/photo5.svg', title: '活动筹备日', desc: '大家一起准备学院活动。' },
  { id: 6, src: 'assets/images/photo6.svg', title: '雨后校园', desc: '地面的倒影很好看。' },
  { id: 7, src: 'assets/images/photo7.svg', title: '夜晚自习室', desc: '和同学赶项目的夜晚。' },
  { id: 8, src: 'assets/images/photo8.svg', title: '周末散步', desc: '在湖边放松一下。' }
];

export const guestbookSeed = [
  {
    id: 'seed-1',
    nickname: '智能院同学',
    message: '页面很清爽，学生会活动复盘写得很真实，支持继续更新！',
    createdAt: '2026-03-02 20:15'
  },
  {
    id: 'seed-2',
    nickname: '宣传部伙伴',
    message: '博客里的宣传流程总结很实用，下次活动还可以继续复用。',
    createdAt: '2026-03-04 09:42'
  },
  {
    id: 'seed-3',
    nickname: '路过的师弟',
    message: '看完更想加入学院学生组织了，感谢分享。',
    createdAt: '2026-03-06 14:27'
  }
];

export const guestbookConfig = {
  mode: 'github-issues',
  repo: 'auto',
  issueTerm: '中大智能工程留言板',
  label: 'guestbook'
};
