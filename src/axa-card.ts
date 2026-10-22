import {LitElement, css, html, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('axa-card')
export class AxaCard extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      display: block;
    }

    //Sans cette règle, display: block ci-dessus empêcherait l'attribut hidden de masquer la carte.
    :host([hidden]) {
      display : none,
    }

    .image {
      display: block;
      width: 100%;
      height: auto;
    }
  `;

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
            </div>
        </article>
    `;
  }
  // Transform La date de 'yyyy-mm-jj' à 'jj/mm/yyyy'
  private fomateDate(date : string) : string {
    const [year , month , day] = date.split('-');
    return year &&  month && day ? `${day}/${month}/${year}` : date 
  }
}

declare global{
    interface HTMLElementTagNameMap{
        'axa-card' : AxaCard;
    }
}
