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
    // Only update the translatable parts without affecting the structured HTML of your logo
    const subtitleElement = document.querySelector('.translatable');
    if (subtitleElement) {
        subtitleElement.innerText = i18next.t('homepage.subtitle');
    }

    // Update other elements that need translation
    const leadElement = document.querySelector('.lead');
    if (leadElement) {
        leadElement.innerText = i18next.t('homepage.details');
    }

    const learnMoreButton = document.querySelector('.btn-primary');
    if (learnMoreButton) {
        learnMoreButton.innerText = i18next.t('homepage.learnMore');
    }
}

document.getElementById('language-selector').addEventListener('change', function () {
    i18next.changeLanguage(this.value, () => {
        updateContent();
    });
});