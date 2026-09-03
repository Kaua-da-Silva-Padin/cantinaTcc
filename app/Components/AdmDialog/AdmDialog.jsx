import supabase from "../../supabaseClient";
import { useState, useEffect, useCallback } from "react";

export default function AdmDialog({ dialog, setDialog }) {
    const [produto, setProduto] = useState(null);
    const [produtos, setProdutos] = useState();
    const [nameEdit, setNameEdit] = useState("");
    const [priceEdit, setPriceEdit] = useState("");
    const [quantEdit, setQuantEdit] = useState(0);
    const [kindEdit, setKindEdit] = useState("standard");
    const [productSearchName, setProductSearchName] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    // async function fetchAll() {
    //     const { data, error } = await supabase.from('products').select('*');

    //     if (error) {
    //         console.error(`Erro ao buscar dados do Supabase na BuyPage: ${error.message}`);
    //         return [];
    //     }

    //     setProdutos(data);
    //     return;
    // }


    // 1. Defina a função de forma isolada e reutilizável
    const fetchAll = useCallback(async () => {
        try {
            const { data, error } = await supabase.from('products').select('*'); //O dado retornado é um array de objetos
            setProdutos(data);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);


    console.log(produtos);

    function standard() {
        setProduto("");
        setNameEdit("");
        setPriceEdit("");
        setQuantEdit(0);
        setKindEdit("standard");
        setProductSearchName("");
        setIsDisabled(false);
    }

    async function searchEdit() {
        setIsDisabled(true);
        const productName = productSearchName.trim(); // talvez eu substitua o state(productSearchName) por um formData.get["name"];
        const searchProduct = produtos.find(item => item.name == productName); // Procura o produto no produtos(proveniente de um select geral nos produtos do Supabase)

        {/* 

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('name', productName)
            .maybeSingle();


        if (error) {
            console.error(`Erro ao buscar produto no Supabase: ${error.message}`);
            standard();
            return;
        }
        */} // Select do Supabase

        if (!searchProduct) {
            setProduto(null);
            alert("Produto não encontrado.");
            standard();
            return;
        } // Se nada for achado, uma mensagem será retornada avisando o erro(provavelmnte não terá esse erro com o auto complete)


        setIsDisabled(false); // O Botão de pesquisa se torna utilizável novamente
        setProduto(searchProduct);
        setNameEdit(searchProduct.name);
        setPriceEdit(searchProduct.price);
        setQuantEdit(searchProduct.stock);
        setKindEdit(searchProduct.kind);

    }

    function addProduct(formData) {
        alert(formData.get("productAddName"));
    }

    async function editProduct(pvs) {
        if (Object.keys(pvs).length === 0) {
            alert("Nenhuma alteração detectada.");
            return;
        }
        const { data, error } = await supabase
            .from('products')
            .update(pvs)
            .eq('id', produto.id)
            .select();

        if (!data) {
            alert("erro");
            standard();
            return;
        }

        if (error) {
            console.error(`Erro ao buscar produto no Supabase: ${error.message}`);
            standard();
            return;
        }


        fetchAll();
        alert("Produto Atualizado!");
        standard();
    }

    function prepareEditProduct(formData) {
        const modifiedData = {};

        formData.forEach((value, key) => {
            if (produto[key] == undefined || value == produto[key]) {
                return;
            }
            modifiedData[key] = value;
        });

        editProduct(modifiedData);
    }


    const addDialog = (
        <div open className="addDialog">
            <section className="addDialogHeader">
                <button onClick={closeDialog}> X </button>
            </section>
            <section>
                <form className="addDialogInputs" action={addProduct}>
                    <div className="nameInputBlock">
                        <label htmlFor="name"> Nome:
                            <input required type="text" name="name" />
                        </label>
                    </div>

                    <div className="priceInputBlock">
                        <label htmlFor="price"> Preço: </label>
                        <input required type="text" name="price" />
                    </div>

                    <div className="quantInputBlock">
                        <label htmlFor="stock"> Quantidade: </label>
                        <input required type="number" name="stock" min={0} />
                    </div>

                    <div className="typeSelectBlock">
                        <label htmlFor="productAddType"> Tipo: </label>
                        <select name="productAddType">
                            <option value="salgados"> Salgado </option>
                            <option value="salgadinhos"> Salgadinho </option>
                            <option value="bebidas"> Bebida </option>
                            <option value="doces"> Doce </option>
                            <option value="sorvetes"> Sorvete </option>
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
                    <form>
                    <section className="productSearch">
                        <label htmlFor="productSearchName">
                            Nome:
                            <input type="text" name="productSearchName" value={productSearchName} onChange={(e) => setProductSearchName(e.target.value)} />
                            <button type="button" onClick={searchEdit} disabled={isDisabled} className={isDisabled ? "btnPending" : ""}> Pesquisar</button>
                        </label>
                    </section>

                    <section className="productSearch">
                        <div className="nameInputBlock">
                            <label htmlFor="name"> Nome:
                                <input type="text" name="name" value={nameEdit} onChange={(e) => setNameEdit(e.target.value)} />
                            </label>
                        </div>

                        <div className="priceInputBlock">
                            <label htmlFor="price"> Preço: </label>
                            <input type="float" name="price" value={priceEdit} onChange={(e) => setPriceEdit(e.target.value)} />
                        </div>

                        <div className="quantInputBlock">
                            <label htmlFor="stock"> Quantidade: </label>
                            <input type="number" name="stock" min={0} value={quantEdit} onChange={(e) => setQuantEdit(e.target.value)} />
                        </div>

                        <div className="typeSelectBlock">
                            <label htmlFor="productEditType"> Tipo: </label>
                            <select name="kind" value={kindEdit} onChange={e => setKindEdit(e.target.value)}>
                                <option value="standard"> </option>
                                <option value="salgados"> Salgado </option>
                                <option value="salgadinhos"> Salgadinho </option>
                                <option value="bebidas"> Bebida </option>
                                <option value="doces"> Doce </option>
                                <option value="sorvetes"> Sorvete </option>
                            </select>
                        </div>
                        <section>
                            <button type="submit" formAction={prepareEditProduct}> Atualizar Produto </button>
                        </section>
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