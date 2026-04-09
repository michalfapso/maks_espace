// Silktide Consent Manager - Slovak Configuration
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
        name: "Nevyhnutné",
        description: "<p>Tieto súbory cookies sú nevyhnutné na správne fungovanie webovej stránky a nemôžu byť vypnuté. Pomáhajú v oblastiach ako prihlasovanie a nastavenie vašich preferencií ochrany osobných údajov.</p>",
        required: true,
        onAccept: function() {
          console.log('Nevyhnutné cookies prijaté');
        }
      },
      {
        id: "analytics",
        name: "Analytika",
        description: "<p>Tieto cookies nám pomáhajú zlepšovať stránku sledovaním najobľúbenejších stránok a pohybu návštevníkov po stránke.</p>",
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
        description: "<p>Tieto cookies poskytujú ďalšie funkcie a personalizáciu na zlepšenie vašej skúsenosti. Môžu byť nastavené nami alebo našimi partnermi, ktorých služby používame.</p>",
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
        description: "<p>Používame cookies na našej stránke na zlepšenie vašej skúsenosti používateľa, poskytovanie personalizovaného obsahu a analýzu nášho prevádzky. <a href=\"https://espace-gardens.com/cookie-policy\" target=\"_blank\">Politika cookies.</a></p>",
        acceptAllButtonText: "Prijať všetko",
        acceptAllButtonAccessibleLabel: "Prijať všetky cookies",
        rejectNonEssentialButtonText: "Odmietnuť nenevyhnutné",
        rejectNonEssentialButtonAccessibleLabel: "Odmietnuť nenevyhnutné",
        preferencesButtonText: "Preferencie",
        preferencesButtonAccessibleLabel: "Prepnúť preferencie"
      },
      preferences: {
        title: "Prispôsobiť si svoje preferencie cookies",
        description: "<p>Rešpektujeme vaše právo na ochranu osobných údajov. Môžete si vybrať, aby nebol povolený niektorý typ cookies. Vaše preferencie budú platiť na celej našej webovej stránke.</p>",
        creditLinkText: "Získajte tento banner zadarmo",
        creditLinkAccessibleLabel: "Získajte tento banner zadarmo"
      }
    }
  });
}
