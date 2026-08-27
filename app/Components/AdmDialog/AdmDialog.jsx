import supabase from "../../supabaseClient";
import { use, useState } from "react";

export default function AdmDialog({ dialog, setDialog }) {
    const [produto, setProduto] = useState("");
    const [nameEdit, setNameEdit] = useState("");
    
    
    async function searchEdit(formData) {
        // if (!formData){ 
        //     return;
        // }

        // const { data, error } = await supabase.from('products').select('*').eq('name', formData.get("productSearchName"));

        // if (error) {
        //     console.log(`Erro ao buscar dados do Supabase na BuyPage: ${error.message}`);
        //     return [];
        // }
        // setProduto(data.name);
        
        // PROVAVELMENTE ADICIONAREI UM MODO DE TER OS DADOS EM CACHE E BUSCAR DE MODO MAIS RÁPIDO
        alert("hi");
    }

    function addProduct(formData) {
        alert(formData.get("productAddName"));
    }

    function editProduct(){
        alert(`Form submitted ${produto}`);
    }

    const addDialog = (
        <div open className="addDialog">
            <section className="addDialogHeader">
                <button onClick={closeDialog}> X </button>
            </section>
            <section>
                <form className="addDialogInputs"    action={addProduct}>
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
                            {nameEdit}
                            <input type="text" name="productSearchName"/>
                            <button formAction={searchEdit}> Pesquisar</button>
                        </label>
                    </section>

                    <section className="productSearch">
                        <div className="nameInputBlock">
                            <label htmlFor="productAddName"> Nome:
                                <input type="text" name="productAddName" value={nameEdit} onChange={(e) => setNameEdit(e.target.value)}/>
                            </label>
                        </div>

                        <div className="priceInputBlock">
                            <label htmlFor="productEditPrice"> Preço: </label>
                            <input type="text" name="productEditPrice" />
                        </div>

                        <div className="quantInputBlock">
                            <label htmlFor="productEditQuant"> Quantidade: </label>
                            <input type="number" name="productEditQuant" min={0} />
                        </div>

                        <div className="typeSelectBlock">
                            <label htmlFor="productEditType"> Tipo: </label>
                            <select name="productEditType">
                                <option value="salgadosOpt"> Salgado </option>
                                <option value="salgadinhosOpt"> Salgadinho </option>
                                <option value="bebidasOpt"> Bebida </option>
                                <option value="docesOpt"> Doce </option>
                                <option value="sorvetesOpt"> Sorvete </option>
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