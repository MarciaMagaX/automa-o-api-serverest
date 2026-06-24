// O 'describe' é a nossa Suíte de Testes. Ele agrupa cenários que têm um tema em comum.
describe('API ServeRest - Testes na rota de Usuários', () => {

  // O 'it' é o nosso Cenário de Teste específico (Caso de Teste).
  it('Deve listar os usuários cadastrados com sucesso', () => {
    
    // Onde a API é chamada? Aqui! Usamos o comando cy.request()
    cy.request({
      method: 'GET', // O método HTTP (buscar informações)
      url: '/usuarios' // A rota (o baseUrl que configuramos é colocado antes disso automaticamente)
    }).then((response) => {
      // O '.then' pega a resposta da API (response) para podermos validá-la
      
      // Asserções (Validações): Aqui garantimos que a API fez o que devia
      expect(response.status).to.eq(200); // Valida se o status code é 200 (OK)
      expect(response.body).to.have.property('quantidade'); // Valida se o corpo da resposta tem o campo 'quantidade'
      expect(response.body.usuarios).to.be.an('array'); // Valida se a lista de usuários é um array
    });

  });

});