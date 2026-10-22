import {fixture, html, expect, waitUntil} from '@open-wc/testing';
import {AxaCard} from '../src/axa-card.js';
import type {CardLink} from '../src/axa-card.js';

/**
  Tests unitaires du composant axa-card
 **/

const IMAGE = 'https://picsum.photos/500/800';

/** Raccourci : renvoie l'élément trouvé dans le Shadow DOM de la carte. */
function query<T extends Element = HTMLElement>(el: AxaCard, selector: string): T | null {
  return el.shadowRoot!.querySelector<T>(selector);
}

/** Raccourci : renvoie la balise <article> de la carte. */
function article(el: AxaCard): HTMLElement {
  return query(el, 'article')!;
}

describe('axa-card', () => {
  describe('textes', () => {
    it('affiche le subhead, le titre et le contenu', async () => {
      const el = await fixture<AxaCard>(html`
        <axa-card subhead="Member online" card-title="Car Insurance" content="Texte de la carte"></axa-card>
      `);

      expect(query(el, '.subhead')!.textContent!.trim()).to.equal('Member online');
      expect(query(el, 'h2')!.textContent!.trim()).to.equal('Car Insurance');
      expect(query(el, '.content')!.textContent!.trim()).to.equal('Texte de la carte');
    });

    it('n\'affiche aucun élément vide quand les props ne sont pas renseignées', async () => {
      const el = await fixture<AxaCard>(html`<axa-card></axa-card>`);

      expect(query(el, '.meta')).to.be.null;
      expect(query(el, 'h2')).to.be.null;
      expect(query(el, '.content')).to.be.null;
      expect(query(el, 'img')).to.be.null;
      expect(query(el, '.links')).to.be.null;
    });
  });

  describe('date', () => {
    it('formate une date ISO en JJ/MM/AAAA dans une balise <time>', async () => {
      const el = await fixture<AxaCard>(html`<axa-card card-date="2021-03-21"></axa-card>`);
      const time = query(el, 'time')!;

      expect(time.textContent!.trim()).to.equal('21/03/2021');
      expect(time.getAttribute('datetime')).to.equal('2021-03-21');
    });
  });

  describe('image', () => {
    it('donne un alt vide par défaut (image décorative)', async () => {
      const el = await fixture<AxaCard>(html`<axa-card image=${IMAGE}></axa-card>`);

      expect(query(el, 'img')!.getAttribute('alt')).to.equal('');
    });
  });

  describe('liens et boutons', () => {
    const links: CardLink[] = [
      {url: '/sinistre', label: 'Make a claim', type: 'link', variation: 'primary'},
      {url: '/devis', label: 'Get a quote', type: 'button', variation: 'secondary'},
    ];

    it('affiche un <a href> par lien, avec son libellé', async () => {
      const el = await fixture<AxaCard>(html`<axa-card .links=${links}></axa-card>`);
      const anchors = el.shadowRoot!.querySelectorAll('a');

      expect(anchors.length).to.equal(2);
      expect(anchors[0].getAttribute('href')).to.equal('/sinistre');
      expect(anchors[0].textContent).to.contain('Make a claim');
      expect(anchors[1].getAttribute('href')).to.equal('/devis');
      expect(anchors[1].textContent).to.contain('Get a quote');
    });
  });

  describe('variantes de mise en page', () => {
    it('ajoute la classe du type (card--lg par défaut, card--md…)', async () => {
      const lg = await fixture<AxaCard>(html`<axa-card></axa-card>`);
      const md = await fixture<AxaCard>(html`<axa-card type="md"></axa-card>`);

      expect(article(lg).classList.contains('card--lg')).to.be.true;
      expect(article(md).classList.contains('card--md')).to.be.true;
      expect(article(md).classList.contains('card--lg')).to.be.false;
    });
  });

  describe('réactivité Lit', () => {
    it('a les valeurs par défaut du Storybook', async () => {
      const el = await fixture<AxaCard>(html`<axa-card></axa-card>`);

      expect(el.type).to.equal('lg');
      expect(el.inverted).to.be.false;
      expect(el.vertical).to.be.false;
      expect(el.isInverse).to.be.false;
      expect(el.links).to.deep.equal([]);
      expect(el.breakpoint).to.equal(750);
    });

    it('met à jour le rendu quand une prop change', async () => {
      const el = await fixture<AxaCard>(html`<axa-card card-title="Avant"></axa-card>`);

      el.cardTitle = 'Après';
      el.type = 'sm';
      await el.updateComplete;

      expect(query(el, 'h2')!.textContent!.trim()).to.equal('Après');
      expect(article(el).classList.contains('card--sm')).to.be.true;
    });
  });

  describe('responsive (breakpoint)', () => {
    it('passe en vertical quand la carte est plus étroite que le breakpoint', async () => {
      const el = await fixture<AxaCard>(html`<axa-card type="lg" style="width: 500px"></axa-card>`);

      await waitUntil(() => article(el).classList.contains('card--vertical'), 'la carte doit passer en vertical');
    });
  });

  describe('accessibilité', () => {
    it('relie la carte à son titre avec aria-labelledby', async () => {
      const el = await fixture<AxaCard>(html`<axa-card card-title="Car Insurance"></axa-card>`);
      const id = article(el).getAttribute('aria-labelledby')!;

      expect(el.shadowRoot!.getElementById(id)!.textContent!.trim()).to.equal('Car Insurance');
    });

    it('passe l\'audit d\'accessibilité axe (carte complète)', async () => {
      const el = await fixture<AxaCard>(html`
        <axa-card
          image=${IMAGE}
          image-alt="Illustration"
          subhead="Member online"
          card-date="2021-03-21"
          card-title="Car Insurance"
          content="Texte de la carte"
          .links=${[
            {url: '#', label: 'Make a claim', type: 'link'},
            {url: '#', label: 'Get a quote', type: 'button'},
          ]}
        ></axa-card>
      `);

      await expect(el).to.be.accessible();
    });
  });
});
