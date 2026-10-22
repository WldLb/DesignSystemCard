import {LitElement, html, nothing} from 'lit';
import {customElement, property , state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styles} from './axa-card.style.js';

export type CardLinkType = 'link' | 'button';
export type CardLinkVariation = 'primary' | 'secondary' | 'light';

// Lien de la carte (même forme que la prop `links` du Storybook AXA).
export interface CardLink {
  url: string;
  label: string;
  type?: CardLinkType;
  variation?: CardLinkVariation;
}

// Variante de la carte : petite, moyenne, grande, ou image en fond.
export type CardType = 'sm' | 'md' | 'lg' | 'bg';


@customElement('axa-card')
export class AxaCard extends LitElement {

  static styles = styles;

  // Declation des properties
    @property({type: String})
    subhead = '';

    @property({attribute: 'card-title'})
    cardTitle = '';

    @property({attribute : 'card-date'})
    cardDate = '';

    @property({type: String})
    content = '';

    @property()
    image = '';

  // Texte alternatif de l'image. Vide par défaut :
    @property({attribute: 'image-alt'})
    imageAlt = '';

    @property()
    type: CardType = 'lg';

    @property({type: Boolean})
    inverted = false;

    @property({type: Boolean})
    vertical = false;

    @property({type: Boolean, attribute: 'is-inverse'})
    isInverse = false;

    @property({type: Array})
    links: CardLink[] = [];

    @property({type: Number})
    breakpoint = 750;

    @state()
    private width = 0;


    private resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      requestAnimationFrame(() => {
        this.width = width;
      });
    });

    connectedCallback() {
      super.connectedCallback();
      this.resizeObserver.observe(this);
    }

    disconnectedCallback() {
      this.resizeObserver.disconnect();
      super.disconnectedCallback();
    }

    private get isNarrow() {
      const canStack = this.type === 'md' || this.type === 'lg';
      return canStack && this.width > 0 && this.width < this.breakpoint;
}

  // Render the UI as a function of component state
  render() {

    const classes = {
    card: true,
    [`card--${this.type}`]: true,
    'card--inverted': this.inverted && Boolean(this.image),
    'card--vertical': this.vertical || this.isNarrow,
    'card--inverse': this.isInverse,
    };

    return html`
        <article class=${classMap(classes)} aria-labelledby=${this.cardTitle ? 'card-title' : nothing}>
            ${this.image
            ? html`<img class="image" src=${this.image} alt=${this.imageAlt} loading="lazy" />`
            : nothing}
            <div class="body">
                ${this.renderMeta()}
                ${this.cardTitle ? html `<h2 id="card-title" class="title"> ${this.cardTitle}</h2>` : nothing}
                ${this.content ? html `<p class="content"> ${this.content}</p>` : nothing}
                ${this.links.length > 0
                ? html`<div class="links">${this.links.map((link) => this.renderLink(link))}</div>`
                : nothing}
            </div>
        </article>
    `;
  }
  // Transform La date de 'yyyy-mm-jj' à 'jj/mm/yyyy'
  private formatDate(date : string) : string {
    const [year , month , day] = date.split('-');
    return year &&  month && day ? `${day}/${month}/${year}` : date 
  }

  private renderLink({url, label, type = 'link', variation = 'primary'}: CardLink) {
return html`
    <a class="link link--${type} link--${variation}" 
      href=${url}>${label}${type === 'link' ? 
      html`<span class="arrow" aria-hidden="true">→</span>` 
      : nothing}
    </a>`;
  }

  // affiche la ligne subhead  et cardDate si au moins un des deux props est renseigné.
  private renderMeta() {
  if (!this.subhead && !this.cardDate) {
    return nothing;
  }
  return html`
    <p class="meta">
      ${this.subhead ? html`<span class="subhead">${this.subhead}</span>` : nothing}
      ${this.subhead && this.cardDate
        ? html`<span class="separator" aria-hidden="true">-</span>`
        : nothing}
      ${this.cardDate
        ? html`<time class="date" datetime=${this.cardDate}>${this.formatDate(this.cardDate)}</time>`
        : nothing}
    </p>
  `;
}

}

declare global{
    interface HTMLElementTagNameMap{
        'axa-card' : AxaCard;
    }
}
