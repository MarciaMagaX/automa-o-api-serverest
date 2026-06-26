describe('API ServeRest - Testes na rota de Produtos', () => {

  // 1. O CORREDOR PRINCIPAL (Escopo Global da Suíte)
  // Declaramos as variáveis aqui para que TODOS os blocos abaixo consigam enxergá-las.
  const emailAdmin = `admin_${Date.now()}@qa.com.br`;
  const emailComum = `comum_${Date.now()}@qa.com.br`;
  const senhaPadrao = 'teste123';

  // 2. PREPARAÇÃO ÚNICA (Cria os usuários dinâmicos)
  before(() => {
    // Cria Administrador
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        "nome": "Admin Dinamico",
        "email": emailAdmin,
        "password": senhaPadrao,
        "administrador": "true"
      }
    });

    // Cria Usuário Comum
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        "nome": "Comum Dinamico",
        "email": emailComum,
        "password": senhaPadrao,
        "administrador": "false"
      }
    });
  });

  // 3. PREPARAÇÃO DE CADA TESTE (Login do Admin)
  beforeEach(() => {
    cy.login(emailAdmin, senhaPadrao); 
  });


  // --- NOSSOS 4 CENÁRIOS DE TESTE ---

  it('Deve retornar erro 401 ao tentar cadastrar com token inválido', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false, 
      headers: { authorization: 'Bearer token_inventado_para_falhar' },
      body: {
        "nome": "Produto Invasor",
        "preco": 100,
        "descricao": "Teste de segurança",
        "quantidade": 1
      }
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    });
  });

  it('Deve retornar erro 400 ao tentar cadastrar produto sem preencher campos obrigatórios', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false,
      headers: { authorization: Cypress.env('token_acesso') },
      body: {
        "descricao": "Produto sem nome e preço",
        "quantidade": 10
      }
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('nome', 'nome é obrigatório');
      expect(response.body).to.have.property('preco', 'preco é obrigatório');
    });
  });

  it('Deve cadastrar e deletar um produto com sucesso', () => {
    const nomeProduto = `Notebook QA ${Date.now()}`;
    let idProduto; 

    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: { authorization: Cypress.env('token_acesso') },
      body: {
        "nome": nomeProduto,
        "preco": 4700,
        "descricao": "Notebook de alta performance para automação",
        "quantidade": 10
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      
      idProduto = response.body._id; 

      cy.request({
        method: 'DELETE',
        url: `/produtos/${idProduto}`, 
        headers: { authorization: Cypress.env('token_acesso') }
      }).then((responseDelete) => {
        expect(responseDelete.status).to.eq(200);
      });
    });
  });

  it('Deve retornar erro 403 ao tentar cadastrar sendo um usuário não-administrador', () => {
    // Usamos o e-mail comum que foi declarado lá no topo e criado no 'before'
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        "email": emailComum, 
        "password": senhaPadrao
      }
    }).then((resLogin) => {
      const tokenComum = resLogin.body.authorization;

      cy.request({
        method: 'POST',
        url: '/produtos',
        failOnStatusCode: false,
        headers: { authorization: tokenComum },
        body: {
          "nome": "Produto Proibido",
          "preco": 99,
          "descricao": "Tentativa sem permissão",
          "quantidade": 1
        }
      }).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body.message).to.eq('Rota exclusiva para administradores');
      });
    });
  });

});