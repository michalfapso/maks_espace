// Silktide Consent Manager - Czech Configuration
// https://silktide.com/consent-manager/

// Ensure library and styles are loaded
if (typeof silktideCookieBannerManager === 'undefined') {
  // Load CSS if not already loaded
  if (!document.getElementById('silktide-consent-manager-css')) {
    const link = document.createElement('link');
    link.id = 'silktide-consent-manager-css';
    link.rel = 'stylesheet';
    link.href = '/consent/silktide-consent-manager.css';
    document.head.appendChild(link);
  }

  // Load JavaScript library if not already loaded
  if (!document.getElementById('silktide-consent-manager-js')) {
    const script = document.createElement('script');
    script.id = 'silktide-consent-manager-js';
    script.src = '/consent/silktide-consent-manager.js';
    script.onload = function() {
      initializeSilktideConsent();
    };
    document.head.appendChild(script);
  }
} else {
  // Library already loaded, initialize immediately
  initializeSilktideConsent();
}

function initializeSilktideConsent() {
  if (typeof silktideCookieBannerManager === 'undefined') {
    console.warn('Silktide Consent Manager library not loaded');
    return;
  }

  silktideCookieBannerManager.updateCookieBannerConfig({
    background: {
      showBackground: true
    },
    cookieIcon: {
      position: "bottomLeft"
    },
    cookieTypes: [
      {
        id: "necessary",
        name: "Nezbytné",
        description: "<p>Tyto soubory cookies jsou nezbytné pro správné fungování webu a nelze je vypnout. Pomáhají s přihlášením a nastavením vašich předvoleb ochrany osobních údajů.</p>",
        required: true,
        onAccept: function() {
          console.log('Nezbytné cookies přijaty');
        }
      },
      {
        id: "analytics",
        name: "Analytika",
        description: "<p>Tyto cookies nám pomáhají zlepšovat web sledováním nejpopulárnějších stránek a pohybu návštěvníků po webu.</p>",
        defaultValue: true,
        onAccept: function() {
          if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
              analytics_storage: 'granted',
            });
          }
          if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
              'event': 'consent_accepted_analytics',
            });
          }
        },
        onReject: function() {
          if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
              analytics_storage: 'denied',
            });
          }
        }
      },
      {
        id: "advertising",
        name: "Reklama",
        description: "<p>Tyto cookies poskytují další funkce a personalizaci ke zlepšení vašeho zážitku. Mohou být nastaveny námi nebo našimi partnery, jejichž služby používáme.</p>",
        onAccept: function() {
          if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
            });
          }
          if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
              'event': 'consent_accepted_advertising',
            });
          }
        },
        onReject: function() {
          if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            });
          }
        }
      }
    ],
    text: {
      banner: {
        description: "<p>Na našem webu používáme soubory cookies ke zlepšení vašeho zážitku uživatele, poskytování personalizovaného obsahu a analýze našeho provozu. <a href=\"https://espace-gardens.com/cookie-policy\" target=\"_blank\">Zásady cookies.</a></p>",
        acceptAllButtonText: "Přijmout vše",
        acceptAllButtonAccessibleLabel: "Přijmout všechny cookies",
        rejectNonEssentialButtonText: "Odmítnout nezbytné",
        rejectNonEssentialButtonAccessibleLabel: "Odmítnout nezbytné",
        preferencesButtonText: "Předvolby",
        preferencesButtonAccessibleLabel: "Přepnout předvolby"
      },
      preferences: {
        title: "Přizpůsobte si své předvolby cookies",
        description: "<p>Respektujeme vaše právo na soukromí. Můžete se rozhodnout, aby nebyl povolen některý typ cookies. Vaše předvolby cookies se budou vztahovat na celém našem webu.</p>",
        creditLinkText: "Získejte tento banner zdarma",
        creditLinkAccessibleLabel: "Získejte tento banner zdarma"
      }
    }
  });
}
