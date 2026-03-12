import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProfileSection from '../components/ProfileSection';
import LinkCards from '../components/LinkCards';
import BlogList from '../components/BlogList';
import Gallery from '../components/Gallery';
import Guestbook from '../components/Guestbook';
import Footer from '../components/Footer';
import { blogs } from '../data/blogs';
import { externalLinks, footerData, heroData, profileData } from '../data/siteData';
import { galleryImages } from '../data/gallery';

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const targetId = location.state?.targetId;
    if (!targetId) return;

    const timer = setTimeout(() => {
      const section = document.getElementById(targetId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.history.replaceState({}, document.title);
    }, 120);

    return () => clearTimeout(timer);
  }, [location.state]);

  return (
    <>
      <Navbar />
      <main>
        <Hero data={heroData} />
        <ProfileSection profile={profileData} />
        <LinkCards links={externalLinks} />
        <BlogList blogs={blogs} />
        <Gallery images={galleryImages} />
        <Guestbook />
      </main>
      <Footer data={footerData} />
    </>
  );
}

export default HomePage;
