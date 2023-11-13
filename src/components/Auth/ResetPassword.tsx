import { Form, Input, Spin, Typography } from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';
import PennantLogo from '~/assets/logo/pennant-logo.png';

const API_URL = process.env.NODE_ENV === 'production' ? '/auth' : 'http://localhost:3001/auth';
const { Text } = Typography;

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!newPassword || !newConfirmPassword) {
      toast.error('Please fill out all required fields', { autoClose: 1500, pauseOnFocusLoss: false });
      return;
    } else if (newPassword !== newConfirmPassword) {
      toast.error('Passwords do not match.', { autoClose: 1500, pauseOnFocusLoss: false });
      return;
    } else if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.', { autoClose: 1500, pauseOnFocusLoss: false });
      return;
    }
    setIsResetting(true);
    try {
      await axios.post(`${API_URL}/reset-password/${resetToken}`, { newPassword });
      setIsResetting(false);

      toast.success('Password successfully reset.', { autoClose: 1500, pauseOnFocusLoss: false });
      navigate('/auth');
    } catch (error) {
      console.error('Error resetting password:', error);
      setIsResetting(false);

      toast.error('Error resetting password.', { autoClose: 1500, pauseOnFocusLoss: false });
    }
  };

  return (
    <div className={styles.AuthWrapper} style={{ paddingTop: '5%' }}>
      <div className={styles.AuthHeader}>
        <div className={styles.AuthHeaderLogo}>
          <img src={PennantLogo} alt='Pennant Logo' className={`${styles.logo}`} />
        </div>
      </div>
      <div className={styles.AuthForm}>
        <Form form={form} layout='vertical' className={styles.AuthForm}>
          <Form.Item className={styles.formItem}>
            <p className={styles.formlabel}>New Password</p>
            <Input.Password value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </Form.Item>
          <Form.Item className={styles.formItem}>
            <p className={styles.formlabel}>Confirm New Password</p>
            <Input.Password value={newConfirmPassword} onChange={e => setNewConfirmPassword(e.target.value)} />
          </Form.Item>
          <div className={styles.AuthFooter}>
            {isResetting ? (
              <div className={classNames(styles.switchDiv, styles.footerItem)}>
                <Spin />
              </div>
            ) : (
              <>
                <button onClick={handleResetPassword} className={styles.authButton}>
                  Reset Password
                </button>
                <div className={classNames(styles.switchDiv, styles.footerItem)} onClick={() => navigate('/auth')}>
                  <div className={classNames(styles.switchButton)}>
                    <Text>Back to Login</Text>
                  </div>
                </div>
              </>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
