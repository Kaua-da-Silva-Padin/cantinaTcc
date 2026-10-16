import supabase from "../../supabaseClient";
import AdmAutoComplete from "../AdmAutoComplete/AdmAutoComplete";
import { useState } from "react";
import { RiSearchLine, RiCloseFill, RiCheckFill } from "react-icons/ri";
import { Button } from "@mui/material";
import Popup from "../../Components/Popup/Popup";
import { Cloudinary } from '@cloudinary/url-gen';
import { createCloudinaryImage, rememberCloudinaryVersion, toCloudinaryPublicId } from '../../utils/cloudinaryImage';

const CLOUD_NAME = "dntfculcp";

const cloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUD_NAME
    }
});

export default function AdmDialog({ dialog, setDialog, produtos, fetchAll }) {
    const [produto, setProduto] = useState(null);
    const [nameEdit, setNameEdit] = useState("");
    const [priceEdit, setPriceEdit] = useState("");
    const [quantEdit, setQuantEdit] = useState(0);
    const [kindEdit, setKindEdit] = useState("");
    const [productSearchName, setProductSearchName] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    const [addImage, setAddImage] = useState({
        image: "",
        url: ""
    });
    const [editImage, setEditImage] = useState({
        image: "",
        url: ""
    });

    const [productDelete, setProductDelete] = useState({
        searchName: "",
        id: null,
        name: "",
        price: 0.00,
        stock: 0,
        kind: "",
        imageUrl: ""
    });
    const [productDeleteSearch, setProductDeleteSearch] = useState(null);

    const [popup, setPopup] = useState({
        content: '',
        header: '',
        state: false
    });

    function showSuccessPopup(message) {
        setPopup({
            content: message,
            header: (
                <h2 className='text-success'>
                    <RiCheckFill className='me-2'/>
                    Sucesso
                </h2>
            ),
            state: true
        });
    }

    function showErrorPopup(message) {
        setPopup({
            content: message,
            header: (
                <h2 className='text-danger'>
                    <RiCloseFill className='me-2'/>
                    Erro
                </h2>
            ),
            state: true
        });
    }

    function standard() {
        setProduto("");
        setNameEdit("");
        setPriceEdit("");
        setQuantEdit(0);
        setKindEdit("standard");
        setProductSearchName(null);
        setIsDisabled(false);
        setEditImage({ image: "", url: "" });
    }

    async function searchEdit() {
        if (!productSearchName) {
            showErrorPopup("Nome Indefinido!");
            return;
        }
        setIsDisabled(true);

        const productName = productSearchName.name.trim();
        const searchProduct = produtos.find(item => item.name == productName);

        if (!searchProduct) {
            setProduto(null);
            showErrorPopup("Produto não encontrado.");
            standard();
            return;
        }

        setIsDisabled(false);
        setProduto(searchProduct);
        setNameEdit(searchProduct.name);
        setPriceEdit(searchProduct.price);
        setQuantEdit(searchProduct.stock);
        setKindEdit(searchProduct.kind);
        setEditImage({
            image: "",
            url: createCloudinaryImage(cloudinary, searchProduct.name).toURL()
        });
    }

    function searchDelete() {
        if (!productDelete.searchName.trim()) {
            showErrorPopup("Nome Indefinido!");
            return;
        }

        const productName = productDelete.searchName.trim();
        const searchProduct = produtos.find(item => item.name == productName);

        if (!searchProduct) {
            showErrorPopup("Produto não encontrado.");
            setProductDelete({ searchName: productDelete.searchName, id: null, name: "", price: 0, stock: 0, kind: "", imageUrl: "" });
            return;
        }

        setProductDelete({
            ...productDelete,
            id: searchProduct.id,
            name: searchProduct.name,
            price: searchProduct.price,
            stock: searchProduct.stock,
            kind: searchProduct.kind,
            imageUrl: createCloudinaryImage(cloudinary, searchProduct.name).toURL()
        });
    }

    async function deleteProduct() {
        if (!productDelete.id) {
            showErrorPopup("Nenhum produto foi pesquisado para exclusão.");
            return;
        }

        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('id', productDelete.id)
            .select('id');

        if (error) {
            console.error('Erro ao deletar produto:', error.message);
            showErrorPopup(`Falha ao excluir o produto: ${error.message}`);
            return;
        }

        if (!data || data.length === 0) {
            showErrorPopup("Produto não encontrado para exclusão.");
            return;
        }

        showSuccessPopup(`Produto excluído com sucesso!`);
        
        setProductDelete({ searchName: "", id: null, name: "", price: 0, stock: 0, kind: "", imageUrl: "" });
        setProductDeleteSearch(null);
        fetchAll();
    }

    async function handleAddFile(event) {
        const file = event.target.files[0];

        if (!file) {
            showErrorPopup("Insira uma imagem!");
            return;
        }

        const genUrl = URL.createObjectURL(file);
        setAddImage({ image: file, url: genUrl });
    };

    async function handleEditFile(event) {
        const file = event.target.files[0];

        if (!file) {
            showErrorPopup("Insira uma imagem!");
            return;
        }

        const genUrl = URL.createObjectURL(file);
        setEditImage({ image: file, url: genUrl });
    };

    async function uploadToCloudinary(file, publicId) {
        const { data: signData, error: signError } = await supabase.functions.invoke('cloudinary-sign', {
            body: { publicId }
        });

        if (signError) {
            throw new Error(signError.message || 'Erro ao assinar upload');
        }

        if (signData?.error) {
            throw new Error(signData.error);
        }

        const { signature, timestamp, apiKey, cloudName } = signData;

        const cloudinaryData = new FormData();
        cloudinaryData.append('file', file);
        cloudinaryData.append('public_id', publicId);
        cloudinaryData.append('timestamp', timestamp);
        cloudinaryData.append('api_key', apiKey);
        cloudinaryData.append('signature', signature);
        cloudinaryData.append('overwrite', 'true');
        cloudinaryData.append('invalidate', 'true');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: cloudinaryData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Erro no upload');
        }

        return data;
    }

    function prepareAddProduct(formData) {
        const allValues = Array.from(formData.values());
        const isSomeEmpty = allValues.some(valor => !valor?.toString().trim());
        const price = Number(formData.get("price"));
        const stock = Number(formData.get("stock"));

        if (isSomeEmpty || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
            showErrorPopup("O formulário precisa ser completamente preenchido");
            return;
        }

        const addData = { name: formData.get("name").trim(), price, kind: formData.get("kind"), stock };
        addProduct(addData);
    }

    async function addProduct(addData) {
        if (!addImage.image) {
            showErrorPopup("Insira uma imagem!");
            return;
        }

        const publicId = toCloudinaryPublicId(addData.name);

        try {
            await uploadToCloudinary(addImage.image, publicId);
        } catch (error) {
            console.error("Erro ao enviar para o Cloudinary:", error);
            showErrorPopup(`Falha no upload da imagem: ${error.message}`);
            return;
        }

        const { data, error } = await supabase
            .from('products')
            .insert([
                { name: addData.name, price: addData.price, kind: addData.kind, stock: addData.stock }
            ])
            .select()

        if (error) {
            console.error('Error inserting product:', error);
            showErrorPopup(`Falha ao adicionar o produto: ${error.message}`);
            return;
        }

        setAddImage({ image: "", url: "" });
        showSuccessPopup("Produto adicionado com sucesso!");
        fetchAll();
    }

    async function editProduct(pvs) {
        const hasImageChange = Boolean(editImage.image);

        if (editImage.image) {
            const finalName = nameEdit.trim();
            const publicId = toCloudinaryPublicId(finalName);

            try {
                const uploadedImage = await uploadToCloudinary(editImage.image, publicId);
                rememberCloudinaryVersion(publicId, uploadedImage.version);
                setEditImage({
                    image: "",
                    url: `${uploadedImage.secure_url}?v=${uploadedImage.version}`
                });
            } catch (error) {
                showErrorPopup(`Falha no upload da imagem: ${error.message}`);
                return;
            }
        }

        if (Object.keys(pvs).length === 0) {
            if (hasImageChange) {
                showSuccessPopup("Imagem atualizada com sucesso!");
                fetchAll();
                standard();
            }
            return;
        }

        if (pvs.name) pvs.name = pvs.name.trim();

        const { data, error } = await supabase
            .from('products')
            .update(pvs)
            .eq('id', produto.id)
            .select();

        if (error) {
            console.error(`Erro ao atualizar produto no Supabase: ${error.message}`);
            showErrorPopup(`Falha ao atualizar o produto: ${error.message}`);
            standard();
            return;
        }

        if (!data || data.length === 0) {
            showErrorPopup("Produto não encontrado para atualização.");
            standard();
            return;
        }

        showSuccessPopup("Produto atualizado com sucesso!");
        fetchAll();
        standard();
    }

    function prepareEditProduct(formData) {
        if (!productSearchName && !produto) {
            showErrorPopup("Nenhum produto foi pesquisado para alteração");
            return;
        }

        const allValues = Array.from(formData.values());
        const isSomeEmpty = allValues.some(valor => !valor?.toString().trim());
        const price = Number(formData.get("price"));
        const stock = Number(formData.get("stock"));

        if (isSomeEmpty || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
            showErrorPopup("Você não pode deixar campos vazios!");
            return;
        }
        const modifiedData = {};

        formData.forEach((value, key) => {
            const newValue = value.trim();
            const normalizedValue = key === "price"
                ? price
                : key === "stock"
                    ? stock
                : newValue;

            if (produto[key] === undefined || produto[key] === null || normalizedValue === produto[key]) {
                return;
            }
            modifiedData[key] = normalizedValue;
        });

        if (Object.keys(modifiedData).length === 0 && !editImage.image) {
            showErrorPopup("Nenhuma alteração detectada!");
            return;
        }
        editProduct(modifiedData);
    }


    const addDialog = (
        <div open className="addDialog">
            <section className="addDialogHeader">
                <h2>ADICIONAR PRODUTO</h2>
                <button onClick={closeDialog} aria-label="Fechar diálogo">X</button>
            </section>
            <section className="dialogBody">
                <form className="addDialogInputs" action={prepareAddProduct}>
                    <div className="dialogFields">
                        <label>Nome:<input required type="text" name="name" /></label>
                        <label>Preço:<input required type="number" name="price" placeholder="R$" /></label>
                        <label>Quantidade:<input required type="number" name="stock" min={0} /></label>
                        <label>Tipo:
                            <select name="kind">
                                <option value="salgados">Salgado</option>
                                <option value="salgadinhos">Salgadinho</option>
                                <option value="bebidas">Bebida</option>
                                <option value="doces">Doce</option>
                                <option value="sorvetes">Sorvete</option>
                            </select>
                        </label>
                    </div>
                    <div className="dialogImageColumn">
                        <div className={`dialogImagePreview ${addImage.url ? "hasImage" : ""}`}>
                            {addImage.url ? <img src={addImage.url} alt="Pré-visualização do produto" /> : <><span className="imagePlaceholderIcon" aria-hidden="true" /> <strong>Formato aceito: png</strong><small>Selecione uma imagem clicando<br />no botão abaixo</small></>}
                        </div>
                        <label className="imagePicker">Selecionar Imagem<input required type="file" accept="image/png" name="productAddImg" onChange={handleAddFile} /></label>
                    </div>
                    <div className="dialogActions"><button type="submit">Adicionar</button><button type="reset" onClick={() => { setAddImage({ image: "", url: "" }) }}>Limpar</button></div>
                </form>
            </section>
        </div>
    );


    const editDialog = (
        <div open className="editDialog">
            <section className="editDialogHeader">
                <h2>EDITAR PRODUTO</h2>
                <button onClick={closeDialog} aria-label="Fechar diálogo">X</button>
            </section>
            <section className="dialogBody">
                <form>
                    <div className="dialogSearch">
                        <span>Pesquisa:</span>
                        <AdmAutoComplete produtos={produtos} productSearchName={productSearchName} setProductSearchName={setProductSearchName} />
                        <button type="button" onClick={searchEdit} disabled={isDisabled} className={isDisabled ? "btnPending" : ""}><RiSearchLine aria-hidden="true" />Pesquisar</button>
                    </div>
                    <div className="dialogDivider" />
                    <div className="dialogFields">
                        <label>
                            Nome:
                            <input
                                type="text"
                                name="name"
                                value={nameEdit}
                                onChange={(e) => setNameEdit(e.target.value)}
                            />
                        </label>
                        <label>
                            Preço:
                            <input
                                type="number"
                                name="price"
                                placeholder="R$"
                                value={priceEdit}
                                onChange={(e) => setPriceEdit(e.target.value)}
                            />
                        </label>
                        <label>
                            Quantidade:
                            <input
                                type="number"
                                name="stock"
                                min={0}
                                value={quantEdit}
                                onChange={(e) => setQuantEdit(e.target.value)}
                            />
                        </label>
                        <label>Tipo:
                            <select
                                name="kind"
                                value={kindEdit}
                                onChange={(e) => setKindEdit(e.target.value)}
                            >
                                <option value="standard"> </option>
                                <option value="salgados">Salgado</option>
                                <option value="salgadinhos">Salgadinho</option>
                                <option value="bebidas">Bebida</option>
                                <option value="doces">Doce</option>
                                <option value="sorvetes">Sorvete</option>
                            </select>
                        </label>
                    </div>
                    <div className="dialogImageColumn">
                        <div className={`dialogImagePreview ${editImage.url ? "hasImage" : ""}`}>
                            {editImage.url ? (
                                <img
                                    src={editImage.url}
                                    alt="Pré-visualização do produto"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />
                            ) : (
                                <>
                                    <span className="imagePlaceholderIcon" aria-hidden="true" />
                                    <strong>Formato aceito: png</strong>
                                    <small>
                                        Selecione uma imagem clicando
                                        <br />
                                        no botão abaixo
                                    </small>
                                </>
                            )}
                        </div>
                        <label className="imagePicker">
                            Selecionar Imagem
                            <input
                                type="file"
                                accept="image/png"
                                onChange={handleEditFile}
                            />
                        </label>
                    </div>
                    <div className="dialogActions">
                        <button
                            disabled={!produto}
                            type="submit"
                            formAction={prepareEditProduct}
                        >
                            Editar
                        </button>
                        <button type="reset" onClick={() => { setEditImage({ image: "", url: "" }) }}>Limpar</button>
                    </div>
                </form>
            </section>
        </div>
    );

    const removeDialog = (
        <div open className="removeDialog">
            <section className="removeDialogHeader">
                <h2>REMOVER PRODUTO</h2>
                <button onClick={closeDialog} aria-label="Fechar diálogo">X</button>
            </section>
            <section className="dialogBody">
                <div className="dialogSearch">
                    <span>Pesquisa:</span>
                    <AdmAutoComplete
                        produtos={produtos}
                        productSearchName={productDeleteSearch}
                        setProductSearchName={(selectedProduct) => {
                            setProductDeleteSearch(selectedProduct);
                            setProductDelete({
                                searchName: selectedProduct?.name ?? "",
                                id: null,
                                name: "",
                                price: 0,
                                stock: 0,
                                kind: "",
                                imageUrl: ""
                            });
                        }}
                    />
                    <button type="button" onClick={searchDelete}>Pesquisar</button>
                </div>
                <div className="dialogDivider" />
                <div className="dialogFields"><label>Nome:<input readOnly value={productDelete.name} placeholder="Frango Assado" /></label><label>Preço:<input readOnly value={productDelete.price || ""} placeholder="R$ 30,99" /></label><label>Quantidade:<input readOnly value={productDelete.stock || ""} placeholder="50" /></label><label>Tipo:<input readOnly value={productDelete.kind} placeholder="Alimento" /></label></div>
                <div className="dialogImageColumn">
                    <div className={`dialogImagePreview ${productDelete.imageUrl ? "hasImage" : ""}`}>
                        {productDelete.imageUrl ? (
                            <img
                                src={productDelete.imageUrl}
                                alt="Pré-visualização do produto"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <><span className="imagePlaceholderIcon" aria-hidden="true" /><strong>Imagem do produto</strong></>
                        )}
                    </div>
                </div>
                <div className="dialogActions"><button type="button" className="removeAction" onClick={deleteProduct} disabled={!productDelete.id}>Excluir</button><button type="button" onClick={() => { setProductDelete({ searchName: "", id: null, name: "", price: 0, stock: 0, kind: "", imageUrl: "" }); setProductDeleteSearch(null); }}>Limpar</button></div>
            </section>
        </div>
    );

    function closeDialog() {
        setDialog("none");
    }

    return (
        <>
            <Popup
                state={popup.state}
                setState={setPopup}
                header={popup.header}
            >
                {popup.content}
            </Popup>

            {dialog === "addDialog" && addDialog}
            {dialog === "editDialog" && editDialog}
            {dialog === "removeDialog" && removeDialog}
        </>
    );
}