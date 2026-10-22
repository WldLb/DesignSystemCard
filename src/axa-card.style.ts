import {css} from 'lit';

/** Styles du composant axa-card (encapsulés dans son Shadow DOM). */
export const styles = css`
  :host {
    display: block;
  }

  /* Sans cette règle, display: block ci-dessus empêcherait l'attribut hidden de masquer la carte. */
  :host([hidden]) {
    display: none;
  }

  /* ---------- Mise en page ---------- */

  /* Par défaut : image à gauche, texte à droite. */
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  /* ---------- Image : une taille par type ---------- */

  .image {
    display: block;
    flex: none;
    object-fit: cover;
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
    width: 50%;
    height: auto;
    aspect-ratio: 4 / 3;
  }

  .card--vertical .image {
    width: 100%;
    height: 264px;
  }

  /* ---------- type bg : image en fond, texte par-dessus ---------- */

  .card--bg {
    position: relative;
    min-height: 400px;
    padding: 48px;
    color: #ffffff;
  }

  .card--bg .image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  /* Voile sombre entre l'image et le texte, pour garder le texte lisible. */
  .card--bg::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
  }

  .card--bg .body {
    position: relative;
    z-index: 2;
  }

  /* ---------- isInverse : thème sombre ---------- */

  .card--inverse {
    padding: 24px;
    background: #00008f;
    color: #ffffff;
  }

  /* Sur fond sombre, les liens prennent la couleur du texte (blanc). */
  .card--inverse a,
  .card--bg a {
    color: inherit;
  }

  /* ---------- Liens et boutons ---------- */

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  /* Un lien de type "button" a l'apparence d'un bouton, mais reste un <a>. */
  .link--button {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: 2px solid currentColor;
    text-decoration: none;
  }

  /* Contour visible quand un lien reçoit le focus au clavier (Tab). */
  .link:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;
