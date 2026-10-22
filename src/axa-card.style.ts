import {css} from 'lit';

/// Styles du composant axa-card (encapsulés dans son Shadow DOM) en resepectant les bonnes patratiques de LitElement (définition de la propriété statique `styles` dans la classe du composant).
export const styles = css`
  :host {
    display: block;
  }

  .image {
    display: block;
    width: 100%;
    height: auto;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .link--button {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: 2px solid currentColor;
    text-decoration: none;
  }

  /// Sans cette règle, display: block ci-dessus empêcherait l'attribut hidden de masquer la carte.
  :host([hidden]) {
    display: none;
  }
    
  /// Contour visible quand un lien reçoit le focus au clavier (Tab).
  .link:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;
