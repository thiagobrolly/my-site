import styles from './styles.module.scss';
import Image from 'next/image';
import logo from '../../../public/images/logo.svg';
import { ActiveLink } from '../ActiveLink';

export function Footer() {
  return (
    <footer className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <ActiveLink href="/" activeClassName={styles.active}>
          <p>
            ©2022 - Desenvolvido por <a>Thiago Brolly</a>
          </p>
        </ActiveLink>

        {/* <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Início</a>
          </ActiveLink>
          <ActiveLink href="/sobre" activeClassName={styles.active}>
            <a>Sobre mim</a>
          </ActiveLink>
          <ActiveLink href="/projects" activeClassName={styles.active}>
            <a>Projetos</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Blog</a>
          </ActiveLink>
        </nav> */}
      </div>
    </footer>
  );
}
