import bridge from '@vkontakte/vk-bridge';

export const fetchUserData = async () => {
  return bridge.send('VKWebAppGetUserInfo');
};

export const fetchUserEmail = async (appId) => {
  try {
    await bridge.send('VKWebAppGetAuthToken', { app_id: appId, scope: 'email' });
    return (await bridge.send('VKWebAppGetEmail')).email;
  } catch {
    return null;
  }
};

export const fetchUserPhone = async (appId) => {
  try {
    await bridge.send('VKWebAppGetAuthToken', { app_id: appId, scope: 'phone_number' });
    return (await bridge.send('VKWebAppGetPhoneNumber')).phone_number;
  } catch {
    return null;
  }
};

