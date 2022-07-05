import Head from 'next/head';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { AiFillGithub } from 'react-icons/ai';
import { BiLinkExternal } from 'react-icons/bi';
import techsImage from '../../public/images/techs.svg';
import { getPrismicClient } from '../services/prismic';
import styles from '../../styles/home.module.scss';
import Link from 'next/link';

type Content = {
  title: string;
  titleContent: string;
  linkAction: string;
  mobileTitle: string;
  mobileContent: string;
  mobileBanner: string;
  webTitle: string;
  webContent: string;
  webBanner: string;
  infosImg: string;
  infosImgAlt: string;
  profileImg: string;
  profileImgAlt: string;
  mobileBannerAlt: string;
  webBannerAlt: string;
};

type Project = {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
  technologies: string;
  github: string;
  demo: string;
};

interface HomeProps {
  content: Content;
  projects: Project[];
}

export default function Home({ content, projects }: HomeProps) {
  return (
    <>
      <Head>
        <title>Thiago Sousa</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <span>{content.titleContent}</span>
            <img src={content.infosImg} alt={content.infosImgAlt} />
          </section>
          <img src={content.profileImg} alt={content.profileImgAlt} />
        </div>

        {/* <div id="about" className={styles.sectionAbout}>
          <div className={styles.titleSection}>
            <h2>Sobre mim</h2>
            <hr className={styles.divisor} />
          </div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            similique non recusandae saepe, odio dicta maiores praesentium nihil
            eveniet modi quia eos officiis eligendi omnis beatae tempore, error,
            totam quis.
            
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            similique non recusandae saepe, odio dicta maiores praesentium nihil
            eveniet modi quia eos officiis eligendi omnis beatae tempore, error,
            totam quis.
          </p>
        </div> */}

        <div id="projects" className={styles.sectionProjects}>
          <div className={styles.titleSection}>
            <h2>Algumas coisas que construí</h2>
            <hr className={styles.divisor} />
          </div>
          <div className={styles.projectsContent}>
            {projects.map((project) => (
              <section key={project.slug}>
                <div className={styles.projectsContentImg}>
                  <img src={project.thumbnail} alt={project.thumbnailAlt} />
                  <div className={styles.image__overlay}></div>
                </div>
                <div className={styles.projectsContentLeft}>
                  <h3>{project.title}</h3>
                  <div className={styles.paragraph}>
                    <p>{project.description}</p>
                  </div>
                  <span>{project.technologies}</span>
                  <div className={styles.icons}>
                    <a type="button" href={project.github} target="_blank">
                      <AiFillGithub size={25} color="fit-content" />
                    </a>
                    <a type="button" href={project.demo} target="_blank">
                      <BiLinkExternal size={25} color="fit-content" />
                    </a>
                  </div>
                </div>
              </section>
            ))}
          </div>
          <Link href="/projects">
            <a className={styles.more}>Ver mais</a>
          </Link>
        </div>

        <div id="contact" className={styles.sectionContact}>
          <div className={styles.titleSection}>
            <h2>Contato</h2>
            <hr className={styles.divisor} />
          </div>
          <p>
            Em contrução
          </p>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  // const response = await prismic.query(
  //   Prismic.Predicates.any("document.type", ["home", "project"])
  // );

  const homeResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'home'),
  ]);

  const projectResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'project')],
    {
      orderings: '[document.last_publication_date desc]',
    },
  );

  //console.log(response);
  // console.log(JSON.stringify(homeResponse, null, 2));
  // console.log(JSON.stringify(projectResponse, null, 2));

  const {
    title,
    sub_title,
    infos,
    profile,
    link_action,
    mobile_title,
    mobile_content,
    mobile_banner,
    web_title,
    web_content,
    web_banner,
  } = homeResponse.results[0].data;

  const content = {
    title: RichText.asText(title),
    titleContent: RichText.asText(sub_title),
    infosImg: infos.url,
    infosImgAlt: infos.alt,
    profileImg: profile.url,
    profileImgAlt: profile.alt,
    linkAction: link_action.url,
    mobileTitle: RichText.asText(mobile_title),
    mobileContent: RichText.asText(mobile_content),
    mobileBanner: mobile_banner.url,
    mobileBannerAlt: mobile_banner.alt,
    webTitle: RichText.asText(web_title),
    webContent: RichText.asText(web_content),
    webBanner: web_banner.url,
    webBannerAlt: web_banner.alt,
  };

  const projects = projectResponse.results.map((project) => ({
    slug: project.uid,
    title: RichText.asText(project.data.title),
    description: RichText.asText(project.data.description),
    thumbnail: project.data.thumbnail.url,
    thumbnailAlt: project.data.thumbnail.alt,
    technologies: RichText.asText(project.data.technologies),
    github: project.data.github.url,
    demo: project.data.demo.url,
  }));

  // console.log(projects);
  // console.log(content);

  return {
    props: {
      content,
      projects,
    },
    revalidate: 60 * 2, // A cada 2 min
  };
};
