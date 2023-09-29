import styles from './LoadingSpinner.module.css';

const LoadingSpinner = (props: any) => {
  return (
    <div className={`${props.asOverlay && styles.loadingSpinnerOverlay}`}>
      <div className={styles.ldsDualRing}></div>
    </div>
  );
};

export default LoadingSpinner;
