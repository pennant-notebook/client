import { Link } from 'react-router-dom';
import buttonStyles from './buttons.module.css';
import intro from './assets/intro.gif';
import javascript from './assets/javascript.svg';
import markdown from './assets/markdown.svg';
import collab from './assets/collab.svg';
import magnifyingGlass from './assets/magnifying-glass.svg';
import Github from './assets/github.png';
import styles from './LandingPage.module.css';
import { Box } from '../../utils/MuiImports';
import Navigation from './Navigation';

const LandingPage = () => {
  document.title = 'Pennant';

  return (
    <Box className={styles.main}>
      <Navigation />
      <div className={styles.page + '  centered'}>
        <section className={styles.introduction}>
          <div className='container'>
            <Box sx={{ textAlign: 'center' }}>
              <h1>Code, Note, Share: All in One Place</h1>
              <p className={styles.subheadline}>
                Pennant is an open source computational notebook that brings note-taking, code execution and real-time
                collaboration to a single platform.
              </p>
            </Box>
            <div className={styles.buttons}>
              <Link
                className={`${buttonStyles.button} ${buttonStyles.primary}`}
                to={'/@trypennant/7c776af1-ebfe-4559-9a5d-b785e5070dab'}>
                Try the Tutorial
              </Link>

              <Link className={`${buttonStyles.button} ${buttonStyles.secondary}`} to='/@trypennant'>
                View Demo Notebooks
              </Link>
            </div>
            <div className={styles.code_block}>
              <img src={intro} alt='Pennant Demo' />
            </div>
          </div>
        </section>

        <section className={styles.perksSection}>
          <div className={styles.perks}>
            <div className={styles.perk}>
              <div className={styles.icon}>
                <img src={javascript} alt='Javascript icon' />
              </div>
              <h3 style={{ color: '#000' }}>JavaScript</h3>
              <span>Built-in support for JavaScript</span>
            </div>

            <div className={styles.perk}>
              <div className={styles.icon}>
                <img src={markdown} alt='Markdown logo' />
              </div>
              <h3 style={{ color: '#000' }}>Markdown</h3>
              <span>Built-in support for Markdown</span>
            </div>

            <div className={styles.perk}>
              <div className={styles.icon}>
                <img src={collab} alt='Globe icon' />
              </div>
              <h3 style={{ color: '#000' }}>Collaborate</h3>
              <span>Share notebooks and collaborate in real-time</span>
            </div>
          </div>
        </section>

        <section className={styles.explore}>
          <div className='container'>
            <div className='row'>
              <h2>Dive Deeper</h2>
              <section className={styles.footerButtons}>
                <div className={styles.footerButton}>
                  <a href='https://pennant-notebook.github.io/' target='_blank' rel='noreferrer'>
                    <img alt='Case Study' src={magnifyingGlass} className={styles.footerIcon} />
                    <span>Read our case study</span>
                  </a>
                </div>
                <div className={styles.footerButton}>
                  <a href='https://github.com/pennant-notebook' target='_blank' rel='noreferrer'>
                    <img alt='GitHub Repo' src={Github} className={styles.footerIcon} />
                    <span>Explore our GitHub</span>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </Box>
  );
};

export default LandingPage;
