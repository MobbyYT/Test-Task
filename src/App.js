import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const App = () => {
    const { t, i18n } = useTranslation();
    const [isFormVisible, setFormVisible] = useState(false);
    const [editingDebt, setEditingDebt] = useState(null);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === "uk" ? "en" : "uk");
    };

    return (
        <div className={`app ${i18n.language}`}>
            <header className="header">
                <button onClick={toggleLanguage}>{i18n.language === "uk" ? "Switch to English" : "Переключити на українську"}</button>
            </header>

            <div className="debt-form">
                <input type="text" placeholder={t("Назва боргу")} />
                <input type="text" placeholder={t("Дата")} />
                <input type="text" placeholder={t("Боржник")} />
                <button>{t("Додати борг")}</button>
            </div>
        </div>
    );
};
import LanguageToggle from "./components/LanguageToggle";

function App() {
    return (
        <div>
            <h1>Привіт, світ!</h1>
            <LanguageToggle />
        </div>
    );
}

export default App;
