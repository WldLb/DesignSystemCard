import { css } from 'lit';

export const styles = css`
  :host {
    --axa-card-font: 'Source Sans 3', 'Source Sans Pro', Arial, sans-serif;
    --axa-card-text: #343c3d;
    --axa-card-muted: #606776;
    --axa-card-red: #e3000a;
    --axa-card-red-hover: #cc0009;
    --axa-card-blue: #00008f;
    --axa-card-blue-hover: #0000f7;
    --axa-card-white: #ffffff;
    --axa-card-overlay: rgba(52, 60, 61, 0.72);
    --axa-card-radius: 8px;

    display: block;
    font-family: var(--axa-card-font);
    color: var(--axa-card-text);
  }

  /* Sinon display: block l'emporte sur l'attribut hidden. */
  :host([hidden]) {
    display: none;
  }

  .card {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .card--inverted {
    flex-direction: row-reverse;
  }

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
    color: var(--axa-card-red);
  }

  .separator,
  .date {
    color: var(--axa-card-muted);
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

  .link:focus-visible {
    outline: 2px solid var(--axa-card-blue);
    outline-offset: 3px;
  }

  .link--link {
    color: var(--axa-card-blue);
  }

  .link--link:hover {
    color: var(--axa-card-blue-hover);
    text-decoration: underline;
  }

  .link--button {
    display: inline-block;
    padding: 12px 24px;
    border: 1px solid var(--axa-card-red);
    border-radius: 999px;
    max-width: 100%;
  }

  .link--button.link--primary {
    background: var(--axa-card-red);
    color: var(--axa-card-white);
  }

  .link--button.link--secondary {
    background: transparent;
    color: var(--axa-card-red);
  }

  .link--button.link--primary:hover,
  .link--button.link--secondary:hover {
    background: var(--axa-card-red-hover);
    border-color: var(--axa-card-red-hover);
    color: var(--axa-card-white);
  }

  .link--light {
    color: var(--axa-card-white);
    border-color: var(--axa-card-white);
  }

  .link--button.link--light:hover {
    background: var(--axa-card-white);
    color: var(--axa-card-blue);
  }

  .card--inverse {
    padding: 24px;
    border-radius: var(--axa-card-radius);
    background: var(--axa-card-blue);
    color: var(--axa-card-white);
  }

  .card--bg {
    position: relative;
    overflow: hidden;
    max-width: 448px;
    min-height: 264px;
    padding: 24px;
    border-radius: var(--axa-card-radius);
    color: var(--axa-card-white);
  }

  .card--bg .image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  /* Voile sombre entre l'image et le texte, pour le contraste. */
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

  .card--inverse .subhead,
  .card--inverse .separator,
  .card--inverse .date,
  .card--inverse .link--link,
  .card--bg .subhead,
  .card--bg .separator,
  .card--bg .date,
  .card--bg .link--link {
    color: var(--axa-card-white);
  }

  .card--inverse .link:focus-visible,
  .card--bg .link:focus-visible {
    outline-color: var(--axa-card-white);
  }
`;
