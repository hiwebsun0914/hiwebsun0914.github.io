import { useState } from 'react';

function Gallery({ images }) {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section id="gallery" className="section">
      <div className="container">
        <div className="section-heading">
          <h2>照片墙</h2>
          <p>一些校园、生活和风景的轻松记录，点击图片可放大查看。</p>
        </div>

        <div className="grid gallery-grid">
          {images.map((item) => (
            <figure key={item.id} className="card gallery-item">
              <button
                type="button"
                className="gallery-button"
                onClick={() => setActiveImage(item)}
                aria-label={`查看图片：${item.title}`}
              >
                <img src={item.src} alt={item.title} />
              </button>
              <figcaption>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {activeImage && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setActiveImage(null)} />
          <div className="modal-content card">
            <button
              className="modal-close"
              type="button"
              onClick={() => setActiveImage(null)}
              aria-label="关闭预览"
            >
              ×
            </button>
            <img src={activeImage.src} alt={activeImage.title} />
            <h3>{activeImage.title}</h3>
            <p>{activeImage.desc}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;
