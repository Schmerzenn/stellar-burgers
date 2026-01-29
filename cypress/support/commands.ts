export {};

declare global {
  namespace Cypress {
    interface Chainable {
      addIngredient(ingredientId: string): Chainable<void>;
      openIngredientModal(
        ingredientId: string,
        ingredientName: string
      ): Chainable<void>;
      closeModal(method?: 'cross' | 'overlay' | 'esc'): Chainable<void>;
    }
  }
}

Cypress.Commands.add('addIngredient', (ingredientId) => {
  cy.get(`[data-testid="ingredient-${ingredientId}"]`)
    .find('button')
    .click();
});

Cypress.Commands.add('openIngredientModal', (ingredientId, ingredientName) => {
  cy.get(`[data-testid="ingredient-${ingredientId}"]`).find('a').click();
  cy.get('[data-testid="modal"]').should('be.visible');
  cy.get('[data-testid="ingredient-name"]')
    .contains(ingredientName)
    .should('be.visible');
});

Cypress.Commands.add('closeModal', (method = 'cross') => {
  switch (method) {
    case 'cross':
      cy.get('[data-testid="close-modal"]').click();
      break;
    case 'overlay':
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      break;
    case 'esc':
      cy.get('body').type('{esc}');
      break;
  }

  cy.get('[data-testid="modal"]').should('not.exist');
});
