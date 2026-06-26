// Criamos um comando customizado chamado 'login'
Cypress.Commands.add('login', (email, password) => {
  
  // O comando faz uma requisição POST para a rota de login
  cy.request({
    method: 'POST',
    url: '/login',
    body: {
      "email": email,
      "password": password
    }
  }).then((response) => {
    // Validamos se o login deu certo
    expect(response.status).to.eq(200);
    
    // A API ServeRest devolve o token dentro de response.body.authorization
    // Vamos guardar esse token em uma Variável de Ambiente do Cypress para usá-lo depois
    Cypress.env('token_acesso', response.body.authorization);
  });

});