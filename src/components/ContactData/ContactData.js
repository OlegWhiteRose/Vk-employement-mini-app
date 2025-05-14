import { useState, useEffect } from 'react';
import { 
  Header,
  Div,
  FormLayoutGroup,
  Textarea,
  FormItem
} from '@vkontakte/vkui';

const ContactData = ({ onDataChange, initialData }) => {
  const [phone, setPhone] = useState(initialData.phone || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [vk, setVk] = useState(initialData.vk || '');
  const [isMobile, setIsMobile] = useState(false);

  console.log(initialData);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 6px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (field, value) => {
    const newData = { [field]: value };
    onDataChange(newData);
    
    switch(field) {
      case 'phone': setPhone(value); break;
      case 'email': setEmail(value); break;
      case 'vk': setVk(value); break;
    }
  };

  return (
    <Div style={{ maxWidth: '1000px' }}>
      <Header>Контактные данные</Header>
      <FormLayoutGroup 
        mode="vertical" 
        style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'auto auto auto',
          gap: isMobile ? '16px' : '12px'
        }}
      >
        <FormItem top="Телефон">
          <Textarea 
            maxLength={12}
            rows={1}
            id="phoneNumber"
            value={phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+7 (999) 123-45-67"
            style={isMobile ? { fontSize: '14px' } : {}}
          />
        </FormItem>
        <FormItem top="Почта">
          <Textarea 
            maxLength={25}
            rows={1}
            id="email"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@mail.ru"
            style={isMobile ? { fontSize: '14px' } : {}}
          />
        </FormItem>
        <FormItem top="VK">
          <Textarea
            maxLength={25} 
            rows={1}
            id="vk"
            value={vk}
            onChange={(e) => handleChange('vk', e.target.value)}
            placeholder="vk.com/username"
            style={isMobile ? { fontSize: '14px' } : {}}
          />
        </FormItem>
      </FormLayoutGroup>
    </Div>
  );
};

export default ContactData;

