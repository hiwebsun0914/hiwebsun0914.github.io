function Hero({ data }) {
  return (
    <section id="hero" className="hero section">
      <div className="container hero-grid">
        <div className="hero-avatar-wrap">
          <img className="hero-avatar" src={data.avatar} alt={`${data.name} 的头像`} />
        </div>
        <div className="hero-content">
          <p className="hero-welcome">{data.welcome}</p>
          <h1>{data.name}</h1>
          <p className="hero-signature">{data.signature}</p>
          <p className="hero-intro">{data.intro}</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
