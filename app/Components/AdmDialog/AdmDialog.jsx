import supabase from "../../supabaseClient";
import { useState } from "react";

export default function AdmDialog({ dialog, setDialog }) {
    const [produto, setProduto] = useState(null);
    const [nameEdit, setNameEdit] = useState("");
    const [priceEdit, setPriceEdit] = useState("");
    const [quantEdit, setQuantEdit] = useState(0);
    const [kindEdit, setKindEdit] = useState("");
    const [productSearchName, setProductSearchName] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);


    async function searchEdit() {
        setIsDisabled(true);
        const productName = productSearchName.trim();

        if (!productName) {
            setIsDisabled(false);
            return;
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('name', productName)
            .maybeSingle();


        if (error) {
            console.error(`Erro ao buscar produto no Supabase: ${error.message}`);
            setProduto("");
            setNameEdit("");
            setPriceEdit("");
            setQuantEdit(0);
            setKindEdit("");
            setIsDisabled(false);
            return;
        }

        if (!data) {
            setProduto(null);
            setNameEdit("");
            alert("Produto não encontrado.");
            setIsDisabled(false);
            return;
        }

        setIsDisabled(false);
        setProduto(data);
        setNameEdit(data.name);
        setPriceEdit(String(`R$${data.price}`));
        setQuantEdit(data.stock);
        setKindEdit(data.kind);

    }

    function addProduct(formData) {
        alert(formData.get("productAddName"));
    }

    function editProduct() {
        alert(`Form submitted ${produto?.name ?? ""}`);
    }

    const addDialog = (
        <div open className="addDialog">
            <section className="addDialogHeader">
                <button onClick={closeDialog}> X </button>
            </section>
            <section>
                <form className="addDialogInputs" action={addProduct}>
                    <div className="nameInputBlock">
                        <label htmlFor="productAddName"> Nome:
                            <input required type="text" name="productAddName" />
                        </label>
                    </div>

                    <div className="priceInputBlock">
                        <label htmlFor="productAddPrice"> Preço: </label>
                        <input required type="text" name="productAddPrice" />
                    </div>

                    <div className="quantInputBlock">
                        <label htmlFor="productAddQuant"> Quantidade: </label>
                        <input required type="number" name="productAddQuant" min={0} />
                    </div>

                    <div className="typeSelectBlock">
                        <label htmlFor="productAddType"> Tipo: </label>
                        <select name="productAddType">
                            <option value="salgadosOpt"> Salgado </option>
                            <option value="salgadinhosOpt"> Salgadinho </option>
                            <option value="bebidasOpt"> Bebida </option>
                            <option value="docesOpt"> Doce </option>
                            <option value="sorvetesOpt"> Sorvete </option>
                        </select>
                    </div>

                    <div className="imageBlock">
                        <label htmlFor="productAddImg"> Imagem: </label>
                        <input required type="file" accept="image/*" name="productAddImg" />
                    </div>

                    <div className="actionButtons">
                        <button type="submit"> Enviar </button>
                        <button type="reset"> Limpar </button>
                    </div>
                </form>
            </section>
        </div>
    );


    const editDialog = (
        <div open className="editDialog">
            <section className="editDialogHeader">
                <button onClick={closeDialog}> X </button>
            </section>
            <section>
                <form action={editProduct}>
                    <section className="productSearch">
                        <label htmlFor="productSearchName">
                            Nome:
                            <input required type="text" name="productSearchName" value={productSearchName} onChange={(e) => setProductSearchName(e.target.value)} />
                            <button type="button" onClick={searchEdit} disabled={isDisabled} className={isDisabled ? "btnPending" : ""}> Pesquisar</button>
                        </label>
                    </section>

                    <section className="productSearch">
                        <div className="nameInputBlock">
                            <label htmlFor="productAddName"> Nome:
                                <input type="text" name="productAddName" value={nameEdit} onChange={(e) => setNameEdit(e.target.value)} />
                            </label>
                        </div>

                        <div className="priceInputBlock">
                            <label htmlFor="productEditPrice"> Preço: </label>
                            <input type="text" name="productEditPrice" value={priceEdit} onChange={(e) => setPriceEdit(e.target.value)} />
                        </div>

                        <div className="quantInputBlock">
                            <label htmlFor="productEditQuant"> Quantidade: </label>
                            <input type="number" name="productEditQuant" min={0} value={quantEdit} onChange={(e) => setQuantEdit(e.target.value)} />
                        </div>

                        <div className="typeSelectBlock">
                            <label htmlFor="productEditType"> Tipo: </label>
                            <select name="productEditType" value={kindEdit} onChange={e => setKindEdit(e.target.value)}>
                                <option value="salgados"> Salgado </option>
                                <option value="salgadinhos"> Salgadinho </option>
                                <option value="bebidas"> Bebida </option>
                                <option value="doces"> Doce </option>
                                <option value="sorvetes"> Sorvete </option>
                            </select>
                        </div>
                    </section>
                </form>
            </section>
        </div>
    );

    const removeDialog = (
        <div open className="removeDialog">
            <section className="removeDialogHeader">
                <button onClick={closeDialog}> X </button>
            </section>

            <section className="productRemove">
                <label htmlFor="productRemoveName">
                    Nome:
                    <input type="text" name="productRemoveName" required />
                </label>
                <button type="submit" id="productRemoveButton"> Pesquisar</button>
            </section>

            <section className="productRemoveInfos">
                <span className="productRemoveTitle"> Nome: </span> <span className="productRemoveLabel"> ... </span>
                <span className="productRemoveTitle"> Preço: </span> <span className="productRemoveLabel"> ... </span>
                <span className="productRemoveTitle"> Tipo: </span> <span className="productRemoveLabel"> ... </span>
                <span className="productRemoveTitle"> Quantidade: </span> <span className="productRemoveLabel"> ... </span>
            </section>

        </div>
    );

    function closeDialog() {
        setDialog("none");
    }

    switch (dialog) {
        case "addDialog":
            return addDialog;
            break;

        case "editDialog":
            return editDialog
            break;

        case "removeDialog":
            return removeDialog;
            break;

        case "none":
            return

        default:
            break;
    }
}