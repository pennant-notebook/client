import { useState } from 'react';
import { Modal, Input } from 'antd';
import { useRecoilValue } from 'recoil';
import { authState } from '~/appState';

interface EditNameModalProps {
  isVisible: boolean;
  currentName: string;
  onUpdate: (newName: string) => void;
  onClose: () => void;
  theme: string;
}

const EditNameModal = ({ isVisible, onUpdate, onClose, theme }: EditNameModalProps) => {
  const auth = useRecoilValue(authState);
  const [newName, setNewName] = useState<string>(auth.userData?.name || '');
  const handleOk = () => {
    if (newName && newName !== auth.userData?.name) {
      onUpdate(newName);
    }
    onClose();
  };

  return (
    <Modal
      className={`editNameModal ${theme}`}
      title='Edit Name'
      open={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      okButtonProps={{ disabled: newName.trim().length === 0 }}>
      <Input
        placeholder='Enter new name'
        value={newName}
        onChange={e => setNewName(e.target.value)}
        onPressEnter={handleOk}
      />
    </Modal>
  );
};

export default EditNameModal;
