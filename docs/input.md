- Ide o web s prezentáciou nových produktov, ktoré by firma HPM chcela predávať pod značkou "É-space" a osloviť potenciálnych zákazníkov a investorov svojou kvalitou, ekologickými materiálmi a nízkou cenou v porovnaní s konkurenciou.
- Base layout stránky bude jednoduchý:
  - top toolbar obsahuje logo firmy (link: /), Produkty (link: /), Pre Investorov (link: /pre-investorov/)
  - na desktop: classické linky v toolbare
  - na mobile: hamburger menu
  - footer obsahuje kontaktné info "HPM company Slovakia – [email / telefón / web]"
- Stránka bude vo viacerých jazykových verziách pre rôzne cieľové krajiny a trhy:
  - Jazykové verzie: /en/, /sk/, /cs/
  - Hlavná stránka / zobrazí prehľadný zoznam krajín (ikona vlajky + názov jazyka), ktorý užívateľa presmeruje na podstránku s daným jazykom
  - Všetky podstránky (/produkty, /pre-investorov) budú dostupné vo všetkých jazykoch
- Tech stack:
  - Astro.js, vlastný layout s Tailwind CSS pre jednoduchosť a kontrolu. Optimalizované veľkosti obrázkov by sa mali automaticky generovať v build procese pre rôzne veľkosti displejov a vkladať sa do srcset. Adresárová štruktúra by mala byť čo najjednoduchšia 
  - lightbox knižnica na zobrazovanie obrázkov a galérii (napr. GLightbox alebo PhotoSwipe)
  - Komponentu pre interaktívne body na obrázku: body sa zobrazujú na percentuálnych súradniciach (responsive), hover efekt, popup s popisom/cenou a linkom
  - Google Analytics 4 (GA4) - sledovanie návštevníkov, zdroj ruchu, konverzií
  - Silktide consent manager (https://silktide.com/consent-manager) - GDPR compliance, cookie banner
  - Stránka bude zbuildovaná ako statická a deploynutá na GitHub Pages. Pri každom novom git pushi bude automaticky prebuildovaná a deploynutá (GitHub Actions).
  - Open Graph tagy pre sociálne siete (preview pri zdieľaní)
- Stránka musí byť responzívna (pre desktopy, tablety aj mobily).
- SEO optimalizácia:
  - sitemap.xml pre všetky jazykové verzie
  - robots.txt
  - Meta tagy (description, keywords), Open Graph tagy pre sociálne siete
  - Štruktúrovaný obsah (schema.org markup ak je potrebný)
- Štýl stránky by mal byť jednoduchý a čistý podobný ako tu: https://www.ikea.com/jo/en/ikea-business/gallery/an-inspiring-garden-studio-for-your-small-business-pubc56a2400/
  - Budeme potrebovať aj komponentu, ktorá zobrazí obrázok a na ňom na percentami zadaných súradniciach budú zobrazené hover body, ktoré keď nad ne prejdem kurzorom, sa vysvietia, a keď na ne kliknem, obrázok sa do toho bodu trochu prizoomuje a zobrazí sa vedľa bodu (ale stále v rámci obrázku) malý popup, v ktorom môže byť:
    - názov a cena (napr. "Stôl TROTTEN, 150€"), a keď na ne kliknem, otvorí sa v novom okne ikea stránka s daným produktom
    - alebo bližší popis bez linku, napr. "konopno-slamenné panely", ale popis môže byť aj dlhší.
- Obrázky:
  - ./src/assets/img/logo.jpg - logo firmy
  - ./src/assets/img/hero.jpg - hero obrázok
  - Obrázky s interaktívnymi bodami (3-10 bodov per obrázok): budú dorobiť neskôr
    - Testovanie komponenty: použijeme ./src/assets/img/1_podorys.jpg ako mock obrázok
    - Body budú mať percentuálne súradnice (x%, y%) pre responsive správanie
    - Popup s popisom/cenou a linkom sa zobrazí vedľa bodu (ale v rámci obrázku)
- Kontakt: Hybrid pristup
  - Kontaktný formulár s poliami:
    - Email (povinný)
    - Meno (povinný)
    - Ktorý produkt vás zaujíma? (dropdown: HPM Office Solo / Studio Duo / Nature Meeting Cube, povinný)
    - Poznámka (nepovinná)
  - Odoslanie: na emailovú adresu (Formspree.io alebo Email.js na frontend)
  - Nižšie v sekcii: odkaz "Alebo napíš mi na WhatsApp" s priamym linkom na WhatsApp Business číslo (https://wa.me/+421XXXXXXXXX?text=...)
- Budú tam nasledujúce podstránky:

(link: /)
# Produktové portfólio HPM É-SPACE

(Ku každému podnadpisu bude fotografia, prípadne viac obrázkov - galéria, pri rozkliknutí by sa mala zobraziť ako lightbox na celú stránku a prechádzať doprava-doľava v rámci tejto jednej subgalérie. Stránka bude začínať hero obrázkom na celú šírku a pod ním budú podsekcie vľavo obrázok vpravo nadpis s textom, ďalšia bude opačne vpravo obrázok vľavo nadpis s textom a takto sa budú striedať.)

## “Hpm Office Solo” (6–10 m², 8-12 tis. €)
![](./src/assets/img/1_podorys.jpg)
- 1 pracovné miesto, panoramatické okno, základná ventilácia, elektrika, možnosť inštalácie nástennej klimatizácie/mini-splitu.
- Cieľová skupina: freelancer, malá firma, súkromný majiteľ domu.

## “Hpm Studio Duo” (12–16 m², ~16–24 tis. €)
![](./src/assets/img/2_podorys.jpg)
- 1–2 pracovné miesta + zóna pre pohovku/jogu/kreativitu, vylepšené akustické riešenie, opcia kompaktného sanitárneho uzla (WC + umývadlo).
- Cieľová skupina: pár pracujúci z domu, kreatívne profesie, konzultačné podnikanie (prijímanie klientov).

## “Nature Meeting Cube” (20–24 m², ~24–40 tis. €)
![](./src/assets/img/3_podorys.jpg)
- Väčšie presklenie, dizajnový akcent, možnosť využitia ako malá zasadacia miestnosť pre menšie firmy, psychológov, koučov, prípadne ako wellness priestor.
- Cieľová skupina: prémioví klienti, malé kancelárie, mikro-coworking v súkromnej záhrade / v areáli hotela či spa.

## Interiérové tipy (IKEA setup):
- Pracovná zóna: Výškovo nastaviteľný stôl IDÅSEN (hnedý/čierny) ideálne ladí s tmavým dreveným fasádnym obkladom.
- Oddychová zóna: Malá pohovka VRETSTORP alebo pár kresiel STRANDMON pri panoramatickom okne.
- Úložný priestor: Systém IVAR (prírodné drevo), ktorý možno namoriť na tmavo podľa fasády, alebo kovové regály BROR pre industriálny vzhľad.
- Osvetlenie: Závesné lampy série RANARP v čiernej farbe.

## Použité materiály
...konopné panely, slama, ešte bude upresnené...


(link: /pre-investorov/)
# PITCH-DECK pre investorov a developerov
vízia  Garden OFFICE by HPM Prefabrikované záhradné kancelárie z konope a slamy pre Česko a Slovensko. „Vôňa sena a ticho prírody – vaša každodenná kancelária.“

## 2. Problém
  - Segment „garden offices“ v EÚ prudko rastie, no väčšina riešení využíva štandardné materiály (MDF, minerálna vlna, PVC) bez skutočného eco a wellbeing efektu.
  - Majitelia domov a developeri hľadajú: tiché, teplé a rýchlo zmontovateľné kancelárie bez zložitého stavebného povolenia, s nízkou uhlíkovou stopou a silným dizajnom.
  - Na trhu ČR a SR prakticky neexistujú sériové prefab-kancelárie z bio-materiálov (konope/slama), ktoré sa dajú škálovať ako produkt, nie ako individuálny projekt.
## 3. Riešenie: HPM É-KIRI OFFICE
  - Čo ponúkame: Séria prefabrikovaných záhradných kancelárií zložených z modulárnych prvkov (stena, podlaha, strecha).
    - Element: Šírka 50 cm, výška 2500–3000 mm, hrúbka steny 120 mm.
    - Výplň: Konope a slama ako hlavné tepelnoizolačné a akustické materiály.
    - Fasáda: Opaľované drevo (Shou Sugi Ban efekt) – prirodzený vzhľad, ochrana, prémiová estetika.
    - Dodanie: V demontovanom stave na paletách, rýchla montáž na mieste lokálnym tímom.
  - Unikátnosť:
    - Silný senzorický zážitok (vôňa sena, dotyk dreva).
    - Moderná architektúra a hotové inžinierske riešenia (elektro, ventilácia, kúrenie).
    - Cenový segment 20–40 tis. € – stredná a prémiová trieda „na kľúč“.
## 4. Produktová línia
  - Hay Office Solo (8–10 m²) – kancelária pre jednu osobu, minimálny záber pozemku.
  - Hay Studio Duo (12–16 m²) – 1–2 pracovné miesta + zóna pre relax/kreativitu.
  - Nature Meeting Cube (16–20 m²) – dizajnový kubus pre stretnutia, koučov, mikro-coworking.
  - Všetky modely sú celoročne využiteľné.
## 5. Trh a načasovanie
  - Globálny trh „garden rooms“ v roku 2025 dosiahne cca 2,7–2,9 mld. USD, Európa tvorí ~48 % objemu.
  - Segment „home office“ dominuje vďaka trendu hybridnej práce.
  - V strednej Európe rastie záujem o biostavby, no chýba sériový prefab-produkt v tomto formáte.
## 6. Biznis model
  - B2C: Priamy predaj majiteľom domov.
  - B2B: Developeri, hotely, rezorty a glamping operátori (HAY OFFICE ako „wellbeing kapsula“).
  - Zdroje príjmov: Výroba prefab-elementov, kompletizácia (okná/technológie), interiérový dizajn.
## 7. Prečo my (HPM)
  - Skúsenosti s ekologickými materiálmi (slama, drevo) a prefabrikáciou.
  - Lokálne zastúpenie na Slovensku a znalosť trhu strednej Európy.
  - Existujúca sieť partnerov pre rýchle nasadenie montážnych tímov.
## 8. Čo hľadáme (Ask)
  - Investície/partnerstvo na spustenie prototypovej linky (R&D, formy, nástroje).
  - Certifikáciu systému pre CZ/SK trh.
  - Vytvorenie showroom jednotiek v kľúčových lokalitách (v blízkosti metropol, v rámci developerských projektov).
  - Formy spolupráce: Co-development s developermi alebo exkluzívna distribúcia.

Kontakt: HPM company Slovakia – [email / telefón / web]

