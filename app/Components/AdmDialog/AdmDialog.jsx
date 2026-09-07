import supabase from "../../supabaseClient";
import AdmAutoComplete from "../AdmAutoComplete/AdmAutoComplete";
import { useState, useEffect, useCallback } from "react";

export default function AdmDialog({ dialog, setDialog, produtos, setProdutos, fetchAll }) {
    const [produto, setProduto] = useState(null);
    const [nameEdit, setNameEdit] = useState("");
    const [priceEdit, setPriceEdit] = useState("");
    const [quantEdit, setQuantEdit] = useState(0);
    const [kindEdit, setKindEdit] = useState("");
    const [productSearchName, setProductSearchName] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [image, setImage] = useState({
        image: "",
        url: ""
    });
    const [productDelete, setProductDelete] = useState({
        searchName: "",
        name: "",
        price: 0.00,
        stock: 0,
        kind: ""
    });

    function standard() {
        setProduto("");
        setNameEdit("");
        setPriceEdit("");
        setQuantEdit(0);
        setKindEdit("standard");
        setProductSearchName(null);
        setIsDisabled(false);
    }

    async function searchEdit() {
        if (!productSearchName) {
            alert("Nome Indefinido!");
            return;
        }
        setIsDisabled(true);

        const productName = productSearchName.name.trim();
        const searchProduct = produtos.find(item => item.name == productName); // Procura o produto no produtos(proveniente de um select geral nos produtos do Supabase)

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

    function searchDelete() {
        if (!productDelete.searchName.trim()) {
            alert("Nome Indefinido!");
            return;
        }

        const productName = productDelete.searchName.trim();
        const searchProduct = produtos.find(item => item.name == productName); // Procura o produto no produtos(proveniente de um select geral nos produtos do Supabase)

        if (!searchProduct) {
            setProduto(null);
            alert("Produto não encontrado.");
            standard();
            return;
        } // Se nada for achado, uma mensagem será retornada avisando o erro(provavelmnte não terá esse erro com o auto complete)

        setProductDelete({ ...productDelete, name: searchProduct.name, price: searchProduct.price, stock: searchProduct.stock, kind: searchProduct.kind })
    }

    async function handleFile(event) {
        const file = event.target.files[0]; // Pega o primeiro arquivo selecionado

        if (!file) {
            alert("Insira uma imagem!")
            return;
        }

        const genUrl = URL.createObjectURL(file);
        setImage({ image: file, url: genUrl });
    };

    function prepareAddProduct(formData) {
        const allValues = Array.from(formData.values());
        const isSomeEmpty = allValues.some(valor => !valor?.toString().trim());

        if (isSomeEmpty) {
            alert("O formulário precisa ser completamente preenchido");
            return;
        }

        const addData = { name: formData.get("name"), price: Number(formData.get("price")), kind: formData.get("kind"), stock: Number(formData.get("stock")) };
        addProduct(addData);
    }

    async function addProduct(addData) {
        if (!image.image) {
            alert("Insira uma imagem!");
            return;
        }

        const CLOUD_NAME = "seu_cloud_name";
        const UPLOAD_PRESET = "sua_preset_unsigned";
        const publicId = addData.name.trim().toLowerCase().replaceAll(" ", "");

        const cloudinaryData = new FormData();
        cloudinaryData.append("file", image.image);
        cloudinaryData.append("upload_preset", UPLOAD_PRESET);
        cloudinaryData.append("public_id", publicId);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: cloudinaryData,
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log("Upload concluído:", data.secure_url);
                setImage({});
            } else {
                throw new Error(data.error?.message || "Erro no upload");
            }
        } catch (error) {
            console.error("Erro ao enviar para o Cloudinary:", error);
            alert("Falha no upload da imagem.");
            return;
        }

        const { data, error } = await supabase
            .from('products')
            .insert([
                { name: addData.name, price: addData.price, kind: addData.kind, stock: addData.stock }
            ])
            .select()

        if (error) console.error('Error inserting product:', error)
        else {
            console.log('Product added successfully:', data)
            alert("Produto adicionado!");
        }

        fetchAll();
    }

    async function editProduct(pvs) {
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
        if (!productSearchName && !produto) {
            alert("Nenhum produto foi pesquisado para alteração");
            return;
        }

        const allValues = Array.from(formData.values());
        const isSomeEmpty = allValues.some(valor => !valor?.toString().trim());

        if (isSomeEmpty) {
            alert("Você não pode deixar campos vazios!");
            return;
        }
        const modifiedData = {};

        formData.forEach((value, key) => {
            if (produto[key] == undefined || produto[key] == "" || value == produto[key]) {
                return;
            }
            modifiedData[key] = value.trim();
        });

        if (Object.keys(modifiedData).length === 0) {
            alert("Nenhuma alteração detectada!");
            return;
        }
        editProduct(modifiedData);
    }


    const addDialog = (
        <div open className="addDialog">
            <section className="addDialogHeader">
                <button onClick={closeDialog}> X </button>
            </section>
            <section>
                <form className="addDialogInputs" action={prepareAddProduct}>
                    <div className="nameInputBlock">
                        <label htmlFor="name"> Nome:
                            <input required type="text" name="name" />
                        </label>
                    </div>

                    <div className="priceInputBlock">
                        <label htmlFor="price"> Preço:
                            <input required type="number" name="price" />
                        </label>
                    </div>

                    <div className="quantInputBlock">
                        <label htmlFor="stock"> Quantidade:
                            <input required type="number" name="stock" min={0} />
                        </label>
                    </div>

                    <div className="typeSelectBlock">
                        <label htmlFor="kind"> Tipo:
                            <select name="kind">
                                <option value="salgados"> Salgado </option>
                                <option value="salgadinhos"> Salgadinho </option>
                                <option value="bebidas"> Bebida </option>
                                <option value="doces"> Doce </option>
                                <option value="sorvetes"> Sorvete </option>
                            </select>
                        </label>
                    </div>

                    <div className="imageInputBlock">
                        <label htmlFor="productAddImg"> Imagem:
                            <input required type="file" accept="image/png" name="productAddImg" onChange={handleFile} />
                        </label>
                    </div>

                    <div className="imageVisBlock">
                        <img src={image.url ? image.url : undefined} />
                    </div>

                    <div className="actionButtons">
                        <button disabled type="submit"> Enviar </button>
                        <button type="reset" onClick={() => { setImage({ image: "", url: "" }) }}> Limpar </button>
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
                            {/* <input type="text" name="productSearchName" value={productSearchName} onChange={(e) => setProductSearchName(e.target.value)} /> */}
                            <AdmAutoComplete produtos={produtos} productSearchName={productSearchName} setProductSearchName={setProductSearchName} />
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
                            <input type="number" name="price" value={priceEdit} onChange={(e) => setPriceEdit(e.target.value)} />
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
                            <button disabled={!produto} type="submit" formAction={prepareEditProduct}> Atualizar Produto </button>
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
                    <input type="text" name="productRemoveName" required value={productDelete.searchName} onChange={(e) => setProductDelete({ ...productDelete, searchName: e.target.value })} />
                </label>
                <button type="button" id="productRemoveButton" onClick={searchDelete}> Pesquisar </button>
            </section>

            <section className="productRemoveInfos">
                <span className="productRemoveTitle"> Nome: </span> <span className="productRemoveLabel"> {productDelete.name} </span>
                <span className="productRemoveTitle"> Preço: </span> <span className="productRemoveLabel"> {productDelete.price} </span>
                <span className="productRemoveTitle"> Quantidade: </span> <span className="productRemoveLabel"> {productDelete.stock} </span>
                <span className="productRemoveTitle"> Tipo: </span> <span className="productRemoveLabel"> {productDelete.kind} </span>
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

        case "none" && !produtos:
            alert("Espere os dados carregarem...")
            return;

        default:
            break;
    }
}