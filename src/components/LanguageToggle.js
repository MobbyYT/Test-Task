import React from "react";
import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div>
            <select onChange={(e) => changeLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="ua">Українська</option>
            </select>
        </div>
    );
};

export default LanguageToggle;
