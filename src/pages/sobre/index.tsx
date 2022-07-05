import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

interface ContentProps{
  content: {
    title: string; 
    description: string; 
    banner: string; 
    facebook: string; 
    instagram: string; 
    youtube: string; 
    linkedin: string;
  }
}

export default function Sobre({content}: ContentProps) {
  return (
    <>
      <Head>
        <title>Sobre | Thiago Brolly</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.containerText}>
            <h1>{content.title}</h1>
            <p>{content.description}</p>

            <a href={content.facebook}><FaFacebook size={30} /></a>
            <a href={content.instagram}><FaInstagram size={30} /></a>
            <a href={content.linkedin}><FaLinkedin size={30} /></a>
            <a href={content.youtube}><FaYoutube size={30} /></a>
          </section>

          <img src={content.banner} alt={content.title} />
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'about'),
  ]);

  const { 
    title, 
    description, 
    banner, 
    facebook, 
    instagram, 
    youtube, 
    linkedin 
  } = response.results[0].data;

  const content = {
    title: RichText.asText(title),
    description: RichText.asText(description),
    banner: banner.url,
    facebook: facebook.url,
    instagram: instagram.url,
    youtube: youtube.url,
    linkedin: linkedin.url,
  };

  return {
    props: {
      content,
    },
    revalidate: 60 * 15 // A cada 15 mins
  };
};
