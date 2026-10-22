# DesignSystemCard

Web Component **Card** du design system AXA, écrit avec **Lit 3** et **TypeScript**.

La carte sert du contenu éditorial (image, surtitre, date, titre, texte, liens et boutons). Elle reprend l'API
de la Card du [Storybook AXA](https://storybook.designsystem.axa.com/docs/storybook/?path=/docs/react-one-ds-beta-card--docs) :
variantes `sm`, `md`, `lg` et `bg`, image à gauche, à droite ou au-dessus, thème sombre et responsive.

## Sommaire

- [Structure du projet](#structure-du-projet)
- [Démarrage](#démarrage)
- [Utilisation](#utilisation)
- [Propriétés](#propriétés)
- [Cas d'usage couverts](#cas-dusage-couverts)
- [Responsive](#responsive)
- [Accessibilité](#accessibilité)
- [Choix de conception](#choix-de-conception)
- [Origine des styles et de la police](#origine-des-styles-et-de-la-police)
- [Tests](#tests)

## Structure du projet

```
├── index.html                 playground (contrôles + une carte)
├── public/favicon.svg         icône de l'onglet
├── src/
│   ├── axa-card.ts            composant : propriétés, rendu, responsive
│   ├── axa-card.style.ts      styles du composant (tokens AXA en CSS custom properties)
│   └── index.css              styles de la page de démo uniquement
├── test/
│   ├── axa-card.test.ts       tests unitaires
│   └── tsconfig.json          types Mocha pour les tests
├── web-test-runner.config.mjs configuration des tests (esbuild + Chromium)
├── tsconfig.json              TypeScript strict, décorateurs Lit
└── package.json
```

## Démarrage

Prérequis : **Node.js 22.12+** (Web Test Runner 1.0 demande Node 22, Vite 8 demande 22.12 ; projet testé avec
Node 25 et npm 11).

```bash
npm install
npx playwright install chromium   # navigateur utilisé par les tests
```

| Commande | Rôle |
|---|---|
| `npm run dev` | lance le serveur Vite et ouvre le playground sur http://localhost:5173 |
| `npm test` | lance les tests unitaires dans Chromium (Web Test Runner) |
| `npm run test:watch` | relance les tests à chaque modification |
| `npm run build` | vérifie les types (`tsc`) puis construit le projet dans `dist/` |
| `npm run preview` | sert le résultat de `npm run build` |

### Interface de Preview

`npm run dev` ouvre une page avec **une carte et des contrôles** : `type`, `inverted`, `vertical`, `is-inverse`,
présence de l'image, `breakpoint` et largeur de la carte. Chaque contrôle modifie une propriété de la carte, que Lit
redessine aussitôt. Le curseur de largeur simule un conteneur étroit sans redimensionner la fenêtre, ce qui permet de
voir le responsive. Tous les [cas d'usage](#cas-dusage-couverts) se reproduisent avec ces contrôles.

## Utilisation

```html
<script type="module" src="/src/axa-card.ts"></script>

<axa-card
  type="md"
  inverted
  image="https://picsum.photos/500/800"
  subhead="Member online"
  card-date="2020-12-11"
  card-title="Manage your private health insurance online"
  content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  links='[
    {"url": "/sinistre", "label": "Make a claim", "type": "link"},
    {"url": "/devis", "label": "Get a quote", "type": "button", "variation": "secondary"}
  ]'
></axa-card>
```

Les propriétés se règlent aussi en JavaScript ; c'est la façon la plus simple de passer les liens :

```js
const card = document.querySelector('axa-card');
card.links = [{url: '/sinistre', label: 'Make a claim'}];
card.isInverse = true;
```

Dans un template Lit, on passe le tableau directement avec la syntaxe de propriété : `<axa-card .links=${links}>`.


## Propriétés

| Propriété | Attribut HTML | Type | Défaut | Description |
|---|---|---|---|---|
| `type` | `type` | `'sm' \| 'md' \| 'lg' \| 'bg'` | `'lg'` | variante : petite, moyenne, grande, ou image en fond |
| `inverted` | `inverted` | `boolean` | `false` | image à droite (ignoré s'il n'y a pas d'image) |
| `vertical` | `vertical` | `boolean` | `false` | image au-dessus du texte |
| `isInverse` | `is-inverse` | `boolean` | `false` | thème sombre : fond bleu AXA, textes en blanc |
| `image` | `image` | `string` | `''` | URL de l'image ; sans image, la carte est une carte texte |
| `imageAlt` | `image-alt` | `string` | `''` | texte alternatif ; vide = image décorative |
| `subhead` | `subhead` | `string` | `''` | surtitre, en rouge et en majuscules |
| `cardTitle` | `card-title` | `string` | `''` | titre principal (`<h2>`) |
| `cardDate` | `card-date` | `string` | `''` | date au format ISO `AAAA-MM-JJ`, affichée en `JJ/MM/AAAA` |
| `content` | `content` | `string` | `''` | texte du corps |
| `links` | `links` (JSON) | `CardLink[]` | `[]` | liens et boutons affichés après le contenu |
| `breakpoint` | `breakpoint` | `number` | `750` | largeur en px sous laquelle les cartes `md` et `lg` passent en vertical ; `0` désactive le responsive |

Chaque élément n'est affiché que si sa propriété est renseignée : aucune balise vide n'est créée.

### Type `CardLink`

```ts
interface CardLink {
  url: string;
  label: string;
  type?: 'link' | 'button';                      // défaut : 'link'
  variation?: 'primary' | 'secondary' | 'light'; // défaut : 'primary'
}
```

| `type` | Rendu |
|---|---|
| `link` | lien texte en majuscules, avec une flèche décorative |
| `button` | lien à l'apparence d'un bouton (forme de pilule) |

| `variation` | Rendu |
|---|---|
| `primary` | lien bleu AXA / bouton rouge plein |
| `secondary` | bouton à contour rouge |
| `light` | version blanche, pour les fonds sombres (`is-inverse`, `bg`) |

### CSS custom properties

Le Shadow DOM isole les styles de la carte. Pour la personnaliser depuis la page, on redéfinit ces variables :

| Variable | Défaut | Rôle |
|---|---|---|
| `--axa-card-font` | `'Source Sans 3', 'Source Sans Pro', Arial, sans-serif` | police |
| `--axa-card-text` | `#343c3d` | titre et contenu |
| `--axa-card-subhead` | `#e3000a` | surtitre |
| `--axa-card-date` | `#606776` | date et séparateur |
| `--axa-card-link` / `--axa-card-link-hover` | `#00008f` / `#0000f7` | liens texte |
| `--axa-card-button` / `--axa-card-button-hover` | `#e3000a` / `#cc0009` | boutons |
| `--axa-card-focus` | `#00008f` | contour du focus clavier |
| `--axa-card-inverse-bg` / `--axa-card-inverse-text` | `#00008f` / `#ffffff` | thème sombre |
| `--axa-card-overlay` | `rgba(52, 60, 61, 0.72)` | voile de la variante `bg` |
| `--axa-card-radius` | `8px` | coins arrondis |

```css
axa-card {
  --axa-card-radius: 0;
}
```

## Cas d'usage couverts

| Cas d'usage (Storybook AXA) | Propriétés |
|---|---|
| Story **Default** | `type="lg"` + un lien |
| Story **Medium Card** | `type="md" inverted` + deux boutons `secondary` |
| Story **Large Card** | `type="lg" inverted` + un lien `secondary` |
| Story **Light Card** | `type="bg"` + un bouton `light` |
| Petite carte (vignette, surtitre, titre, date) | `type="sm"` |
| Image au-dessus du texte | `vertical` |
| Thème sombre | `is-inverse` + liens `variation: "light"` |
| Carte texte seule | sans `image` |
| Carte avec boutons | `links` avec `type: "button"` |

## Responsive

La carte s'adapte à **sa propre largeur**, pas à celle de la fenêtre : une carte placée dans une colonne étroite
s'adapte aussi sur un grand écran.

- Un `ResizeObserver` (API native du navigateur) mesure la largeur de la carte.
- Si une carte `md` ou `lg` est plus étroite que `breakpoint` (750px par défaut, comme la story Default),
  elle passe en affichage vertical : image au-dessus, pleine largeur.
- Les cartes `sm` (déjà compactes) et `bg` (texte posé sur l'image) ne changent pas.
- Les images et les boutons ont `max-width: 100%` : rien ne dépasse sur un petit écran.

La mise à jour se fait à l'image suivante (`requestAnimationFrame`) : changer la mise en page pendant la mesure
déclencherait l'erreur navigateur « ResizeObserver loop completed with undelivered notifications ».
L'observateur est branché dans `connectedCallback` et débranché dans `disconnectedCallback`.

## Accessibilité

- **HTML sémantique** : la carte est un `<article>`, le titre un `<h2>`, la date un `<time datetime="AAAA-MM-JJ">`.
- **Nom accessible** : `aria-labelledby` relie l'`<article>` à son titre ; le lecteur d'écran annonce
  « article, *titre* ».
- **Image** : `alt` vide par défaut (image décorative, ignorée par les lecteurs d'écran). On renseigne `image-alt`
  seulement si l'image apporte une information que le texte ne donne pas.
- **Éléments décoratifs** : le séparateur `-` et la flèche des liens ont `aria-hidden="true"`.
- **Liens** : toujours de vrais `<a href>` (voir [Choix de conception](#choix-de-conception)).
- **Focus clavier** : contour visible avec `:focus-visible` (blanc sur fond sombre).
- **Contraste** : bouton rouge `#e3000a` (texte blanc ≈ 4,92:1, niveau AA) ; voile sombre sous le texte de la
  variante `bg`.
- **Attribut `hidden`** : `:host([hidden]) { display: none; }`, sinon `display: block` sur `:host` l'empêcherait de
  cacher la carte.
- **Playground** : chaque contrôle est dans un `<label>`.
- Un test lance l'audit automatique **axe** sur une carte complète.

## Choix de conception

- **API reprise du Storybook AXA** (`type`, `subhead`, `cardTitle`, `cardDate`, `content`, `image`, `inverted`,
  `vertical`, `isInverse`, `breakpoint`, `links`), pour que la correspondance avec la référence soit directe.
  Seule la propriété `imageAlt` (accessibilité) a été ajoutée.
- **`cardTitle` et pas `title`** : `title` est un attribut HTML natif qui affiche une info-bulle au survol.
- **Liens et boutons toujours en `<a href>`** : ils mènent vers une page, donc ce sont des liens ;
  `type: "button"` ne change que l'apparence. Un `<button>` placé dans un `<a>` serait du HTML invalide
  (contenu interactif imbriqué).
- **`links` en `type: Array`** : Lit convertit le JSON de l'attribut en tableau ; même forme que la prop AXA.
- **Types union plutôt qu'`enum`** : le `tsconfig` active `erasableSyntaxOnly`, qui interdit les `enum`.
- **Date découpée à la main** plutôt qu'avec `new Date()` : `new Date('2021-03-21')` est lu en UTC et peut afficher
  le 20/03 selon le fuseau horaire. Une valeur qui n'est pas au format ISO est affichée telle quelle.
- **`classMap`** : le TypeScript pose une classe par option (`card--md`, `card--inverted`…) et le CSS fait toute la
  mise en page.
- **Styles dans un module séparé** (`src/axa-card.style.ts`), comme le recommande la documentation Lit.
- **CSS custom properties** pour la personnalisation : c'est le moyen prévu pour traverser le Shadow DOM.
- **`@state()` pour la largeur mesurée** : état interne réactif, non exposé comme propriété publique.
- **Pas de Storybook installé** : le PDF le cite comme référence des cas d'usage ; la démo est un playground
  `index.html`.

## Origine des styles et de la police

### Méthode

Les valeurs de style ont été relevées sur la page Card du
[Storybook AXA officiel](https://storybook.designsystem.axa.com/docs/storybook/?path=/docs/react-one-ds-beta-card--docs),
avec l'inspecteur du navigateur (**F12 → onglet Calculé**), sur les stories **Default**, **Medium Card**,
**Large Card** et **Light Card**.

Seules les valeurs visibles à l'inspecteur ont été reprises : le code source du Storybook n'a pas été copié.
Les deux tableaux ci-dessous donnent l'origine de chaque valeur : relevée à l'inspecteur, ou choisie d'après la
maquette du PDF « Cards v1.2.0 » quand elle n'était pas mesurable.

### Valeurs relevées sur le Storybook (F12)

| Élément | Valeur | Story |
|---|---|---|
| Police | `"Source Sans 3"` | toutes |
| Subhead | `#e3000a`, 14px / 18px, graisse 600, majuscules, espacement des lettres 1px | toutes |
| Date | `#606776`, 14px / 18px, graisse 600, majuscules, espacement des lettres 1px | toutes |
| Titre | `#343c3d`, 24px / 30px, graisse 700 | toutes |
| Contenu | `#343c3d`, 16px / 30px, graisse 400 | toutes |
| Écart entre l'image et le texte | 24px | Default, Medium Card, Large Card |
| Écart entre le titre et les textes | 5px | Default, Medium Card, Large Card |
| Largeur maximale du texte | 400px (500px pour une grande carte avec l'image à droite) | Default, Medium Card / Large Card |
| Image `lg` | 546 × 407px | Default, Large Card |
| Image `md` | 185 × 185px | Medium Card |
| Carte `bg` | 448 × 264px, voile `rgba(52, 60, 61, 0.72)`, coins arrondis de 8px, textes en blanc | Light Card |
| Hauteur de l'image en affichage vertical | 264px | Light Card |
| Image des stories | `https://picsum.photos/500/800` (reprise dans les tests) | toutes |

### Valeurs choisies (non mesurables sur le Storybook)

| Élément | Choix | Raison |
|---|---|---|
| Liens et boutons | lien bleu AXA `#00008f` en majuscules, bouton rouge `#e3000a` en forme de pilule | sur le Storybook, les liens et boutons de la carte gardent le style par défaut du navigateur |
| Rouge des boutons | `#e3000a` plutôt que `#ff1721` | contraste du texte blanc ≈ 4,92:1 contre 3,9:1 : seul `#e3000a` atteint le niveau AA des WCAG (4,5:1) |
| Carte `sm` | image de 88 × 88px, titre de 16px | pas de story `sm` ; proportions reprises de la maquette PDF |
| Thème sombre (`is-inverse`) | fond bleu AXA `#00008f`, textes en blanc | pas de story `isInverse` |
| Marge intérieure de la carte `bg` | 24px | sur le Storybook, le texte est presque collé au bord |
| Focus clavier | contour de 2px, bleu AXA (blanc sur fond sombre) | non visible sur le Storybook ; exigé par les WCAG (critère 2.4.7) |

### Police

La carte utilise **Source Sans 3**, la police relevée sur le Storybook AXA. Elle est chargée depuis
[Google Fonts](https://fonts.google.com/specimen/Source+Sans+3) (graisses 400, 600 et 700) dans le `<head>`
de [`index.html`](index.html) :

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap"
/>
```

La police est chargée **par la page** et non par le composant. Le composant demande seulement
`font-family: var(--axa-card-font)` ; si la page ne charge pas la police, la carte s'affiche en Arial.

## Tests

```bash
npm test
```

Les tests tournent dans un **vrai navigateur** (Chromium via Playwright), comme le recommande la documentation Lit
pour les Web Components. Outils :

| Outil | Rôle |
|---|---|
| [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) | lance Chromium et exécute les fichiers `test/**/*.test.ts` |
| Mocha (framework par défaut de Web Test Runner) | `describe`, `it` |
| [@open-wc/testing](https://open-wc.org/docs/testing/testing-package/) | `fixture`, `expect` (Chai), `waitUntil`, audit axe |
| `@web/dev-server-esbuild` | compile le TypeScript à la volée, en lisant `tsconfig.json` (décorateurs) |

**17 tests**, regroupés par fonctionnalité :

| Fonctionnalité | Ce qui est vérifié |
|---|---|
| Textes | surtitre, titre et contenu affichés ; aucun élément vide quand les propriétés ne sont pas renseignées |
| Date | `2021-03-21` affichée `21/03/2021` dans une balise `<time datetime="2021-03-21">` ; une date non ISO est affichée telle quelle ; le séparateur n'apparaît qu'avec un surtitre et une date |
| Image | `alt` vide par défaut (image décorative) |
| Liens et boutons | un `<a href>` par lien, avec son libellé ; flèche seulement pour `type: "link"` ; liens lus depuis l'attribut JSON |
| Variantes | classe du type sur la carte (`card--lg` par défaut, `card--md`…) ; `inverted` ignoré sans image ; rendu mis à jour quand une propriété change |
| Responsive | une carte plus étroite que le `breakpoint` passe en vertical ; `breakpoint="0"` désactive le responsive ; les cartes `sm` et `bg` ne changent pas |
| Accessibilité | `aria-labelledby` pointe vers le titre ; audit axe sans erreur sur une carte complète |

Les tests qui vérifient qu'une carte **ne** passe **pas** en vertical attendent deux images d'affichage
(`requestAnimationFrame`) : le temps que le `ResizeObserver` mesure la carte et que la largeur soit appliquée.
Sans cette attente, ils passeraient même si le code était faux.

Le dossier `test/` a son propre `tsconfig.json` (qui étend celui de la racine) pour ajouter les types de Mocha
sans les rendre visibles dans `src/`.
