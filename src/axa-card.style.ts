import {css} from 'lit';

/**
 * Styles du composant axa-card (encapsulés dans son Shadow DOM).
 *
 * Origine des valeurs :
 * - « F12 » : relevée avec l'inspecteur du navigateur (onglet Calculé) sur la page Card
 *   du Storybook AXA, stories Default, Medium Card, Large Card et Light Card ;
 * - « choix » : non mesurable sur la page (les liens et boutons y gardent le style par défaut
 *   du navigateur, pas de story sm ni isInverse) → valeur choisie d'après la maquette PDF.
 *
 * Les valeurs sont exposées en CSS custom properties sur :host : une page peut les surcharger
 * sans toucher au composant, par exemple `axa-card { --axa-card-radius: 0; }`.
 */
export const styles = css`
  :host {
    /* ---------- Tokens AXA ---------- */
    --axa-card-font: 'Source Sans 3', 'Source Sans Pro', Arial, sans-serif; /* F12 */
    --axa-card-text: #343c3d; /* F12 : titre et contenu */
    --axa-card-subhead: #e3000a; /* F12 */
    --axa-card-date: #606776; /* F12 */
    --axa-card-link: #00008f; /* choix */
    --axa-card-link-hover: #0000f7; /* choix */
    --axa-card-button: #e3000a; /* choix : même rouge que le subhead */
    --axa-card-button-hover: #cc0009; /* choix */
    --axa-card-focus: #00008f; /* choix */
    --axa-card-inverse-bg: #00008f; /* choix */
    --axa-card-inverse-text: #ffffff; /* F12 : textes de la Light Card */
    --axa-card-overlay: rgba(52, 60, 61, 0.72); /* F12 : voile de la Light Card */
    --axa-card-radius: 8px; /* F12 : coins du voile de la Light Card */

    display: block;
    font-family: var(--axa-card-font);
    color: var(--axa-card-text);
  }

  /* Sans cette règle, display: block ci-dessus empêcherait l'attribut hidden de masquer la carte. */
  :host([hidden]) {
    display: none;
  }

  /* ---------- Mise en page ---------- */

  .card {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  /* inverted : image à droite. */
  .card--inverted {
    flex-direction: row-reverse;
  }

  /* vertical : image au-dessus du texte. */
  .card--vertical {
    flex-direction: column;
    align-items: stretch;
  }

  .body {
    flex: 1;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  /* 500px pour la grande carte avec image à droite (F12 : Large Card). */
  .card--lg.card--inverted .body {
    max-width: 500px;
  }

  .card--vertical .body {
    max-width: none;
  }

  /* ---------- Image : une taille par type ---------- */

  .image {
    display: block;
    flex: none;
    object-fit: cover;
    border-radius: var(--axa-card-radius);
    max-width: 100%;
  }

  /* choix : pas de story sm sur le Storybook. */
  .card--sm .image {
    width: 88px;
    height: 88px;
  }

  /* F12 : Medium Card. */
  .card--md .image {
    width: 185px;
    height: 185px;
  }


  .card--lg .image {
    width: 546px;
    max-width: 50%;
    height: 407px;
  }

  .card--vertical .image {
    width: 100%;
    max-width: none;
    height: 264px;
  }

  /* ---------- Textes ---------- */
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    font-size: 14px;
    line-height: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .subhead {
    color: var(--axa-card-subhead);
  }

  .separator,
  .date {
    color: var(--axa-card-date);
  }

  .title {
    margin: 0;
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
  }

  /* choix : pas de story sm, titre plus petit comme sur la maquette PDF. */
  .card--sm .title {
    font-size: 16px;
    line-height: 20px;
  }

  .content {
    margin: 0;
    font-size: 16px;
    line-height: 30px;
  }

  /* ---------- Liens et boutons (choix : non mesurables sur la page Storybook) ---------- */

  .links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-top: 8px;
  }

  .link {
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;
  }

  /* Contour visible quand un lien reçoit le focus au clavier (Tab). */
  .link:focus-visible {
    outline: 2px solid var(--axa-card-focus);
    outline-offset: 3px;
  }

  /* Lien texte, avec flèche. */
  .link--link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--axa-card-link);
  }

  .link--link:hover {
    color: var(--axa-card-link-hover);
    text-decoration: underline;
  }

  /* Lien qui a l'apparence d'un bouton (reste un <a>) : forme de pilule. */
  .link--button {
    display: inline-block;
    padding: 12px 24px;
    border: 1px solid var(--axa-card-button);
    border-radius: 999px;
    max-width: 100%; 
  }

  /* primary : rouge plein. */
  .link--button.link--primary {
    background: var(--axa-card-button);
    color: #ffffff;
  }

  /* secondary : contour rouge, fond transparent. */
  .link--button.link--secondary {
    background: transparent;
    color: var(--axa-card-button);
  }

  .link--button.link--primary:hover,
  .link--button.link--secondary:hover {
    background: var(--axa-card-button-hover);
    border-color: var(--axa-card-button-hover);
    color: #ffffff;
  }

  /* light : version blanche, pour les fonds sombres. */
  .link--light {
    color: var(--axa-card-inverse-text);
    border-color: var(--axa-card-inverse-text);
  }

  .link--button.link--light:hover {
    background: var(--axa-card-inverse-text);
    color: var(--axa-card-link);
  }

  /* ---------- isInverse : thème sombre (choix : pas de story isInverse) ---------- */

  .card--inverse {
    padding: 24px;
    border-radius: var(--axa-card-radius);
    background: var(--axa-card-inverse-bg);
    color: var(--axa-card-inverse-text);
  }

  /* ---------- type bg : image en fond, texte par-dessus ---------- */

  .card--bg {
    position: relative;
    overflow: hidden;
    max-width: 448px;
    min-height: 264px;
    padding: 24px;
    border-radius: var(--axa-card-radius);
    color: var(--axa-card-inverse-text);
  }

  .card--bg .image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  /* Voile sombre entre l'image et le texte, pour garder un bon contraste. */
  .card--bg::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: var(--axa-card-overlay);
  }

  .card--bg .body {
    position: relative;
    z-index: 2;
  }

  /* Sur fond sombre (inverse ou bg), les textes colorés et les liens texte passent en blanc. */
  .card--inverse .subhead,
  .card--inverse .separator,
  .card--inverse .date,
  .card--inverse .link--link,
  .card--bg .subhead,
  .card--bg .separator,
  .card--bg .date,
  .card--bg .link--link {
    color: var(--axa-card-inverse-text);
  }

  .card--inverse .link:focus-visible,
  .card--bg .link:focus-visible {
    outline-color: var(--axa-card-inverse-text);
  }
`;
