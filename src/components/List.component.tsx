import { BiRightArrow } from "react-icons/bi";
import { NavLink } from "react-router-dom";



interface ListPropTypes<T>{
    searchField:keyof T;
    searchQuery:string;
    data:T[];
    hideSearchHandler:()=>void;
};

function List<T>({searchField, searchQuery, data, hideSearchHandler}:ListPropTypes<T&{_id:string; name:string; category:string; brand:string;}>) {

    return(
        <div className="">
            {
                data.length !== 0 && <h3 className="text-[1.1rem] font-semibold text-gray-700 mt-4">{searchField as string}</h3>
            }
            {
                data.map((p) => (
                    <NavLink to={`/single_product/${p._id}`}
                        onClick={hideSearchHandler}
                        className="block px-2 py-4 active:bg-[#f4466958]"
                    >{p[searchField] as string}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-600">({p.name} || {p.brand} || {p.category})</span></NavLink>
                ))
            }
            {
                data.length !== 0 && <div className="text-right">
                    <NavLink to={`/searched_products/${searchField as string}/${searchQuery}`}
                        onClick={hideSearchHandler}
                        className="text-[#f44669] underline underline-offset-2"
                    >
                        {/*<RightArr className="inline"/>*/}
                        go there
                        &gt;
                    </NavLink>
                </div>
            }
        </div>
    )
};

export default List;