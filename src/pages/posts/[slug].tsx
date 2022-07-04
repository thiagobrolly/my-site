import { GetServerSideProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import styles from './post.module.scss';
import { getPrismicClient } from '../../services/prismic';
import Head from 'next/head';
import Image from 'next/image';

type Post = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  updateAt: string;
};

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <main className={styles.container}>
        <article>
          <Image
            src={post.cover}
            alt={post.title}
            width={720}
            height={410}
            quality={100}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
          />
          <h1>{post.title}</h1>
          <time>{post.updateAt}</time>
          <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.description}}></div>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params;
  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('post', String(slug), {});

  if (!response) {
    return {
      redirect: {
        destination: '/posts',
        permanent: false,
      },
    };
  }

  const post = {
    slug: slug,
    title: RichText.asText(response.data.title),
    description: RichText.asHtml(response.data.description),
    cover: response.data.cover.url,
    updateAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  };

  return {
    props: {
      post,
    },
  };
};
