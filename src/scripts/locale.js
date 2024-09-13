
import i18next from "i18next";
import i18nextHttpBackend from "i18next-http-backend";
import i18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
// ... rest of your code
i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
        fallbackLng: 'en',
        load: 'languageOnly',
        backend: {
            loadPath: '/locales/{{lng}}.json' // Ensure this path is correct relative to your dist folder
        }
    }, function (err, t) {
        if (err) {
            console.error('Error initializing i18next:', err);
            return;
        }
        updateContent();
    });

function updateContent() {
    // Update text for each element that has a data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerText = i18next.t(key); // Update the element's text with the translation
    });
}

// Event listener to change language when the user selects a different language
document.getElementById('language-selector').addEventListener('change', function () {
    i18next.changeLanguage(this.value, () => {
        updateContent(); // Refresh translations when the language is changed
    });
});