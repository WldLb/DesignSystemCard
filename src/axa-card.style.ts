import {css} from 'lit';

export const styles = css`
  :host {
    /* ---------- Tokens AXA ---------- */
    --axa-card-font: 'Source Sans 3', 'Source Sans Pro', Arial, sans-serif; 
    --axa-card-text: #343c3d; 
    --axa-card-subhead: #e3000a; 
    --axa-card-date: #606776; 
    --axa-card-link: #00008f; 
    --axa-card-link-hover: #0000f7;
    --axa-card-button: #e3000a; 
    --axa-card-button-hover: #cc0009; 
    --axa-card-focus: #00008f; 
    --axa-card-inverse-bg: #00008f;
    --axa-card-inverse-text: #ffffff;
    --axa-card-overlay: rgba(52, 60, 61, 0.72);
    --axa-card-radius: 8px;

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

  .card--sm .image {
    width: 88px;
    height: 88px;
  }

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

  .card--sm .title {
    font-size: 16px;
    line-height: 20px;
  }

  .content {
    margin: 0;
    font-size: 16px;
    line-height: 30px;
  }

  /* ---------- Liens et boutons ---------- */

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

  /* ---------- isInverse : thème sombre ---------- */

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
