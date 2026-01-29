const ingredientIds = {
  bun: '643d69a5c3f7b9001cfa093d',
  mainOne: '643d69a5c3f7b9001cfa093e',
  mainTwo: '643d69a5c3f7b9001cfa0941',
  sauce: '643d69a5c3f7b9001cfa0942'
};

const ingredientNames = {
  bun: 'Флюоресцентная булка R2-D3',
  mainOne: 'Филе Люминесцентного тетраодонтимформа',
  mainTwo: 'Биокотлета из марсианской Магнолии',
  sauce: 'Соус Spicy-X'
};

describe('Constructor page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('adds bun and fillings to constructor', () => {
    cy.addIngredient(ingredientIds.bun);
    cy.addIngredient(ingredientIds.mainOne);
    cy.addIngredient(ingredientIds.sauce);

    cy.get('[data-testid="constructor-list"]')
      .find('li')
      .should('have.length', 2);
    cy.get('[data-testid="burger-constructor"]').should(
      'contain.text',
      ingredientNames.bun
    );
  });

  it('opens ingredient modal and closes via cross', () => {
    cy.openIngredientModal(ingredientIds.bun, ingredientNames.bun);
    cy.closeModal('cross');
  });

  it('closes ingredient modal via overlay', () => {
    cy.openIngredientModal(ingredientIds.mainOne, ingredientNames.mainOne);
    cy.closeModal('overlay');
  });

  it('closes ingredient modal via Esc', () => {
    cy.openIngredientModal(ingredientIds.sauce, ingredientNames.sauce);
    cy.closeModal('esc');
  });

  it('creates order and resets constructor', () => {
    cy.fixture('login.json').then((loginData) => {
      cy.setCookie('accessToken', loginData.accessToken);
      cy.setCookie('refreshToken', loginData.refreshToken);
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', loginData.accessToken);
        win.localStorage.setItem('refreshToken', loginData.refreshToken);
      });
    });

    cy.fixture('user.json').then((userData) => {
      cy.intercept('GET', '**/api/auth/user', {
        statusCode: 200,
        body: userData
      }).as('getUser');
    });

    cy.fixture('order.json').then((orderData) => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 200,
        body: orderData
      }).as('postOrder');
    });

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.addIngredient(ingredientIds.bun);
    cy.addIngredient(ingredientIds.mainOne);
    cy.addIngredient(ingredientIds.mainTwo);

    cy.get('[data-testid="order-button"]').find('button').click();

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.fixture('order.json').then((orderData) => {
      cy.get('[data-testid="order-number"]').should(
        'contain.text',
        orderData.order.number
      );
    });

    cy.closeModal('cross');

    cy.get('[data-testid="constructor-list"]')
      .find('li')
      .should('have.length', 0);
  });
});
