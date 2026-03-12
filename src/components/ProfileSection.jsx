function ProfileSection({ profile }) {
  return (
    <section id="profile" className="section">
      <div className="container">
        <div className="section-heading">
          <h2>个人信息</h2>
          <p>关于我正在学习和探索的方向。</p>
        </div>

        <div className="card profile-card">
          <div className="profile-meta">
            <p>
              <strong>姓名：</strong>
              {profile.name}
            </p>
            <p>
              <strong>学校：</strong>
              {profile.school}
            </p>
            <p>
              <strong>专业：</strong>
              {profile.major}
            </p>
            <p>
              <strong>年级：</strong>
              {profile.grade}
            </p>
          </div>

          <div className="profile-column">
            <h3>兴趣方向</h3>
            <ul className="pill-list">
              {profile.interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="profile-column">
            <h3>技能标签</h3>
            <ul className="tag-list">
              {profile.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="profile-column">
            <h3>联系方式</h3>
            <p>邮箱：{profile.contact.email}</p>
            <p>微信：{profile.contact.wechat}</p>
            <p>所在地：{profile.contact.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileSection;
