import { useState } from 'react';
import { Modal, Input } from 'antd';

interface EditNameModalProps {
  isVisible: boolean;
  currentName: string | undefined;
  onUpdate: (newName: string) => void;
  onClose: () => void;
  theme: string;
}

const EditNameModal = ({ isVisible, currentName, onUpdate, onClose, theme }: EditNameModalProps) => {
  const [newName, setNewName] = useState<string>(currentName || '');

  const handleOk = () => {
    if (newName && newName !== currentName) {
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
      okButtonProps={{ disabled: newName.trim().length === 0 || newName === currentName }}>
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
