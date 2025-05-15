import { useState, useEffect } from 'react';
import { 
  SplitLayout,
  FormItem,
  Textarea,
  Header,
  Div
} from '@vkontakte/vkui';
import Avatar from './Avatar';
import UserProfileSplit from './UserProfileSplit';

const ProfileForm = ({ onDataChange, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (initialData?.name !== undefined) {
      setName(initialData.name);
    }
    if (initialData?.lastName !== undefined) {
      setLastName(initialData.lastName);
    }
  }, [initialData?.name, initialData?.lastName]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 600px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    onDataChange({
      name: name,     
      lastName: lastName,  
      avatar: file       
    });
  };
  
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    onDataChange({
      name: newName,     
      lastName: lastName, 
      avatar: avatarFile   
    });
  };
  
  const handleLastNameChange = (e) => {
    const newLastName = e.target.value;
    setLastName(newLastName);
    onDataChange({ 
      name: name,        
      lastName: newLastName, 
      avatar: avatarFile    
    });
  };

  return (
    <Div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: isMobile ? '12px' : '20px'
    }}>
      <SplitLayout style={{
        flexDirection: 'column',
        gap: '24px'
      }}>
        <UserProfileSplit 
          style={{
            width: '200px',
            minWidth: '200px',
            paddingLeft: '16px'
          }}
        >
          <Avatar onFileChange={handleAvatarChange} />
        </UserProfileSplit>

        <div style={{ padding: '0' }}>
          <Header style={{
            marginBottom: isMobile ? '12px' : '16px',
            fontSize: isMobile ? '16px' : '20px'
          }}>
            Персональные данные
          </Header>
          <FormItem htmlFor="name" top="Имя">
            <Textarea 
              maxLength={20} 
              rows={1} 
              id="name" 
              value={name}
              onChange={handleNameChange}
              placeholder="Ваше Имя"
              style={isMobile ? { fontSize: '14px' } : {}}
            />
          </FormItem>
          <FormItem htmlFor="lastName" top="Фамилия">
            <Textarea
              maxLength={20}  
              rows={1} 
              id="lastName" 
              value={lastName}
              onChange={handleLastNameChange}
              placeholder="Ваша Фамилия"
              style={isMobile ? { fontSize: '14px' } : {}}
            />
          </FormItem>
        </div>
      </SplitLayout>
    </Div>
  );
};

export default ProfileForm;

