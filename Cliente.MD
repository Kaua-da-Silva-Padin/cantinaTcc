# Parte do cliente

## BuyPage.jsx
### Ideias:

- ##### SnackBar - Notificação ao adicionar item.
Quando adicionar um `item` ao carrinho, aparecerá uma notificação:
>     Minipizza      R$ 5.00

```jsx
function notificarNovoItemAdicionado(item) {
    // item = {name: "Minipizza", value: 5.00, type: "Salgado"}
    // O tipo do produto pode definir a cor da snackbar.
}
```



- Vamos utilizar o **[SnackBar](https://v7.mui.com/material-ui/react-snackbar/ "🦊")** do *MUI*

