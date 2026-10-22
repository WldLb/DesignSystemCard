import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styles} from './axa-card.style.js';

// Types union plutôt qu'enum : erasableSyntaxOnly (tsconfig) interdit les enum.
export type CardLinkType = 'link' | 'button';
export type CardLinkVariation = 'primary' | 'secondary' | 'light';

export interface CardLink {
  url: string;
  label: string;
  type?: CardLinkType;
  variation?: CardLinkVariation;
}

export type CardType = 'sm' | 'md' | 'lg' | 'bg';

@customElement('axa-card')
export class AxaCard extends LitElement {
  static styles = styles;

  @property()
  subhead = '';

  // Pas « title » : c'est un attribut HTML natif (info-bulle au survol).
  @property({attribute: 'card-title'})
  cardTitle = '';

  @property({attribute: 'card-date'})
  cardDate = '';

  @property()
  content = '';

  @property()
  image = '';

  // Vide par défaut : l'image est décorative et ignorée par les lecteurs d'écran.
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

  // État interne : la largeur mesurée n'est pas une API publique.
  @state()
  private width = 0;

  // On mesure la carte elle-même, pas la fenêtre : elle s'adapte à son conteneur.
  // requestAnimationFrame : changer la mise en page pendant la mesure déclencherait
  // l'erreur « ResizeObserver loop completed with undelivered notifications ».
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

  // width > 0 : tant que la carte n'est pas mesurée, on garde la mise en page demandée.
  private get isNarrow() {
    const canStack = this.type === 'md' || this.type === 'lg';
    return canStack && this.width > 0 && this.width < this.breakpoint;
  }

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
          ${this.cardTitle ? html`<h2 id="card-title" class="title">${this.cardTitle}</h2>` : nothing}
          ${this.content ? html`<p class="content">${this.content}</p>` : nothing}
          ${this.links.length > 0
            ? html`<div class="links">${this.links.map((link) => this.renderLink(link))}</div>`
            : nothing}
        </div>
      </article>
    `;
  }

  // 'AAAA-MM-JJ' à 'JJ/MM/AAAA', découpé à la main .  Une date non ISO est affichée telle quelle.
  private formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return year && month && day ? `${day}/${month}/${year}` : date;
  }

  // Toujours un <a> : la carte mène vers une page, type 'button' ne change que l'apparence.
  private renderLink({url, label, type = 'link', variation = 'primary'}: CardLink) {
    const arrow = type === 'link' ? html`<span class="arrow" aria-hidden="true">→</span>` : nothing;
    return html`<a class="link link--${type} link--${variation}" href=${url}>${label}${arrow}</a>`;
  }

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

declare global {
  interface HTMLElementTagNameMap {
    'axa-card': AxaCard;
  }
}
