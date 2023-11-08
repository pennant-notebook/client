import { Input, Modal } from 'antd';
import { useState } from 'react';
import { storeClientInLocalStorage } from '~/utils/awarenessHelpers';

import Avatar from 'react-avatar';
import { useRecoilValue } from 'recoil';
import { authState } from '~/appState';

interface UserAvatarProps {
  size?: string;
  isDrawer?: boolean;
}

const UserAvatar = ({ size = '30px', isDrawer = false }: UserAvatarProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const auth = useRecoilValue(authState);
  const [newName, setNewName] = useState(auth.userData?.name || '');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleOk = () => {
    storeClientInLocalStorage(newName, auth.userData?.color, auth.userData?.avatar_url);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='navbar-userAvatar'>
      <Avatar
        name={auth.userData && auth.userData.name ? auth.userData.name[0].toUpperCase() : ''}
        size={size}
        src={auth.userData?.avatar_url}
        color={auth.userData?.color}
        round='30px'
      />
      <Modal title='Edit Name' open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input value={auth.userData?.name} onChange={handleNameChange} />
      </Modal>
    </div>
  );
};

export default UserAvatar;
