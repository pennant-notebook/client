import { Avatar, Modal, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getClientFromLocalStorage, storeClientInLocalStorage } from '~/utils/awarenessHelpers';
import { useState } from 'react';

interface UserAvatarProps {
  name: string;
  src?: string;
  color?: string;
  size?: number | 'large' | 'small' | 'default';
}

const UserAvatar = ({ name, src, color, size = 'default' }: UserAvatarProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState(getClientFromLocalStorage().name);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleOk = () => {
    storeClientInLocalStorage(newName);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const avatarContent = src ? (
    <Avatar size={size} src={src} />
  ) : (
    <Avatar size={size} style={{ backgroundColor: color }} icon={<UserOutlined />}>
      {newName[0]?.toUpperCase()}
    </Avatar>
  );

  return (
    <>
      {avatarContent}
      <Modal title='Edit Name' open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input value={name} onChange={handleNameChange} />
      </Modal>
    </>
  );
};

export default UserAvatar;
