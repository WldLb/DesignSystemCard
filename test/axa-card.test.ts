import { fixture, html, expect, waitUntil, nextFrame } from '@open-wc/testing';
import { AxaCard } from '../src/axa-card.js';
import type { CardLink } from '../src/axa-card.js';

const IMAGE = 'https://picsum.photos/500/800';

function query(el: AxaCard, selector: string) {
  return el.shadowRoot!.querySelector(selector);
}

function article(el: AxaCard) {
  return query(el, 'article')!;
}

// Un booléen plutôt que l'élément : message d'erreur plus court si le test échoue.
function has(el: AxaCard, selector: string) {
  return query(el, selector) !== null;
}

// Attend que le ResizeObserver ait mesuré la carte (sinon le test passe à vide).
async function waitForMeasure(el: AxaCard) {
  await nextFrame();
  await nextFrame();
  await nextFrame();
  await el.updateComplete;
}

describe('axa-card', () => {
  describe('textes', () => {
    it('affiche le subhead, le titre et le contenu', async () => {
      const el = await fixture<AxaCard>(html`
        <axa-card
          subhead="Member online"
          card-title="Car Insurance"
          content="Texte de la carte"
        ></axa-card>
      `);

      expect(query(el, '.subhead')!.textContent!.trim()).to.equal(
        'Member online',
      );
      expect(query(el, 'h2')!.textContent!.trim()).to.equal('Car Insurance');
      expect(query(el, '.content')!.textContent!.trim()).to.equal(
        'Texte de la carte',
      );
    });

    it("n'affiche aucun élément vide quand les props ne sont pas renseignées", async () => {
      const el = await fixture<AxaCard>(html`<axa-card></axa-card>`);

      expect(has(el, '.meta')).to.be.false;
      expect(has(el, 'h2')).to.be.false;
      expect(has(el, '.content')).to.be.false;
      expect(has(el, 'img')).to.be.false;
      expect(has(el, '.links')).to.be.false;
    });

    it('formate une date ISO en JJ/MM/AAAA dans une balise <time>', async () => {
      const el = await fixture<AxaCard>(
        html`<axa-card card-date="2021-03-21"></axa-card>`,
      );
      const time = query(el, 'time')!;

      expect(time.textContent!.trim()).to.equal('21/03/2021');
      expect(time.getAttribute('datetime')).to.equal('2021-03-21');
    });

    it("affiche telle quelle une date qui n'est pas au format ISO", async () => {
      const el = await fixture<AxaCard>(
        html`<axa-card card-date="11/12/2020"></axa-card>`,
      );

      expect(query(el, 'time')!.textContent!.trim()).to.equal('11/12/2020');
    });

    it('affiche le séparateur seulement quand il y a un subhead et une date', async () => {
      const both = await fixture<AxaCard>(
        html`<axa-card subhead="Sub" card-date="2021-03-21"></axa-card>`,
      );
      const subheadOnly = await fixture<AxaCard>(
        html`<axa-card subhead="Sub"></axa-card>`,
      );
      const dateOnly = await fixture<AxaCard>(
        html`<axa-card card-date="2021-03-21"></axa-card>`,
      );

      expect(has(both, '.separator')).to.be.true;
      expect(has(subheadOnly, '.separator')).to.be.false;
      expect(has(dateOnly, '.separator')).to.be.false;
    });
  });

  describe('liens et boutons', () => {
    const links: CardLink[] = [
      {
        url: '/sinistre',
        label: 'Make a claim',
        type: 'link',
        variation: 'primary',
      },
      {
        url: '/devis',
        label: 'Get a quote',
        type: 'button',
        variation: 'secondary',
      },
    ];

    it('affiche un <a href> par lien, avec son libellé', async () => {
      const el = await fixture<AxaCard>(
        html`<axa-card .links=${links}></axa-card>`,
      );
      const anchors = el.shadowRoot!.querySelectorAll('a');

      expect(anchors.length).to.equal(2);
      expect(anchors[0].getAttribute('href')).to.equal('/sinistre');
      expect(anchors[0].textContent).to.contain('Make a claim');
      expect(anchors[1].getAttribute('href')).to.equal('/devis');
      expect(anchors[1].textContent).to.contain('Get a quote');
    });

    it("lit les liens écrits en JSON dans l'attribut HTML", async () => {
      const el = await fixture<AxaCard>(html`
        <axa-card
          links='[{"url": "/sinistre", "label": "Make a claim"}]'
        ></axa-card>
      `);

      expect(el.links).to.deep.equal([
        { url: '/sinistre', label: 'Make a claim' },
      ]);
      expect(query(el, 'a')!.getAttribute('href')).to.equal('/sinistre');
    });
  });

  describe('mise en page', () => {
    it('ajoute la classe du type (card--lg par défaut, card--md…)', async () => {
      const lg = await fixture<AxaCard>(html`<axa-card></axa-card>`);
      const md = await fixture<AxaCard>(html`<axa-card type="md"></axa-card>`);

      expect(article(lg).classList.contains('card--lg')).to.be.true;
      expect(article(md).classList.contains('card--md')).to.be.true;
      expect(article(md).classList.contains('card--lg')).to.be.false;
    });

    it("ignore inverted quand il n'y a pas d'image", async () => {
      const withImage = await fixture<AxaCard>(
        html`<axa-card inverted image=${IMAGE}></axa-card>`,
      );
      const withoutImage = await fixture<AxaCard>(
        html`<axa-card inverted></axa-card>`,
      );

      expect(article(withImage).classList.contains('card--inverted')).to.be
        .true;
      expect(article(withoutImage).classList.contains('card--inverted')).to.be
        .false;
    });
  });

  describe('responsive (breakpoint)', () => {
    it('passe en vertical quand la carte est plus étroite que le breakpoint', async () => {
      const el = await fixture<AxaCard>(
        html`<axa-card type="lg" style="width: 500px"></axa-card>`,
      );

      await waitUntil(
        () => article(el).classList.contains('card--vertical'),
        'la carte doit passer en vertical',
      );
    });

    it('ne passe pas en vertical avec breakpoint="0"', async () => {
      const el = await fixture<AxaCard>(
        html`<axa-card
          type="lg"
          breakpoint="0"
          style="width: 500px"
        ></axa-card>`,
      );
      await waitForMeasure(el);

      expect(article(el).classList.contains('card--vertical')).to.be.false;
    });

    it('ne change pas les cartes sm et bg, même étroites', async () => {
      const sm = await fixture<AxaCard>(
        html`<axa-card type="sm" style="width: 300px"></axa-card>`,
      );
      const bg = await fixture<AxaCard>(
        html`<axa-card type="bg" style="width: 300px"></axa-card>`,
      );
      await waitForMeasure(sm);
      await waitForMeasure(bg);

      expect(article(sm).classList.contains('card--vertical')).to.be.false;
      expect(article(bg).classList.contains('card--vertical')).to.be.false;
    });
  });

  describe('accessibilité', () => {
    it('relie la carte à son titre avec aria-labelledby', async () => {
      const el = await fixture<AxaCard>(
        html`<axa-card card-title="Car Insurance"></axa-card>`,
      );
      const id = article(el).getAttribute('aria-labelledby')!;

      expect(el.shadowRoot!.getElementById(id)!.textContent!.trim()).to.equal(
        'Car Insurance',
      );
    });

    it('donne un alt vide par défaut (image décorative)', async () => {
      const el = await fixture<AxaCard>(
        html`<axa-card image=${IMAGE}></axa-card>`,
      );

      expect(query(el, 'img')!.getAttribute('alt')).to.equal('');
    });

    it("passe l'audit d'accessibilité axe (carte complète)", async () => {
      const el = await fixture<AxaCard>(html`
        <axa-card
          image=${IMAGE}
          image-alt="Illustration"
          subhead="Member online"
          card-date="2021-03-21"
          card-title="Car Insurance"
          content="Texte de la carte"
          .links=${[
            { url: '#', label: 'Make a claim', type: 'link' },
            { url: '#', label: 'Get a quote', type: 'button' },
          ]}
        ></axa-card>
      `);

      await expect(el).to.be.accessible();
    });
  });
});
