import { useEffect, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { capitalizeString } from "../utils/functions";
import RangeInput from "./RangeInput.component";

interface FilterControlPanelPropInterface{
    clearFiltersHandler():void;
    filterOnChangeHandler(e:ChangeEvent<HTMLInputElement>):void;
    min:number;
    setMin:Dispatch<SetStateAction<number>>;
    max:number;
    setMax:Dispatch<SetStateAction<number>>;
};

function FilterControlPanel({clearFiltersHandler, filterOnChangeHandler, min, setMin, max, setMax}:FilterControlPanelPropInterface) {
    const [selectedFilter, setSelectedFilter] = useState<string>("preference");
    const [isFilterControlPanelOpen, setIsFilterControlPanelOpen] = useState<boolean>(false);

    function closeFilterControlPanelHandler() {
        setIsFilterControlPanelOpen(false);
    };
    
    useEffect(() => {
        function receiveFilterControlPanelEvent(event:Event) {
            const customEvent = (event as CustomEvent<{isFilterControlPanelOpen:boolean;}>);
            setIsFilterControlPanelOpen(customEvent.detail.isFilterControlPanelOpen);
        };
    
        window.addEventListener("toggleFilterControlPanel", receiveFilterControlPanelEvent);
    
        return() => window.removeEventListener("toggleFilterControlPanel", receiveFilterControlPanelEvent);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isFilterControlPanelOpen ? "hidden" : "auto";
    }, [isFilterControlPanelOpen]);

    return(
        <div className={`bg-black/60 fixed left-0 ${isFilterControlPanelOpen?"bottom-0":"-bottom-full"} w-full h-full transition-all ease-in-out duration-300`}
            onClick={closeFilterControlPanelHandler}
        >
            <div className="bg-white w-full h-[82%] absolute left-0 bottom-0"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="bg-primary-100 text-primary-600 text-lg font-semibold absolute -top-14 right-4 w-12 h-12 rounded-full grid place-items-center"
                    onClick={closeFilterControlPanelHandler}
                >X</button>
                <div className="h-full">
                    <div className="flex justify-between p-4">
                        <span className="text-gray-500 text-lg font-semibold">FILTERS</span>
                        <button className="text-secondary-400" onClick={clearFiltersHandler}>Clear Filter</button>
                    </div>
                    <div className="h-full flex">
                        {/* left part */}
                        <div className="border border-gray-200 w-25 flex flex-col">
                            {
                                ["preference", "price", "brand", "rating", "flavor", "category"].map((iter) => (
                                    <button className={`border-r-4 ${selectedFilter===iter ? "text-primary-400":"border-transparent text-gray-800"} text-sm py-4`} onClick={() => setSelectedFilter(iter)}>{capitalizeString(iter)}</button>
                                ))
                            }
                        </div>
                        
                        {/* right part */}
                        <div className="border border-gray-200 flex-1">
                            <div className="h-full">

                                {/* preference part */}
                                {
                                    selectedFilter === "preference" &&
                                        <div className="text-gray-700 text-md flex flex-col gap-10 px-4 py-3 ">
                                            <div className="text-gray-700 text-md flex items-center gap-4">
                                                <input id="veg" type="checkbox" name="dietaryType" value="veg" onChange={filterOnChangeHandler} />
                                                <label htmlFor="veg">Vegetarian</label>
                                            </div>
                                            <div className="text-gray-700 text-md flex items-center gap-4">
                                                <input id="nonveg" type="checkbox" name="dietaryType" value="nonveg" onChange={filterOnChangeHandler} />
                                                <label htmlFor="nonveg">Non-Vegetarian</label>
                                            </div>
                                            <div className="text-gray-700 text-md flex items-center gap-4">
                                                <input id="vegan" type="checkbox" name="dietaryType" value="vegan" onChange={filterOnChangeHandler} />
                                                <label htmlFor="vegan">Vegan</label>
                                            </div>
                                        </div>
                                }

                                {/* price part */}
                                {
                                    selectedFilter === "price" &&
                                        <div className="flex flex-col gap-4 px-4 py-15">
                                            <div className="w-full">
                                                <RangeInput minState={min} setMinState={setMin} maxState={max} setMaxState={setMax} minValue={500} maxValue={10000}
                                                    thumbSize="xs" rangeThickness="sm"
                                                />
                                            </div>
                                            <div className="flex justify-around items-center text-sm gap-2">
                                                <div className="text-gray-700 text-md px-2 py-1.5 w-20 text-right rounded-sm [box-shadow:0px_0px_3px_0.1px_var(--color-gray-400)_inset]">₹{min}</div>
                                                <div className="text-gray-500">to</div>
                                                <div className="text-gray-700 text-md px-2 py-1.5 w-20 text-right rounded-sm [box-shadow:0px_0px_3px_0.1px_var(--color-gray-400)_inset]">₹{max}</div>
                                            </div>
                                        </div>
                                }

                                {/* brand part */}
                                {
                                    selectedFilter === "brand" &&
                                        <div className="">
                                            <div className="m-5">
                                                <input name="brands" placeholder="Enter brand name"
                                                    className="border border-gray-200 bg-white text-md w-full px-3 py-3 rounded-sm"
                                                />
                                            </div>
                                            <div className="text-gray-700 text-md flex flex-col gap-10 h-full px-4 py-3 overflow-y-scroll scrollbar-thin">
                                                {
                                                    ["Viado's Himalayan Organics", "Neuherbs", "HealthyHey Nutrition", "Dr. Morepen", "HealthAid", "Zeroharm", "Nutrabay", "Optimum", "Patoni"].map((brand) => (
                                                        <div className="flex items-center gap-4">
                                                            <input id={brand} type="checkbox" name="brands" value={brand} onChange={filterOnChangeHandler} />
                                                            <label htmlFor={brand}>{brand}</label>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                }

                                {/* rating part */}
                                {
                                    selectedFilter === "rating" &&
                                        <div className="text-sm flex flex-col gap-10 px-4 py-3">
                                            {
                                                [{label:"⭐⭐⭐⭐⭐ Only", value:5}, {label:"⭐⭐⭐⭐ & Up", value:4}, {label:"⭐⭐⭐ & Up", value:3}, {label:"⭐⭐ & Up", value:2}, {label:"⭐ & Up", value:1}].map((iter) => (
                                                    <div className="text-gray-700 text-md flex items-center gap-4">
                                                        <input id={iter.label} type="radio" name="rating" value={iter.value} onChange={filterOnChangeHandler} />
                                                        <label htmlFor={iter.label}>{iter.label}</label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                }

                                {/* flavor part */}
                                {
                                    selectedFilter === "flavor" &&
                                        <div className="">
                                            <div className="m-5">
                                                <input name="brands" placeholder="Enter flavor name"
                                                    className="border border-gray-200 bg-white text-md w-full px-3 py-3 rounded-sm"
                                                />
                                            </div>
                                            <div className="text-gray-700 text-md flex flex-col gap-10 h-full px-4 py-3 overflow-y-scroll scrollbar-thin">
                                                {
                                                    ["Chocolate Milk", "Mango Shake", "Banana Shake", "Pista Badam", "Strawberry Milk", "Vanilla", "Butter Scotch", "Orange", "Unflavored", "Lemon"].map((flavor) => (
                                                        <div className="flex items-center gap-4">
                                                            <input id={flavor} type="checkbox" name="flavor" value={flavor} onChange={filterOnChangeHandler} />
                                                            <label htmlFor={flavor}>{flavor}</label>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                }


                                {/* category part */}
                                {
                                    selectedFilter === "category" &&
                                        <div className="">
                                            <div className="m-5">
                                                <input name="brands" placeholder="Enter category name"
                                                    className="border border-gray-200 bg-white text-md w-full px-3 py-3 rounded-sm"
                                                />
                                            </div>
                                            <div className="text-gray-700 text-md flex flex-col gap-10 h-full px-4 py-3 overflow-y-scroll scrollbar-thin">
                                                {
                                                    ["Protein", "Mass Gainer", "BCAAs", "EEAs", "Fat Burner", "Minerals", "Beauty Wellness", "Creatine", "Cartemine"].map((category) => (
                                                        <div className="flex items-center gap-4">
                                                            <input id={category} type="checkbox" name="category" value={category} onChange={filterOnChangeHandler} />
                                                            <label htmlFor={category}>{category}</label>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                }

                                

                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    )    
};

export default FilterControlPanel;