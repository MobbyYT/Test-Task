import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "Назва боргу": "Debt Name",
            Дата: "Date",
            Боржник: "Debtor",
            "Додати борг": "Add Debt",
            Редагувати: "Edit",
            Видалити: "Delete",
            "Ви впевнені, що хочете видалити цей борг?": "Are you sure you want to delete this debt?",
            Так: "Yes",
            Ні: "No",
        },
    },
    uk: {
        translation: {
            "Назва боргу": "Назва боргу",
            Дата: "Дата",
            Боржник: "Боржник",
            "Додати борг": "Додати борг",
            Редагувати: "Редагувати",
            Видалити: "Видалити",
            "Ви впевнені, що хочете видалити цей борг?": "Ви впевнені, що хочете видалити цей борг?",
            Так: "Так",
            Ні: "Ні",
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "uk",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
