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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 600px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    let formatted = numbers.startsWith('7') || numbers.startsWith('8') 
      ? '+7' + numbers.slice(1)
      : '+7' + numbers;
    
    formatted = formatted.slice(0, 12);
    
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + ' (' + formatted.slice(2);
    }
    if (formatted.length > 7) {
      formatted = formatted.slice(0, 7) + ') ' + formatted.slice(7);
    }
    if (formatted.length > 12) {
      formatted = formatted.slice(0, 12) + '-' + formatted.slice(12);
    }
    if (formatted.length > 15) {
      formatted = formatted.slice(0, 15) + '-' + formatted.slice(15);
    }
    
    return formatted;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    onDataChange({ phone: formatted });
  };

  const handleChange = (field, value) => {
    const newData = { [field]: value };
    onDataChange(newData);
    
    switch(field) {
      case 'email': setEmail(value); break;
      case 'vk': setVk(value); break;
      default: break;
    }
  };

  return (
    <Div style={{ 
      maxWidth: '1000px',
      margin: '0 auto',
      padding: isMobile ? '12px' : '20px'
    }}>
      <Header style={{ 
        marginBottom: isMobile ? '16px' : '24px',
        fontSize: isMobile ? '20px' : '24px'
      }}>
        Контактные данные
      </Header>
      <FormLayoutGroup 
        mode="vertical" 
        style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
          gap: '16px',
          width: '100%'
        }}
      >
        <FormItem top="Телефон">
          <Textarea 
            maxLength={18}
            rows={1}
            id="phoneNumber"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="+7 (999) 123-45-67"
            style={{
              fontSize: isMobile ? '14px' : '16px',
              padding: '8px 12px',
              width: '100%',
              boxSizing: 'border-box'
            }}
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
            style={{
              fontSize: isMobile ? '14px' : '16px',
              padding: '8px 12px',
              width: '100%',
              boxSizing: 'border-box'
            }}
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
            style={{
              fontSize: isMobile ? '14px' : '16px',
              padding: '8px 12px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </FormItem>
      </FormLayoutGroup>
    </Div>
  );
};

export default ContactData;

