describe('Shop - Browse products (real backend)', () => {
  it('loads shop page and renders products from real API', () => {
    // This spec is intended to run only in the dedicated workflow that boots mysql+backend.
    // It should NOT be included in normal smoke CI.
    cy.visit('/shop');

    cy.get('.product-item-wrapper', { timeout: 20000 })
      .its('length')
      .should('be.greaterThan', 0);

    cy.get('h4.product-name', { timeout: 20000 }).first().should(($el) => {
      const text = $el.text().trim();
      expect(text.length).to.be.greaterThan(0);
    });
  });
});
