import { 
  Header,
  FormItem, 
  FormLayoutGroup, 
  Textarea,
  Div
} from '@vkontakte/vkui';

const PersonalData = ({ 
  name, 
  lastName, 
  onNameChange, 
  onLastNameChange, 
  isMobile 
}) => {
  const textareaStyle = {
    fontSize: isMobile ? '14px' : '16px',
    padding: '8px 12px',
    width: '100%',
    boxSizing: 'border-box',
    lineHeight: '1.5',
    resize: 'none',
    height: '36px'
  };

  return (
    <Div style={{ padding: 0 }}>
      <Header style={{
        marginBottom: isMobile ? '12px' : '16px',
        fontSize: isMobile ? '16px' : '20px',
        paddingLeft: 0
      }}>
        Персональные данные
      </Header>
      <FormLayoutGroup mode="vertical">
        <FormItem 
          top="Имя"
          style={{ marginBottom: '12px' }}
        >
          <Textarea 
            maxLength={20} 
            rows={1} 
            id="name" 
            value={name}
            onChange={onNameChange}
            placeholder="Ваше Имя"
            style={textareaStyle}
          />
        </FormItem>
        <FormItem 
          top="Фамилия"
          style={{ marginBottom: 0 }}
        >
          <Textarea
            maxLength={20}  
            rows={1} 
            id="lastName" 
            value={lastName}
            onChange={onLastNameChange}
            placeholder="Ваша Фамилия"
            style={textareaStyle}
          />
        </FormItem>
      </FormLayoutGroup>
    </Div>
  );
};

export default PersonalData; 

