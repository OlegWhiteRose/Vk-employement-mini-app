import { useState, useEffect } from 'react';
import { 
  Textarea, 
  FormItem, 
  FormLayoutGroup, 
  SplitLayout 
} from '@vkontakte/vkui';
import Avatar from './Avatar';
import UserProfileSplit from './UserProfileSplit';

const ProfileForm = ({ onDataChange }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 500px)').matches);
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
    <SplitLayout style={isMobile ? { flexDirection: 'column' } : {}}>
      <UserProfileSplit 
        style={isMobile ? { 
          width: '100%', 
          marginBottom: '16px' 
        } : {}}
      >
        <Avatar onFileChange={handleAvatarChange} />
      </UserProfileSplit>

      <UserProfileSplit>
        <FormLayoutGroup 
          mode="vertical" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: isMobile ? 'auto' : '200px',
            padding: isMobile ? '0 16px' : '0'
          }}
        >
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
        </FormLayoutGroup>
      </UserProfileSplit>
    </SplitLayout>
  );
};

export default ProfileForm;