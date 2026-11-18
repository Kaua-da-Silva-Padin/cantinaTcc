import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { Link } from "react-router";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { FaTrash } from "react-icons/fa6";
import AdmSideBar from "../../Components/AdmSideBar/AdmSideBar";
import AdmDialog from "../../Components/AdmDialog/AdmDialog";
import { createCloudinaryImage } from "../../utils/cloudinaryImage";
import packageJson from "../../../package.json";
import supabase from "../../supabaseClient";
import "../../../index.css";
import "./Estoque.css";

const categoryNames = {
  salgados: "Salgados",
  salgadinhos: "Salgadinhos",
  bebidas: "Bebidas",
  doces: "Doces",
  sorvetes: "Sorvetes",
};

const adminLinks = [
  { text: "Estoque", link: "/stock" },
  { text: "Finanças", link: "/finance" },
  { text: "Estatísticas", link: "/statistics" },
  { text: "Funcionários", link: "/employees" },
  { text: "Configurações", link: "/settings" },
];

const navigationGroups = {
  speedDial: [
    { text: "Home", link: "/home" },
    { text: "Cantina", link: "/buy" },
    { text: "Administrar", link: "/adm" },
    { text: "Pedidos", link: "/orders" },
    { text: "Login", link: "/login" },
    { text: "Registrar", link: "/" },
    { text: "Perfil", link: "/profile" },
  ],
  admin: adminLinks,
};

const cloudinary = new Cloudinary({ cloud: { cloudName: "dntfculcp" } });

function formatPrice(value) {
  return Number(value).toFixed(2).replace(".", ",");
}

function shortenProductName(name) {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  let shortName = words.length > 2 ? `${words[0]} ${words.at(-1)}` : words.join(" ");
  if (shortName.length > 10) shortName = `${shortName.slice(0, 7)}...`;
  return shortName;
}

export default function Estoque() {
  const [products, setProducts] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [mode, setMode] = useState("Estoque");
  const [selections, setSelections] = useState({ Estoque: {}, Vendas: {} });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [dialog, setDialog] = useState("none");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [sideBarOn, setSideBarOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  const loggedInUser = typeof sessionStorage !== "undefined"
    ? sessionStorage.getItem("loggedInUser")
    : null;
  let parsedUser = null;
  try {
    parsedUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  } catch {
    parsedUser = null;
  }
  const loggedInUserName = parsedUser?.name ?? parsedUser?.nome ?? loggedInUser ?? "Funcionário";

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (error) throw error;
    setProducts(data ?? []);
  }, []);

  useEffect(() => {
    fetchProducts().catch((error) => {
      console.error("Erro ao buscar produtos:", error);
      setProducts([]);
    });
  }, [fetchProducts]);

  useEffect(() => {
    const clock = window.setInterval(() => setCurrentTime(new Date()), 1000);
    setSideBarOn(false);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const updateMobileLayout = () => setIsMobileLayout(mediaQuery.matches);
    updateMobileLayout();
    mediaQuery.addEventListener("change", updateMobileLayout);
    return () => mediaQuery.removeEventListener("change", updateMobileLayout);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setActiveSearch(searchText.trim()), 1000);
    return () => window.clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const handleModeShortcut = (event) => {
      if (event.ctrlKey && event.key === ".") {
        event.preventDefault();
        switchMode();
      }
    };
    window.addEventListener("keydown", handleModeShortcut);
    return () => window.removeEventListener("keydown", handleModeShortcut);
  }, []);

  useEffect(() => {
    if (!activeSearch) {
      setExpandedCategories({});
      return;
    }
    const terms = activeSearch.split(",").map((term) => term.trim().toLowerCase()).filter(Boolean);
    const foundCategories = {};
    (products ?? []).forEach((product) => {
      if (terms.some((term) => product.name.toLowerCase().includes(term))) {
        foundCategories[product.kind] = true;
      }
    });
    setExpandedCategories(foundCategories);
  }, [activeSearch, products]);

  const currentSelection = selections[mode];
  const selectedEntries = useMemo(
    () => (products ?? [])
      .filter((product) => currentSelection[product.id])
      .map((product) => ({ product, qty: currentSelection[product.id] })),
    [products, currentSelection]
  );

  const total = selectedEntries.reduce(
    (sum, { product, qty }) => sum + Number(product.price) * (mode === "Estoque" ? Math.abs(qty) : qty),
    0
  );

  const searchedProducts = useMemo(() => {
    if (!activeSearch) return null;
    const terms = activeSearch.split(",").map((term) => term.trim().toLowerCase()).filter(Boolean);
    return (products ?? []).filter((product) =>
      terms.some((term) => product.name.toLowerCase().includes(term))
    );
  }, [activeSearch, products]);

  const visibleProducts = (kind) => {
    const categoryProducts = (products ?? []).filter((product) => product.kind === kind);
    if (!activeSearch) return categoryProducts;
    return categoryProducts.filter((product) => (searchedProducts ?? []).some((item) => item.id === product.id));
  };

  const updateSelection = (product, delta) => {
    setSelections((previous) => {
      const modeSelection = { ...previous[mode] };
      const currentQty = modeSelection[product.id] ?? 0;
      let nextQty = currentQty + delta;

      if (mode === "Vendas") {
        nextQty = Math.max(0, Math.min(product.stock, nextQty));
      } else {
        nextQty = Math.max(-Number(product.stock), nextQty);
        if (delta > 0) nextQty = Math.min(Number.MAX_SAFE_INTEGER, nextQty);
      }
      if (nextQty === 0) delete modeSelection[product.id];
      else modeSelection[product.id] = nextQty;
      return { ...previous, [mode]: modeSelection };
    });
  };

  const setStockTarget = (product, targetValue) => {
    const targetStock = Number(targetValue);
    if (!Number.isInteger(targetStock) || targetStock < 0) return;

    setSelections((previous) => {
      const modeSelection = { ...previous.Estoque };
      const adjustment = targetStock - Number(product.stock);
      if (adjustment === 0) delete modeSelection[product.id];
      else modeSelection[product.id] = adjustment;
      return { ...previous, Estoque: modeSelection };
    });
  };

  const clearSelection = () => {
    setSelections((previous) => ({ ...previous, [mode]: {} }));
    setClearDialogOpen(false);
  };

  const removeAllProduct = (productId) => {
    setSelections((previous) => {
      const modeSelection = { ...previous[mode] };
      delete modeSelection[productId];
      return { ...previous, [mode]: modeSelection };
    });
  };

  const switchMode = () => setMode((current) => (current === "Estoque" ? "Vendas" : "Estoque"));

  const executeAction = async () => {
    setActionDialogOpen(false);
    setActionError("");
    setActionSuccess("");

    try {
      if (mode === "Estoque") {
        const increaseStock = selectedEntries
          .filter(({ qty }) => qty > 0)
          .map(({ product, qty }) => ({ id: product.id, qty }));
        const decreaseStock = selectedEntries
          .filter(({ qty }) => qty < 0)
          .map(({ product, qty }) => ({ id: product.id, qty }));

        if (increaseStock.length === 0 && decreaseStock.length === 0) return;
        const { error } = await supabase.rpc("update_products_stock", {
          increase_stock: increaseStock,
          decrease_stock: decreaseStock,
        });
        if (error) throw error;
      } else {
        const salePayload = {
          user: "local",
          total_price: total,
          progress: { preparation: "local", payment: "paid" },
          products: selectedEntries.map(({ product, qty }) => ({
            qty,
            price_unit: product.price,
            price_total: product.price * qty,
            product_name: product.name,
          })),
        };
        const { error } = await supabase.rpc("register_sale", { payload: salePayload });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Erro ao concluir ação do estoque:", error);
      setActionError(`Não foi possível concluir a ação. Erro: ${error?.code ?? error?.message ?? "UNKNOWN"}`);
      return;
    }

    setSelections((previous) => ({ ...previous, [mode]: {} }));
    try {
      await fetchProducts();
      setActionSuccess(mode === "Estoque"
        ? "Estoque atualizado com sucesso!"
        : "Venda registrada com sucesso!");
    } catch (error) {
      console.error("A ação foi concluída, mas não foi possível atualizar o estoque:", error);
      setActionError(
        `A ação foi concluída, mas não foi possível atualizar os produtos exibidos. Erro: ${error?.code ?? error?.message ?? "UNKNOWN"}`
      );
    }
  };

  const openProductDialog = (dialogName) => setDialog(dialogName);

  if (parsedUser?.type !== "admin") {
    return <h4 className="text-center text-danger">A página de administração é reservada apenas para administradores!</h4>;
  }

  return (
    <div className={`stock-admin-shell ${sideBarOn ? "sideBarOn" : "sideBarOff"} stock-mode-${mode.toLowerCase()}`}>
      <aside className="stock-sidebar">
        <AdmSideBar tools={adminLinks} navigationGroups={navigationGroups} />
      </aside>
      <main className="stock-main">
        <header className="stock-navbar">
          <button type="button" aria-label={sideBarOn ? "Fechar menu" : "Abrir menu"} onClick={() => setSideBarOn((current) => !current)}>
            <img src={sideBarOn ? "/imgs/closeicon.png" : "/imgs/more.png"} alt="" />
          </button>
          <div className="stock-navbar-status">
            <span>{`${currentTime.getDate()} de ${currentTime.toLocaleDateString("pt-BR", { month: "long" })} de ${currentTime.getFullYear()} ${currentTime.toLocaleTimeString("pt-BR")}`}</span>
            <span>Versão: {packageJson.version}</span>
            <span className="stock-system-status">Status do Sistema: Ativo</span>
            <Link to="/profile" className="stock-user-link">
              <b>{loggedInUserName}</b>
              <Avatar sx={{ width: 34, height: 34 }}>{loggedInUserName.charAt(0).toUpperCase()}</Avatar>
            </Link>
          </div>
        </header>

        <section className="stock-workspace">
          <div className="stock-search-area">
            <div className="stock-search-field">
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Coxinha"
                aria-label="Pesquisar produtos"
              />
              {searchText && <button type="button" className="stock-clear-search" onClick={() => setSearchText("")} aria-label="Limpar pesquisa">X</button>}
            </div>
            <div className="stock-suggestions">
              <b>Sugestões:</b>
              {["Pastel", "Pão de Queijo", "Copo de Guaraná", "Coxinha"].map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => setSearchText(suggestion)}>{suggestion}</button>
              ))}
            </div>
          </div>

          <div className="stock-selection-panel">
            {selectedEntries.length === 0 ? (
              <div className="stock-selection-empty">Nenhum produto foi selecionado ainda</div>
            ) : (
              <div className="stock-selection-list">
                {selectedEntries.map(({ product, qty }) => (
                  <div className={`stock-selected-item ${mode === "Estoque" && qty < 0 ? "selected-remove" : "selected-add"}`} key={product.id}>
                    <button type="button" className="stock-remove-all" onClick={() => removeAllProduct(product.id)} aria-label={`Remover ${product.name}`}>X</button>
                    <b className="stock-selected-name">{shortenProductName(product.name)}</b>
                    <span className="stock-selected-quantity">
                      {mode === "Estoque"
                        ? `${qty > 0 ? "+" : ""}${qty}`
                        : `x${qty}`}
                    </span>
                    <b className="stock-selected-price">R${formatPrice(product.price * (mode === "Estoque" ? Math.abs(qty) : qty))}</b>
                  </div>
                ))}
              </div>
            )}
            <div className="stock-selection-divider" />
            <div className="stock-total"><span>Total:</span><b>R${formatPrice(total)}</b></div>
            <button type="button" className="stock-action-button" disabled={selectedEntries.length === 0} onClick={() => setActionDialogOpen(true)}>
              {mode === "Estoque" ? "ALTERAR" : "VENDER"}
            </button>
          </div>

          <div className="stock-selection-controls">
            <button type="button" className="stock-clear-button" disabled={selectedEntries.length === 0} onClick={() => setClearDialogOpen(true)}>Limpar seleção</button>
            <button type="button" className={`stock-switch ${mode.toLowerCase()}`} onClick={switchMode} aria-label={`Modo atual: ${mode}`}>
              <span className={mode === "Estoque" ? "active" : ""}>Estoque</span>
              <i><b /></i>
              <span className={mode === "Vendas" ? "active" : ""}>Vendas</span>
            </button>
            {mode === "Estoque" && (
              <div className="stock-db-actions">
                <button type="button" className="stock-add-db" onClick={() => openProductDialog("addDialog")} aria-label="Adicionar produto">+</button>
                <button type="button" className="stock-edit-db" onClick={() => openProductDialog("editDialog")} aria-label="Editar produto">✎</button>
                <button type="button" className="stock-delete-db" onClick={() => openProductDialog("removeDialog")} aria-label="Excluir produto"><FaTrash aria-hidden="true" /></button>
              </div>
            )}
          </div>

          <div className="stock-categories">
            {Object.entries(categoryNames).map(([kind, title]) => {
              const categoryProducts = visibleProducts(kind);
              if (activeSearch && categoryProducts.length === 0) return null;
              const isExpanded = !isMobileLayout || (activeSearch
                ? Boolean(expandedCategories[kind])
                : Boolean(expandedCategories[kind]));
              return (
                <section className={`stock-category ${isExpanded ? "expanded" : ""}`} key={kind}>
                  <button type="button" className="stock-category-header" onClick={() => setExpandedCategories((previous) => ({ ...previous, [kind]: !isExpanded }))}>
                    <span>{title}</span>
                    <b aria-hidden="true">{isExpanded ? "⌃" : "⌄"}</b>
                  </button>
                  {isExpanded && (
                    <div className="stock-category-list">
                      {categoryProducts.map((product) => {
                        const qty = currentSelection[product.id] ?? 0;
                        const minusDisabled = mode === "Vendas"
                          ? qty <= 0
                          : qty <= -Number(product.stock);
                        const plusDisabled = mode === "Vendas" ? qty >= product.stock : false;
                        const unavailable = mode === "Vendas" && product.stock <= 0;
                        return (
                          <article className={`stock-product ${unavailable ? "unavailable" : ""}`} key={product.id}>
                            <AdvancedImage cldImg={createCloudinaryImage(cloudinary, product.name)} alt={product.name} />
                            <div className="stock-product-info">
                              <b>{product.name}</b>
                              <span>R${formatPrice(product.price)}</span>
                            </div>
                            <div className="stock-product-controls">
                              <button type="button" className="stock-minus" disabled={minusDisabled || unavailable} onClick={() => updateSelection(product, -1)} aria-label={`Remover uma unidade de ${product.name}`}>
                                {mode === "Estoque" ? "-" : "↓"}
                              </button>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={Number(product.stock) + (mode === "Estoque" ? qty : -qty)}
                                readOnly={mode === "Vendas"}
                                onFocus={(event) => event.target.select()}
                                onChange={(event) => {
                                  if (event.target.value !== "") setStockTarget(product, event.target.value);
                                }}
                                aria-label={`${mode === "Estoque" ? "Estoque previsto de" : "Estoque restante após a venda de"} ${product.name}`}
                                title={mode === "Estoque" ? "Estoque previsto após as alterações pendentes" : "Estoque restante após as vendas selecionadas"}
                              />
                              <button type="button" className="stock-plus" disabled={plusDisabled || unavailable} onClick={() => updateSelection(product, 1)} aria-label={`Adicionar uma unidade de ${product.name}`}>
                                {mode === "Estoque" ? "+" : "↑"}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </section>
      </main>

      <div className={`admDialogScreen ${dialog !== "none" ? "isOpen" : ""}`}>
        <AdmDialog
          dialog={dialog}
          setDialog={setDialog}
          produtos={products ?? []}
          setProdutos={setProducts}
          fetchAll={fetchProducts}
        />
      </div>

      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>Você realmente deseja limpar a seleção de produtos?</DialogContent>
        <DialogActions>
          <Button onClick={clearSelection} variant="contained" sx={{ background: "black", color: "white" }}>Sim</Button>
          <Button onClick={() => setClearDialogOpen(false)} variant="contained" color="error">Não</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>Atenção!</DialogTitle>
        <DialogContent>
          Você realmente deseja realizar {mode === "Vendas" ? "esta venda" : "esta(s) alteração(ões)" }?
        </DialogContent>
        <DialogActions>
          <Button onClick={executeAction} variant="contained" sx={{ background: "green", color: "white" }}>Sim</Button>
          <Button onClick={() => setActionDialogOpen(false)} variant="contained" color="error">Não</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(actionError)} onClose={() => setActionError("")}>
        <DialogTitle>Erro!</DialogTitle>
        <DialogContent>{actionError}</DialogContent>
        <DialogActions>
          <Button onClick={() => setActionError("")} variant="contained" sx={{ background: "black", color: "white" }}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(actionSuccess)} onClose={() => setActionSuccess("")}>
        <DialogTitle>Sucesso</DialogTitle>
        <DialogContent>{actionSuccess}</DialogContent>
        <DialogActions>
          <Button onClick={() => setActionSuccess("")} variant="contained" sx={{ background: "green", color: "white" }}>OK</Button>
        </DialogActions>
      </Dialog>

      {products === null && <div className="stock-loading">Carregando estoque...</div>}
    </div>
  );
}
