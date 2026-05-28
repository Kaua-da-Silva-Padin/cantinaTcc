import { index, route } from "@react-router/dev/routes";

export default [
    index("Pages/Home/Home.jsx"),
    route("buy", "Pages/BuyPage/BuyPage.jsx"),
    route("adm", "Pages/AdmPage/AdmPage.jsx"),
    route("profile", "Pages/Profile/Profile.jsx"),
    route("orders", "Pages/Orders/Orders.jsx")
];

