import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import styles from './styles.module.scss';
import { getPrismicClient } from '../../services/prismic';

type Post = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  updateAt: string;
};

interface PostsProps {
  posts: Post[];
  page: string;
  totalPage: string;
}

export default function Posts({ posts: postsBlog, page, totalPage }: PostsProps) {
  const [posts, setPosts] = useState(postsBlog || []);
  const [currentPage, setCurrentPage] = useState(Number(page));

  async function reqPost(pageNumber: number) {
    const prismic = getPrismicClient();

    const response = await prismic.query(
      [Prismic.Predicates.at('document.type', 'post')],
      {
        orderings: '[document.last_publication_date desc]',
        fetch: ['post.title', 'post.description', 'post.cover'],
        pageSize: 3,
        page: String(pageNumber),
      },
    );
    return response;
  }

  async function navigatePage(pageNumber: number) {
    const response = await reqPost(pageNumber);

    if(response.results.length === 0){
      return;
    }

    const getPosts = response.results.map((post) => {
      return {
        slug: post.uid,
        title: RichText.asText(post.data.title),
        description:
          post.data.description.find((content) => content.type === 'paragraph')
            ?.text ?? '',
        cover: post.data.cover.url,
        updateAt: new Date(post.last_publication_date).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          },
        ),
      };
    });

    setCurrentPage(pageNumber);
    setPosts(getPosts);
  }

  //console.log({ page, totalPage });
  return (
    <>
      <Head>
        <title>Blog | Thiago Sousa</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <Image
                  src={post.cover}
                  alt={post.title}
                  width={720}
                  height={410}
                  quality={100}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
                />
                <strong>{post.title}</strong>
                <time>{post.updateAt}</time>
                <p>{post.description}</p>
              </a>
            </Link>
          ))}

          <div className={styles.buttonNavigate}>
            {Number(currentPage) > 1 && (
              <div>
                <button onClick={() => navigatePage(Number(1))}>
                  <FiChevronsLeft size={25} color="#fff" />
                </button>
                <button onClick={() => navigatePage(Number(currentPage - 1))}>
                  <FiChevronLeft size={25} color="#fff" />
                </button>
              </div>
            )}

            {Number(currentPage) < Number(totalPage) && (
              <div>
                <button onClick={() => navigatePage(Number(currentPage + 1))}>
                  <FiChevronRight size={25} color="#fff" />
                </button>
                <button onClick={() => navigatePage(Number(totalPage))}>
                  <FiChevronsRight size={25} color="#fff" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      orderings: '[document.last_publication_date desc]',
      fetch: ['post.title', 'post.description', 'post.cover'],
      pageSize: 3,
    },
  );

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description:
        post.data.description.find((content) => content.type === 'paragraph')
          ?.text ?? '',
      cover: post.data.cover.url,
      updateAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
      ),
    };
  });

  return {
    props: {
      posts,
      page: response.page,
      totalPage: response.total_pages,
    },
    revalidate: 60 * 30, // atualiza a cada 30 mins
  };
};
