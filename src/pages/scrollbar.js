import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css'; // Import scrollbar styles

// import styles from './styles.css'; // Import the custom styles

const SplitScrollbar = () => {
  return (
    <PerfectScrollbar className={styles.scrollbarContainer}>
      {/* Your content */}
    </PerfectScrollbar>
  );
};

export default SplitScrollbar;
