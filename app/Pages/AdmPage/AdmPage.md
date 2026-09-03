# AdmPage Tasks
# ALWAYS DO ATOMIC COMMITS
- [X] Prepare de AdmQuickButton 
- [X] Create a Dialog component
- [X] Test it's opening with one btn
- [X] Test it's opening with every btn
- [ ] Adjust the grid and else
- [ ] Pull data just for tests 
- [ ] Add the fields
    - [X] Create a form with useState (not necessary with the action or even onSubmit. But probabbly the edit form will need useState)
    - [ ] Create the image input

## Atualização da pesquisa de produtos (finalizado)
COMMIT: 
- ~~Vou fazer uma função teste para ver como os dados são retornados, assim poderei manipulá-los.~~
- ~~Depois disso, utilizarei um find com o nome do produto do form edit para percorrer o resultado da função que retorna todos os dados.~~
- ~~Após este processo, atualizarei os produtos conforme os dados que foram achados no percorrer da lista.~~

## Auto-Complete MUI (atualmente aqui)
COMMIT: 
- Quando eu terminar de mudar o código, perguntarei a uma IA sobre o código do componente auto complete para que eu possa entender.
- Quando eu entender, então realizarei modificações para que eu possa adaptar à necessidade do projeto.
- Depois de adaptar o componente, vou substituir o input dos dialogs pelo componente e testar

## Input de Imagem (Cadastro de Produtos)
COMMIT: 
Quando eu terminar o componente autocomplete, então farei o *input de imagem¹* para o cadastro de produto
- Input para receber arquivo, apenas png
- Fazer a imagem que foi enviada para o cadastro se tornar visível²

## Insert de produtos no Supabase e no Cloudinary
COMMIT:  
Depois de terminar o input de imagem vou fazer com que seja possível o insert no Supabase e no Cloudinary
- Fazer um insert na tabela de produtos(Supabase)
- Fazer um insert na tabela de imagens(Cloudinary) com os parametros(camelCase)
- Diagnosticar possíveis erros no envio dos dados e corrigir

## Visualização de Imagens no Editar Produto
- COMMIT: 
Quando o input de imagem for adicionado no cadastro de produtos, então farei a *imagem visível no Editar Produto²*
- Fazer um select do Cloudinary para que a imagem possa ser visível na edição

## Troca de Imagem no Editar produto
COMMIT: 
Quando a imagem já se tornar visível no Editar Produto
- Fazer com que a imagem possa ser trocada por outra(possível componetização do *input de imagem¹*)

## Visualização de Imagens no Remover Produto
COMMIT: 
Quando a imagem já se tornar visível no Editar Produto
- Fazer a imagem ser visível no Remover Produto(possível componetização do visualizador de imagens²)

## "Remover" o produto e a imagem no Remover Produto
COMMIT:  
Quando a imagem já se tornar visível no Remover Produto
- Fazer uma pergunta ao kauã se o produto será desativado ou realmente removido
- Fazer a operação de pesquisa do produto das tabelas(Supabase e Cloudinary)(possível reutilização da função de pesquisa)
- Fazer a operação de "remoção" do produto das tabelas(Supabase e Cloudinary)
- Identificar possíveis erros
    
## Adições futuras
- Fazer com que os campos de pesquisa estejam indisponíveis enquanto os dados de todos os produtos não tenham chegado
- Quando o sistema perceber que não houve alterações os states não devem mudar(atualmente o kind reseta)
- Fazer com que o adm não possa atualiza um produto com as informações de outro(por engano)


