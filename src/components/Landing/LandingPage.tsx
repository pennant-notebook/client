import { Link } from 'react-router-dom';
import buttonStyles from './buttons.module.css';
import intro from './assets/intro.gif';
import javascript from './assets/javascript.svg';
import markdown from './assets/markdown.svg';
import collab from './assets/collab.svg';
import magnifyingGlass from './assets/magnifying-glass.svg';
import Github from './assets/github-white.png';
import styles from './LandingPage.module.css';
import { Box } from '~/utils/MuiImports';
import Navigation from './Navigation';

const LandingPage = () => {
  document.title = 'Pennant';

  return (
    <Box className={styles.main}>
      <Navigation />
      <div className={`${styles.page} `}>
        <section className={`${styles.introduction}`}>
          <div className={`${styles.container}`}>
            <Box sx={{ textAlign: 'center' }} className={styles.centered}>
              <h1>Code, Note, Share: All in One Place</h1>
              <p className={`${styles.subheadline} ${styles.fancyFont}`}>
                Pennant is an open source computational notebook and live coding environment.
              </p>
            </Box>
            <div className={`${styles.buttons} ${styles.animatedButtons}`}>
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
              <span>
                Blazing-fast code execution, with the freedom to run cells individually or the entire notebook.
              </span>
            </div>

            <div className={styles.perk}>
              <div className={styles.icon}>
                <img src={markdown} alt='Markdown logo' />
              </div>
              <h3 style={{ color: '#000' }}>Markdown</h3>
              <span>Instant, reactive Markdown editing for immediate output conversion.</span>
            </div>

            <div className={styles.perk}>
              <div className={styles.icon}>
                <img src={collab} alt='Globe icon' />
              </div>
              <h3 style={{ color: '#000' }}>Collaborate</h3>
              <span>Real-time notebook sharing with conflict-free synchronization.</span>
            </div>
          </div>
        </section>

        <section className={`${styles.explore} ${styles.darkBg} ${styles.noPadding}`}>
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
