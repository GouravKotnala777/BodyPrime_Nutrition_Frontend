import { useEffect, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { searchProducts } from "../apis/product.api";
import type { ProductTypes } from "../utils/types";
import List from "./List.component";
import { TbCancel } from "react-icons/tb";

interface SearchPropTypes{
    setIsSearchActive:Dispatch<SetStateAction<boolean>>;
};

function Search({setIsSearchActive}:SearchPropTypes) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedData, setSearchedData] = useState<{names:ProductTypes[]; categories:ProductTypes[]; brands:ProductTypes[]; tags:ProductTypes[];}>({names:[], categories:[], brands:[], tags:[]});
    
    function onChangeHandler(e:ChangeEvent<HTMLInputElement>) {
        setSearchQuery(e.target.value);
    };
    async function searchProductsHandler() {
        if(!searchQuery) throw Error("searchQuery not found");
        const res = await searchProducts(searchQuery);
        if (res.success) {
            setSearchedData(res.jsonData);
        }
        console.log(res);
    };

    function hideSearchHandler(){
        setIsSearchActive(false);
        //setSearchQuery("");
        //setSearchedData({names:[], brands:[], categories:[], tags:[]});
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log(searchQuery);
            searchProductsHandler();
        }, 2000);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return(
        <section className="px-2 py-8">
          <div className="flex">
            <input type="text" autoFocus name="searchQuery" placeholder="search name / brand / category"
              className="border-2 border-[#f44669] border-r-0 px-4 py-2 text-xl w-full rounded-l-[8px]"
              onChange={onChangeHandler}
            />
            <button className="border-2 border-[#f44669] border-l-0 rounded-r-[8px] w-[50px] bg-[#f4466960]" onClick={hideSearchHandler}><TbCancel className="mx-auto" /></button>
          </div>
          <div className="mt-4">
            <List searchField="name" searchQuery={searchQuery} data={searchedData.names} hideSearchHandler={hideSearchHandler} />
            <List searchField="category" searchQuery={searchQuery} data={searchedData.categories} hideSearchHandler={hideSearchHandler} />
            <List searchField="brand" searchQuery={searchQuery} data={searchedData.brands} hideSearchHandler={hideSearchHandler} />
            {
                searchedData.tags.length !== 0 && <h3 className="border-2 text-[1.1rem] font-semibold text-gray-700 mt-4">Tags</h3>
            }
            {
                searchedData.tags.map((p) => (
                    p.tag.map((t) => (
                        <NavLink to={"/"}
                            className="block p-2 active:bg-[#f4466958]"
                        >{t}</NavLink>
                    ))
                ))
            }
            {
                searchedData.tags.length !== 0 && <div className="text-right">
                    <NavLink to="/######" className="text-[#f44669]" >go there</NavLink>
                </div>
            }
          </div>

        </section>
    )    
};

export default Search;