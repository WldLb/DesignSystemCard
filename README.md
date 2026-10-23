# DesignSystemCard

Web Component Card du design system AXA, écrit avec Lit 3 et TypeScript. La carte affiche du contenu éditorial
(image, surtitre, date, titre, texte, liens et boutons) et reprend l'API de la Card du Storybook AXA : variantes
`sm`, `md`, `lg` et `bg`, image à gauche, à droite ou au-dessus, thème sombre et responsive.


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

Prérequis : Node.js 22.12 ou plus.

```bash
npm install
npx playwright install chromium   # navigateur des tests
npm run dev                       # démo sur http://localhost:5173
npm test                          # tests dans Chromium
npm run build                     # tsc puis vite build
npm run format                    # Formater le code avec Prettier
```

La démo (`index.html`) affiche une carte et un contrôle par option ; le curseur de largeur montre le responsive.

## Utilisation

```html
<script type="module" src="/src/axa-card.ts"></script>

<axa-card
  type="md"
  image="https://picsum.photos/500/800"
  subhead="Member online"
  card-date="2020-12-11"
  card-title="Manage your private health insurance online"
  links='[
    {"url": "/sinistre", "label": "Make a claim", "type": "link"},
    {"url": "/devis", "label": "Get a quote", "type": "button", "variation": "secondary"}
  ]'
></axa-card>
```

## Propriétés

| Propriété    | Attribut       | Type                           | Défaut  | Description                                                            |
| ------------ | -------------- | ------------------------------ | ------- | ---------------------------------------------------------------------- |
| `type`       | `type`         | `'sm' \| 'md' \| 'lg' \| 'bg'` | `'lg'`  | petite, moyenne, grande, ou image en fond                              |
| `inverted`   | `inverted`     | `boolean`                      | `false` | image à droite (ignoré sans image)                                     |
| `vertical`   | `vertical`     | `boolean`                      | `false` | image au-dessus du texte                                               |
| `isInverse`  | `is-inverse`   | `boolean`                      | `false` | thème sombre : fond bleu AXA, textes en blanc                          |
| `image`      | `image`        | `string`                       | `''`    | URL de l'image ; sans image, carte texte                               |
| `imageAlt`   | `image-alt`    | `string`                       | `''`    | texte alternatif ; vide = image décorative                             |
| `subhead`    | `subhead`      | `string`                       | `''`    | surtitre, rouge et majuscules                                          |
| `cardTitle`  | `card-title`   | `string`                       | `''`    | titre (`<h2>`)                                                         |
| `cardDate`   | `card-date`    | `string`                       | `''`    | date `AAAA-MM-JJ`, affichée `JJ/MM/AAAA`                               |
| `content`    | `content`      | `string`                       | `''`    | texte du corps                                                         |
| `links`      | `links` (JSON) | `CardLink[]`                   | `[]`    | liens et boutons après le contenu (en JS : `card.links = [...]`)       |
| `breakpoint` | `breakpoint`   | `number`                       | `750`   | largeur sous laquelle `md` et `lg` passent en vertical ; `0` désactive |

Les éléments optionnels ne sont rendus que s'ils sont renseignés. Un `CardLink` a la forme
`{ url, label, type?, variation? }` : `type` vaut `link` (par défaut) ou `button` (pilule) ; `variation` vaut `primary`
(par défaut), `secondary` (boutons seulement : contour rouge) ou `light` (blanc, pour les fonds sombres).

Cas du Storybook : Default (`type="lg"` + un lien), Medium Card (`type="md" inverted` + deux boutons `secondary`),
Large Card (`type="lg" inverted` + un lien), Light Card (`type="bg"` + un bouton `light`). La maquette ajoute la petite
carte (`type="sm"`), l'image au-dessus (`vertical`), le thème sombre (`is-inverse` + liens `light`) et la carte texte.

## Responsive

La carte s'adapte à sa propre largeur, pas à celle de la fenêtre : dans une colonne étroite, elle passe en vertical
même sur un grand écran. Un `ResizeObserver` mesure la carte ; si une carte `md` ou `lg` est plus étroite que
`breakpoint`, l'image passe au-dessus du texte, en pleine largeur. Les cartes `sm` et `bg` ne changent pas. La largeur
est appliquée à l'image suivante (`requestAnimationFrame`), sinon le navigateur signale une boucle du `ResizeObserver`.

## Accessibilité

La carte est un `<article>` relié à son `<h2>` par `aria-labelledby`. La date est un `<time datetime="AAAA-MM-JJ">`.
L'image a un `alt` vide par défaut (décorative) ; `image-alt` sert quand elle apporte une information. Le séparateur
`-` a `aria-hidden="true"`. Liens et boutons sont de vrais `<a href>`, avec un contour visible au focus clavier (blanc
sur fond sombre). Un voile sombre garde le texte lisible sur la variante `bg`. Un test lance l'audit axe sur une carte.

## Choix de conception

L'API reprend celle du Storybook AXA, pour que la correspondance soit directe ; seule `imageAlt` a été ajoutée.
La propriété s'appelle `cardTitle` et non `title`, attribut HTML natif qui affiche une info-bulle.
Les boutons restent des `<a href>` : ils mènent vers une page, `type: "button"` ne change que l'apparence.
La date est découpée à la main : `new Date()` lit une date ISO en UTC et peut afficher la veille. Une valeur qui
n'est pas au format `AAAA-MM-JJ` est affichée telle quelle.
Le TypeScript pose une classe par option (`card--md`, `card--inverted`…) avec `classMap`, le CSS fait la mise en
page ; les styles sont dans un fichier à part pour garder le composant lisible.
Les couleurs, la police et le rayon sont des variables CSS sur `:host` (`--axa-card-red`, `--axa-card-blue`,
`--axa-card-radius`…) ; elles traversent le Shadow DOM, la page peut les redéfinir : `axa-card { --axa-card-radius: 0; }`.

## Origine des styles

Les valeurs ci-dessous ont été relevées à l'inspecteur du navigateur sur les stories Default, Medium Card, Large Card
et Light Card du Storybook AXA ; son code source n'a pas été copié. La carte `sm` (image 88px, titre 16px), le thème
sombre, le style des liens et des boutons, la marge de la carte `bg` et le focus sont des choix personnels, faute de
story. Pour les boutons, le rouge `#e3000a` a été préféré à `#ff1721` : le texte blanc y reste lisible (niveau AA,
vérifié avec un outil de contraste). La police Source Sans 3 est chargée par la page (`index.html`, Google Fonts),
pas par le composant ; sans elle, la carte s'affiche en Arial.

| Élément                        | Valeur relevée                                                      | Story                  |
| ------------------------------ | ------------------------------------------------------------------- | ---------------------- |
| Police                         | `"Source Sans 3"`                                                   | toutes                 |
| Subhead / date                 | `#e3000a` / `#606776`, 14px / 18px, graisse 600, majuscules, 1px    | toutes                 |
| Titre                          | `#343c3d`, 24px / 30px, graisse 700                                 | toutes                 |
| Contenu                        | `#343c3d`, 16px / 30px, graisse 400                                 | toutes                 |
| Écarts image / texte, titre    | 24px, 5px                                                           | Default, Medium, Large |
| Largeur maximale du texte      | 400px (500px pour une grande carte avec l'image à droite)           | Default, Medium, Large |
| Image `lg` / `md`              | 546 × 407px / 185 × 185px                                           | Default, Large, Medium |
| Carte `bg`                     | 448 × 264px, voile `rgba(52, 60, 61, 0.72)`, coins 8px, texte blanc | Light                  |
| Hauteur de l'image en vertical | 264px                                                               | Light                  |

## Limites connues

Un bouton `secondary` (contour rouge sur fond bleu) est peu contrasté sur `is-inverse` : préférer `light`.
Le titre est toujours un `<h2>`, le niveau n'est pas configurable.
Un JSON invalide dans l'attribut `links` est ignoré par Lit, sans message d'erreur.

## Tests

Quinze tests tournent dans Chromium avec Web Test Runner, Mocha et `@open-wc/testing` (`fixture`, Chai, axe) :
textes et date, liens, classes de mise en page, responsive, accessibilité. Les tests qui vérifient qu'une carte ne
passe pas en vertical attendent d'abord que le `ResizeObserver` l'ait mesurée ; sinon ils passeraient même avec un code faux.
