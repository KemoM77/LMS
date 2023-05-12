describe('Register Page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllSessionStorage()
    cy.clearAllLocalStorage()
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });  });
  afterEach(() => {
  });
  
  it('should register a new user successfully', () => {
    cy.visit('/signup');
    const email = 'test2@gmail.com';
    const password = 'test123';
    const firstname = 'test';
    const lastname = 'user';
    const date = '2000-01-01';
    cy.get('input[name="first-name"]').type(firstname);
    cy.get('input[name="last-name"]').type(lastname);
    cy.get('input[name="date-of-birth"]').type(date);
    cy.get('input[name="email-address"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirm-password"]').type(password);
    cy.get('form').submit();
    cy.url().should('include', '/dashboard');
      deleteAccountStep()
  });
});

// describe('Login Page', () => {
//   beforeEach(() => {
//     cy.visit('/signin');
//   });
//   it('should log in successfully with valid credentials', () => {
//     cy.get('input[name="email"]').type('test@gmail.com');
//     cy.get('input[name="password"]').type('test123');
//     cy.get('form').submit();
//     cy.url().should('include', '/dashboard');
//   });
// });

export function loginStep() {
  const email = 'test@gmail.com';
  const password = 'test123';

  cy.visit('/signin');
  cy.get('input[id="email-address"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('form').submit();
  cy.url().should('include', '/dashboard');
}
export function logoutStep() {
  const logoutButton = 'svg[data-testid="LogoutIcon"]';
  cy.get(logoutButton).click();
  cy.url().should('include', '/signin');
}

export function registerStep() {
  const email = 'test@gmail.com';
  const password = 'test123';
  const firstname = 'test';
  const lastname = 'user';
  const date = '2000-01-01';
  cy.get('input[name="first-name"]').type(firstname);
  cy.get('input[name="last-name"]').type(lastname);
  cy.get('input[name="date-of-birth"]').type(date);
  cy.get('input[name="email-address"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('input[name="confirm-password"]').type(password);
  cy.get('form').submit();
  cy.url().should('include', '/dashboard');
}

export function deleteAccountStep() {
  cy.visit('/profile');
  cy.get('button[id="deleteAccount"]').click();
  cy.get('button[data-testid="confirm"]').click();
  cy.url().should('include', '/signin');
}
