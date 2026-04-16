# Parte do ADM

### Dashboard
- Item da lista `<li/>`: **Pedido**
    - **ID do pedido**
    - **Nome do aluno**
    - **Valor**
    - **Hora** que foi realizado* (Ou melhor, *a quanto tempo* o pedido está aberto)
    - **Botão "Ver Mais"**: Mostrará os ***Itens* do Pedido**
    (Ou então apenas clicar no *elemento* `<li>` do pedido) 
    - **Botão "Iniciar pedido"**
    
        

>     1 - João Pedro - 10min - R$ 10.00 [Finalizar]
- *Esse pedido está **Em Preparo***

>     2 - Kauã da Silva - 9min - R$ 50.00 [...]
- *Este pedido está na **Fila***
## Design
- Responsividade
```jsx
isMobile = useMediaQuery('(max-width: 768px)');
```
- Placeholder vazio antes de carregar os componentes da dashboard
Usando o **[Skeleton](https://v7.mui.com/material-ui/react-skeleton/)** do **MUI**


##  Atualizacões em Tempo Real 

### Três métodos:
- **Pooling**
    - Fácil, *porém* faz muitas requisições a toa.
    - Ex: Fazer `fetch` a cada 5 segundos.
- **SSE** - *Server-Side Events* - Podemos usar 🦊
- **WebHooks** - Mais difícil, notificações em geral funcionam assim.

**[Vídeo que explica Pooling e SSE](www.youtube.com/shorts/09cZuTnHo4U)**