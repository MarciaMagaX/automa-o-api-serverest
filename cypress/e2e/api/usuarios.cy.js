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

// describe('API ServeRest - Testes na rota de Usuários', () => {

//   it('Deve listar os usuários cadastrados com sucesso', () => {
//     // ... nosso teste GET anterior continua aqui ...
//   });

//   // NOSSO NOVO TESTE POST
//   it('Deve cadastrar um novo usuário com sucesso', () => {
    
//     cy.request({
//       method: 'POST',
//       url: '/usuarios',
//       body: {
//         "nome": "QA Junior Teste",
//         "email": "qajunior123@qa.com.br",
//         "password": "teste",
//         "administrador": "true"
//       }
//     }).then((response) => {
//       // Validações
//       expect(response.status).to.eq(201); // 201 significa "Created" (Criado com sucesso)
//       expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      
//       // A API devolve o ID do usuário criado, podemos garantir que ele existe
//       expect(response.body).to.have.property('_id'); 
//     });

//   });

// });

describe('API ServeRest - Testes na rota de Usuários', () => {

  it('Deve cadastrar um novo usuário com sucesso usando fixture', () => {
    
    // Gerador de e-mail dinâmico usando o milissegundo atual
    const emailDinamico = `qa_${Date.now()}@qa.com.br`;

    // cy.fixture() vai buscar o arquivo na pasta cypress/fixtures/
    cy.fixture('usuario').then((massaDeDados) => {
      
      // Adicionamos o e-mail dinâmico à nossa massa de dados
      massaDeDados.email = emailDinamico;

      cy.request({
        method: 'POST',
        url: '/usuarios',
        body: massaDeDados // Injetamos o JSON limpo e dinâmico aqui
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      });

    });

  });

});