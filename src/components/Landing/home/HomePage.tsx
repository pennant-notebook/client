import { useLocation, useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import contextVideo from './vids/context.mp4';
import intuitiveVideo from './vids/intuitive.mp4';
import introVideo from './vids/intro.gif';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '~/appState';
import Navigation from '../navigation/Navigation';
import classNames from 'classnames';
import GetStartedButton from './buttons/GetStartedButton';
import javascript from '../assets/javascript.svg';
import python from '~/assets/app/python.svg';
import markdown from '../assets/markdown.svg';
import collab from '../assets/collab.svg';

const NewHome = () => {
  document.title = 'Pennant';

  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useRecoilState(authState);
  const [showPython, setShowPython] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setShowPython(prevShowPython => !prevShowPython);
        setTransitioning(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkLoginStatus = () => {
      const pennantAccessToken = localStorage.getItem('pennantAccessToken');
      const username = localStorage.getItem('pennant-username');
      if (pennantAccessToken && username) {
        setAuth({
          isLoggedIn: true,
          userData: { login: username },
          provider: null
        });
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (location.pathname === '/' && auth.isLoggedIn) {
      navigate(`/@${auth.userData?.login}`);
    }
  }, [location.pathname, auth.isLoggedIn]);

  const handleClick = (event: React.MouseEvent) => {
    navigate('./auth', { state: { from: location } });
    event.preventDefault();
  };

  return (
    <div className={classNames(styles.homepage, styles.top)}>
      <Navigation />
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>
            Code, Note, Share: <strong>All in One Place.</strong>
          </h1>
          <p className={styles['headline']}>
            Pennant is an open source computational notebook and live coding environment.
          </p>
          <div className={styles.ctaWrapper}>
            <div className={''} style={{ textAlign: 'center' }}>
              <GetStartedButton title='Try demo notebooks' link={'/@trypennant'} />
            </div>
            <GetStartedButton title='Get Started' onClick={handleClick} />
          </div>
        </div>
        <div className={styles.headerMedia}>
          <div className={styles.videoWrapper}>
            <img src={introVideo} width='100%' />
          </div>
        </div>
      </header>
      <div className={styles.page}>
        <section className={classNames(styles.mainStory, styles.perksPromotional)}>
          <div className={classNames(styles.content, styles.story)}>
            <div className={styles}>
              <video autoPlay={true} loop={true} muted={true} style={{ maxWidth: '85%' }}>
                <source src={intuitiveVideo} type='video/mp4' />
                Video playback is not supported on your current browser.
              </video>
            </div>
            <div className={styles['promotional']}>
              <h4>Intuitive Interface</h4>
              <p>Enjoy an elegant, user-friendly interface that makes computational work a breeze.</p>
              <p>Focus on your code and content without the clutter, enhancing productivity and creativity.</p>
              <p>
                Invite peers to join your notebook and collaborate on code in real-time, from anywhere in the world.
              </p>
            </div>
          </div>

          <div className={classNames(styles.perks, styles.content)}>
            <div
              className={styles.perk}
              style={{
                opacity: transitioning ? 0 : 1,
                transition: 'opacity 1s ease-in-out'
              }}>
              <div className={styles.icon}>
                <img src={showPython ? python : javascript} alt={showPython ? 'Python icon' : 'Javascript icon'} />
              </div>
              <h3>{showPython ? 'Python' : 'JavaScript'}</h3>
              <span>
                {showPython
                  ? 'Blazing-fast code execution, now supporting Python notebooks and code execution.'
                  : 'Enjoy the flexibility of running cells individually or the entire notebook rapidly.'}
              </span>
            </div>

            <div className={styles.perk}>
              <div className={styles.icon}>
                <img src={markdown} alt='Markdown logo' />
              </div>
              <h3>Markdown</h3>
              <span>Instant, reactive Markdown editing for immediate output conversion.</span>
            </div>

            <div className={styles.perk}>
              <div className={styles.icon}>
                <img src={collab} alt='Globe icon' />
              </div>
              <h3>Collaborate</h3>
              <span>Share your notebooks and collaborate in real-time.</span>
            </div>
          </div>
        </section>

        <div className={styles.sectionSeparator} role='separator'></div>
        <section className={classNames(styles.mainStory)}>
          <div className={classNames(styles.content, styles.story)}>
            <div className={styles['promotional']}>
              <h4>Seamless Workflow Continuity</h4>
              <p>
                Write and run code within a state-preserving environment, allowing for incremental development without
                redundant declarations.
              </p>
              <p>
                A comprehensive reset or execution of all cells is achievable with just one click, streamlining your
                development process for a smoother, more efficient experience.
              </p>
            </div>
            <div className={''}>
              <video autoPlay={true} loop={true} muted={true} style={{ maxWidth: '85%' }}>
                <source src={contextVideo} type='video/mp4' />
                Video playback is not supported on your current browser.{' '}
              </video>
            </div>
          </div>
        </section>

        <div className={styles.sectionSeparator} role='separator'></div>
        <section className={classNames(styles.mainStory, styles.colReverse)}>
          <div className={classNames(styles.content, styles.story)}>
            <div className={styles.ctaWrapper}>
              <GetStartedButton title='Read our Case Study' link={'https://pennant-notebook.github.io/'} />
            </div>
            <div className={styles['promotional']}>
              <h4>Dive Deeper</h4>
              <p>
                Explore our case study and see how we implemented a collaborative computational notebook from start to
                finish.
              </p>
              <p>
                Create your own{' '}
                <a target='_blank' href='https://trypennant.com/auth' rel='noreferrer'>
                  workspace
                </a>{' '}
                and feel free to contribute to our open-source project on{' '}
                <a target='_blank' href='https://github.com/pennant-notebook/client' rel='noreferrer'>
                  GitHub
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Links</h4>
            <ul className={styles.footerList}>
              <li>
                <a href='https://github.com/pennant-notebook' target='_blank' rel='noreferrer'>
                  GitHub
                </a>
              </li>
              <li>
                <a href='https://www.linkedin.com/company/96636793/admin/feed/posts/' target='_blank' rel='noreferrer'>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Pennant</h4>
            <ul className={styles.footerList}>
              <li>
                <a href='https://pennant-notebook.github.io/'>Case Study</a>
              </li>
              <li>
                <a href='https://trypennant.com/@trypennant'>Demo</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Get started</h4>
            <ul className={styles.footerList}>
              <li>
                <a href='https://trypennant.com/auth'>Create account</a>
              </li>
              <li>
                <a href='https://trypennant.com/auth'>Login</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default NewHome;
