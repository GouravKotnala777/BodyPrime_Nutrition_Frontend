import { useState, type ChangeEvent } from "react";
import { createProduct } from "../apis/product.api";
import { type CreateProductFormTypes } from "../utils/types";


function Inventory() {
    const [createProductForm, setCreateProductForm] = useState<Omit<CreateProductFormTypes, "tag"|"warning">&{tag:string; warning:string;}>({name:"", brand:"", category:"other", price:0, size:0, weight:"", tag:"", flavor:"", warning:""});

    function onChangeHandler(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
        setCreateProductForm({...createProductForm, [e.target.name]:e.target.value});
    };

    async function createProductHandler() {
        const res = await createProduct({
            ...createProductForm,
            tag:createProductForm.tag.split(","),
            warning:createProductForm.warning.split(",")
        });
        console.log(res);
    };
    
    return(
        <section className="px-2 py-4">
            <div className="text-center text-[1.5rem] font-semibold">
                <h1>Inventory</h1>
            </div>
            <div className="flex flex-col gap-2 text-[1.2rem] mt-4">
                <input type="text" name="name" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Product Name" onChange={onChangeHandler} />
                <input type="text" name="brand" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Brand" onChange={onChangeHandler} />
                <select name="category" className="px-5 py-2" onChange={onChangeHandler}>
                    <option value="protein" disabled>--select--</option>
                    <option value="protein">protein</option>
                    <option value="pre-workout">pre-workout</option>
                    <option value="vitamins">vitamins</option>
                    <option value="creatine">creatine</option>
                    <option value="other">other</option>
                </select>
                <input type="text" name="price" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Price" onChange={onChangeHandler} />
                <input type="text" name="flavor" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Flavor" onChange={onChangeHandler} />
                <input type="text" name="size" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Size" onChange={onChangeHandler} />
                <input type="text" name="tag" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Tag" onChange={onChangeHandler} />
                <input type="text" name="weight" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Weight" onChange={onChangeHandler} />
                <input type="text" name="warning" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Warning" onChange={onChangeHandler} />
                <button className="font-semibold py-3 rounded-2xl text-white bg-[#f44769]" onClick={createProductHandler}>Create Product</button>
            </div>
        </section>
    )
};

export default Inventory;