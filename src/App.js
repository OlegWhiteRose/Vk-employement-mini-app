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
import { testData } from './utils/testData';

import UserProfileForm from './components/UserProfile/UserProfileForm';
import ContactData from './components/ContactData/ContactData';
import AboutMe from './components/AboutMe/AboutMe';
import Export from './components/Export/Export';

export const App = () => {
  // Инициализируем состояние сразу с тестовыми данными
  const [formData, setFormData] = useState(testData);

  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        setFormData(prev => ({
          ...prev,
          name: user.first_name || prev.name,
          lastName: user.last_name || prev.lastName,
          vk: `https://vk.com/id${user.id}`
        }));
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

