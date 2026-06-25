describe('API ServeRest - Testes na rota de Login', () => {

  // Cenário Positivo (Caminho Feliz)
  it('Deve realizar login com sucesso', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        "email": "fulano@qa.com", // Use o seu usuário válido aqui
        "password": "teste"
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Login realizado com sucesso');
      // Garantimos que o Token (authorization) realmente vem no corpo da resposta
      expect(response.body).to.have.property('authorization'); 
    });
  });

  // Cenário Negativo (Caminho Triste)
  it('Deve falhar ao tentar logar com senha incorreta', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false, // O Cypress falha o teste automaticamente se a API retornar erro (400, 401, 500). Desligamos isso para poder validar o erro!
      body: {
        "email": "fulano@qa.com",
        "password": "senha_completamente_errada"
      }
    }).then((response) => {
      // 401 significa "Unauthorized" (Não Autorizado)
      expect(response.status).to.eq(401); 
      expect(response.body.message).to.eq('Email e/ou senha inválidos');
    });
  });

});