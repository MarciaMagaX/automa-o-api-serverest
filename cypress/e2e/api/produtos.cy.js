describe('API ServeRest - Testes na rota de Produtos', () => {

  beforeEach(() => {
    // ATENÇÃO: Coloque aqui o e-mail e senha de um usuário ADMINISTRADOR 
    // que já existe na sua base da ServeRest!
    cy.login('fulano@qa.com', 'teste'); 
  });

  it('Deve cadastrar e deletar um produto com sucesso', () => {
    
    const nomeProduto = `Notebook QA ${Date.now()}`;
    let idProduto; 

    // Passo 1: Executamos o POST para criar o produto
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: {
        authorization: Cypress.env('token_acesso') 
      },
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

      // Passo 2: Executamos o DELETE do produto recém-criado
      cy.request({
        method: 'DELETE',
        url: `/produtos/${idProduto}`, 
        headers: {
          authorization: Cypress.env('token_acesso') 
        }
      }).then((responseDelete) => {
        expect(responseDelete.status).to.eq(200);
        expect(responseDelete.body.message).to.eq('Registro excluído com sucesso');
      });

    });
  });

});