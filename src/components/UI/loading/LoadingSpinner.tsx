import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  asOverlay?: boolean;
}

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return (
    <div className={`${props.asOverlay && styles.loadingSpinnerOverlay}`}>
      <div className={styles.ldsDualRing}></div>
    </div>
  );
};

export default LoadingSpinner;
