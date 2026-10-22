import {LitElement, html, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';
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
    
  @property({type: Array})
  links: CardLink[] = [];

  // Render the UI as a function of component state
  render() {
    return html`
        <article class="card" aria-labelledby=${this.cardTitle ? 'card-title' : nothing}>
            ${this.image
            ? html`<img class="image" src=${this.image} alt=${this.imageAlt} loading="lazy" />`
            : nothing}
            <div class="body">
                ${this.subhead ? html `<p class="subhead"> ${this.subhead}</p>` : nothing}
                ${this.cardDate ? html `
                        <time datetime=${this.cardDate}>${this.fomateDate(this.cardDate)}</time>
                        ` : nothing}
                ${this.cardTitle ? html `<h2 d="card-title" class="title"> ${this.cardTitle}</h2>` : nothing}
                ${this.content ? html `<p class="content"> ${this.content}</p>` : nothing}
                ${this.links.length > 0
                ? html`<div class="links">${this.links.map((link) => this.renderLink(link))}</div>`
                : nothing}
            </div>
        </article>
    `;
  }
  // Transform La date de 'yyyy-mm-jj' à 'jj/mm/yyyy'
  private fomateDate(date : string) : string {
    const [year , month , day] = date.split('-');
    return year &&  month && day ? `${day}/${month}/${year}` : date 
  }

  private renderLink({url, label, type = 'link', variation = 'primary'}: CardLink) {
    return html`<a class="link link--${type} link--${variation}" href=${url}>${label}</a>`;
  }
}

declare global{
    interface HTMLElementTagNameMap{
        'axa-card' : AxaCard;
    }
}
