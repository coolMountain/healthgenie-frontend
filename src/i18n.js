import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome_message": "Welcome to Medical Assistant",
      "start_new_conversation": "Start New Conversation",
      "clear_history": "Clear History",
      "profile": "Profile",
      "logout": "Logout",
      "settings": "Settings",
      "language": "Language",
      "send": "Send",
      "input_placeholder": "Type your medical question..."
    }
  },
  zh: {
    translation: {
      "welcome_message": "欢迎来到健康精灵(HealthGenie)",
      "start_new_conversation": "开始新对话",
      "clear_history": "清除历史",
      "profile": "个人资料",
      "logout": "退出登录",
      "settings": "设置",
      "language": "语言",
      "send": "发送",
      "input_placeholder": "请输入您的医疗问题..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "zh", // 默认语言为中文
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
