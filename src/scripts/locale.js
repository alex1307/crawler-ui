import i18next from "i18next";
import i18nextHttpBackend from "i18next-http-backend";
import i18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
        fallbackLng: 'en',
        load: 'languageOnly',
        backend: {
            loadPath: '/locales/{{lng}}.json' // Ensure this path is correct
        }
    }, function (err, t) {
        if (err) {
            console.error('Error initializing i18next:', err);
            return;
        }
        updateContent();
    });

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerText = i18next.t(key);
    });
}

document.getElementById('language-selector').addEventListener('change', function () {
    const selectedLanguage = this.value;
    console.log('Selected language:', selectedLanguage);
    localStorage.setItem('selectedLanguage', selectedLanguage); // Save language to localStorage
    i18next.changeLanguage(selectedLanguage, () => {
        updateContent();
    });
});

// Set language on page load
document.addEventListener('DOMContentLoaded', function () {

    const cached = localStorage.getItem('selectedLanguage') ? localStorage.getItem('selectedLanguage') : 'en'; // Get saved language from localStorage

    console.log('Saved language:', cached);
    i18next.changeLanguage(cached, () => {
        updateContent();
    });

    document.getElementById('language-selector').value = cached; // Set the selector to the saved language
});