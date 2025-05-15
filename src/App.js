import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { 
  AdaptivityProvider,
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  Group,
  Div
} from '@vkontakte/vkui';

import UserProfileForm from './components/UserProfile/UserProfileForm';
import ContactData from './components/ContactData/ContactData';
import AboutMe from './components/AboutMe/AboutMe';
import Export from './components/Export/Export';

export const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    vk: '',
    education: '',
    skills: '',
    experience: '',
    preferences: ''
  });

  useEffect(() => {
    async function loadUserData() {
      try {
        // Получаем основную информацию о пользователе
        const user = await bridge.send('VKWebAppGetUserInfo');
        
        // Обновляем имя, фамилию и ссылку на VK
        setFormData(prev => ({
          ...prev,
          name: user.first_name || '',
          lastName: user.last_name || '',
          vk: `vk.com/id${user.id}`
        }));

        try {
          // Пытаемся получить email
          const emailData = await bridge.send('VKWebAppGetEmail');
          if (emailData.email) {
            setFormData(prev => ({
              ...prev,
              email: emailData.email
            }));
          }
        } catch (error) {
          console.log('Пользователь не предоставил доступ к email');
        }

        try {
          // Пытаемся получить номер телефона
          const phoneData = await bridge.send('VKWebAppGetPhoneNumber');
          if (phoneData.phone_number) {
            // Форматируем номер телефона в нужный формат
            const formattedPhone = phoneData.phone_number.replace(/^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, '+$1 ($2) $3-$4-$5');
            setFormData(prev => ({
              ...prev,
              phone: formattedPhone
            }));
          }
        } catch (error) {
          console.log('Пользователь не предоставил доступ к номеру телефона');
        }

      } catch (error) {
        console.error('Ошибка загрузки данных VK:', error);
      }
    }
    loadUserData();
  }, []);

  const handleDataChange = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  return (
    <AdaptivityProvider>
      <AppRoot>
        <SplitLayout>
          <SplitCol>
            <View activePanel="main">
              <Panel id="main">
                <Group>
                  <UserProfileForm 
                    onDataChange={(data) => handleDataChange(data)}
                    initialData={formData}
                  />
                  <ContactData 
                    onDataChange={(data) => handleDataChange(data)}
                    initialData={formData}
                  />
                  <AboutMe 
                    onDataChange={(data) => handleDataChange(data)}
                    initialData={formData}
                  />
                  <Div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                    <Export 
                      formData={formData} 
                    />
                  </Div>
                  <Div></Div>
                </Group>
              </Panel>
            </View>
          </SplitCol>
        </SplitLayout>
      </AppRoot>
    </AdaptivityProvider>
  );
};

