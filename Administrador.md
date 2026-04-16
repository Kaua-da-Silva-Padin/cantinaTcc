# Parte do ADM

### \[Dashboard\]
- Item da lista `<li/>`: **Pedido**
    - **ID do pedido**
    - **Nome do aluno**
    - **Valor**
    - **Hora** que foi realizado* (Ou melhor, *a quanto tempo* o pedido está aberto)
    - **Botão "Ver Mais"**:
    (Ou então apenas clicar no *elemento* do pedido.)
        - Itens do pedido
        - ...
    - **Botão "Iniciar pedido"**
    
        

>     1 - João Pedro - 10min - R$ 10.00 [Iniciar]

>     2 - Kauã da Silva - 9min - R$ 50.00  [...]

## \[Design\]
- Responsividade
```jsx
const isMobile = useMediaQuery('(max-width: 768px)');
```
- Placeholder vazio antes de carregar os componentes da dashboard
https://v7.mui.com/material-ui/react-skeleton/


## \[ Atualizacões\ em\ Tempo\ Real \]

### Três métodos:
- **Pooling**
    - Fácil, *porém* faz muitas requisições a toa.
    - Ex: Fazer `fetch` a cada 5 segundos.
- **SSE** - *Server-Side Events* - Podemos usar 🦊
- **WebHooks** - Mais difícil, notificações em geral funcionam assim.