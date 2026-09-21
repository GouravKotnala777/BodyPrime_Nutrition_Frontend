import { NavLink } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
//import { type ProductCardPropTypes } from "../components/ProductCard.component";
import ImageWithFallback from "../components/ImageWithFallback.component";


const CATEGORY_DATA = [
    {img:"https://cdn2.nutrabay.com/page_manager/Pea-Protein-1771222444.webp", heading:"Plant Protein", category:"protein", subCategory:"plant"},
    {img:"https://cdn2.nutrabay.com/page_manager/image-1-1782968120.webp", heading:"Whey Protein", category:"protein", subCategory:"whey"},
    //{img:"https://cdn2.nutrabay.com/page_manager/image-1-1782968120.webp", heading:"Protein"},
    {img:"https://cdn2.nutrabay.com/page_manager/Yeast-Protein-1771222444.webp", heading:"Yeast Protein", category:"protein", subCategory:"yeast"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Creatine-2-1779255946.webp", heading:"Creatine", category:"pre-workout", subCategory:"creatine"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Pre-Workout-1768369799.webp", heading:"Pre Workout", category:"pre-workout", subCategory:"null"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Mass-&-Weight-gainers-1767084988.webp", heading:"Mass Gainer", category:"weight", subCategory:"mass gainer"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/L-Carnitine-1770189032.webp", heading:"L Cartinine", category:"l-cartinine", subCategory:"null"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/BCAA-1-1776232203.webp", heading:"BCAA", category:"bcaa", subCategory:"null"}
];
const CATEGORY_DATA2 = [
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Omega-1766725264.webp", heading:"Fish Oil", category:"fatty acids", subCategory:"fish oils"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Multivitamins-for-Men-1776232203.webp", heading:"Multivitamins", category:"vitamins", subCategory:"null"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Magnesium-1767085118.webp", heading:"Magnesium Glycinate", category:"minerals", subCategory:"magnesium glycinate"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Single-Vitamins-1767085085.webp", heading:"Single Vitamins", category:"vitamin", subCategory:"null"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Shilajit-1767085156.webp", heading:"Shilajit", category:"ayurvedic", subCategory:"shilajit"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Supplements-for-Skin-&-Hair-1767085085.webp", heading:"Collagen", category:"protein", subCategory:"collagen"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Ashwagandha-1770189032.webp", heading:"Ashwagandha", category:"ayurvedic", subCategory:"ashwagandha"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Pre-&-Probiotic-1-1779255946.webp", heading:"Pre & Probiotics", category:"wellness", subCategory:"probiotics"}
];
const CATEGORY_DATA3 = [
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Nuts,-Seed-7-grain-1767085203.webp", heading:"Protein Oats", category:"health food", subCategory:"grain"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Peanut-Butter-1767085203.webp", heading:"Peanut Butter", category:"health food", subCategory:"legumes"},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Apple-Cidar-Vinegar-1767085203.webp", heading:"Apple Cider Vineger", category:"apple cider vineger", subCategory:""},
    {img:"https://cdn2.nutrabay.com/marketing-promotions/Protein-Bars-1767085203.webp", heading:"Protein Bars", category:"health food", subCategory:"bar"},
];

//const PRODUCTS:ProductCardPropTypes["product"][] = [
//    {_id:"1234567890", brand:"brand1", category:"protein", subCategory:"whey", dietaryType:"veg", images:["/test-category.webp"], name:"product1", price:2400, rating:4, numReviews:3832, weight:"1kg", variants:[], flavor:"chocolate", tags:[]},
//    {_id:"1234567891", brand:"brand2", category:"vitamins", subCategory:"vitamin a", dietaryType:"veg", images:["/test-category.webp"], name:"product2", price:3100, rating:3, numReviews:2112, weight:"1kg", variants:[],  flavor:"vanilla", tags:[]},
//    {_id:"1234567892", brand:"brand3", category:"protein", subCategory:"whey", dietaryType:"veg", images:["/test-category.webp"], name:"product3", price:400, rating:2, numReviews:128, weight:"1kg", variants:[],  flavor:"milk", tags:[]},
//    {_id:"1234567893", brand:"brand1", category:"minerals", subCategory:"zinc", dietaryType:"veg", images:["/test-category.webp"], name:"product4", price:1100, rating:4, numReviews:732, weight:"1kg", variants:[],  flavor:"chocolate", tags:[]},
//    {_id:"1234567894", brand:"brand1", category:"pre-workout", subCategory:"creatine", dietaryType:"veg", images:["/test-category.webp"], name:"product5", price:2400, rating:1, numReviews:9092, weight:"1kg", variants:[],  flavor:"mango", tags:[]},
//    {_id:"1234567895", brand:"brand2", category:"protein", subCategory:"whey", dietaryType:"veg", images:["/test-category.webp"], name:"product6", price:5499, rating:4, numReviews:32, weight:"1kg", variants:[],  flavor:"butter", tags:[]},
//    //{_id:"1234567896", brand:"brand1", category:"vitamins", images:["test-category.webp"], name:"product7", price:3090, rating:5, numReviews:338, weight:"1kg", flavor:"chocolate"},
//]


function Home() {


    return(
        <section className="mx-1 sm:mx-10">
            {/* first row */}
            <div className="text-xl sm:text-2xl flex gap-2 font-semibold items-center my-5">
                <div>Performance Nutrition</div>
                <NavLink to="/searched_products/null/null/null" className="text-primary-400 flex items-center gap-2 group hover:opacity-70">
                    <div>All</div>
                    <div className="bg-primary-100 rounded-full w-10 h-10 text-center content-center pl-1"><MdKeyboardArrowRight className="text-3xl group-hover:translate-x-2 transition-transform ease-in-out duration-300" /></div>
                </NavLink>
            </div>
            <div className="">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    {
                        CATEGORY_DATA.map(({img, heading, category, subCategory}) => (
                            <NavLink key={heading} to={`/searched_products/category/${category}/${subCategory}`} className="text-center full w-20 sm:w-30">
                                <div className="w-full h-full mx-auto rounded-3xl overflow-hidden">
                                    <ImageWithFallback src={img} alt={img} fallbackSrc="/placeholders/no_product.jpg" />
                                </div>
                                <div className="text-gray-700 text-lg py-1">{heading}</div>
                            </NavLink>
                        ))
                    }
                </div>

            </div>

            
            {/* second row */}
            <div className="text-xl sm:text-2xl flex gap-2 font-semibold items-center my-5">
                <div>Vitamins</div>
                <NavLink to="/searched_products/category/vitamins/null" className="text-primary-400 flex items-center gap-2 group hover:opacity-70">
                    <div>All</div>
                    <div className="bg-primary-100 rounded-full w-10 h-10 text-center content-center pl-1"><MdKeyboardArrowRight className="text-3xl group-hover:translate-x-2 transition-transform ease-in-out duration-300" /></div>
                </NavLink>
            </div>
            <div className="">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    {
                        CATEGORY_DATA2.map(({img, heading, category, subCategory}) => (
                            <NavLink key={heading} to={`/searched_products/category/${category}/${subCategory}`} className="text-center full w-20 sm:w-30">
                                <div className="w-full h-full mx-auto rounded-3xl overflow-hidden">
                                    <ImageWithFallback src={img} alt={img} fallbackSrc="/placeholders/no_product.jpg" />
                                </div>
                                <div className="text-gray-700 text-lg py-1">{heading}</div>
                            </NavLink>
                        ))
                    }
                </div>

            </div>


            
            {/* third row */}
            <div className="text-xl sm:text-2xl flex gap-2 font-semibold items-center my-5">
                <div>Health Foods</div>
                <NavLink to="/searched_products/category/health food/null" className="text-primary-400 flex items-center gap-2 group hover:opacity-70">
                    <div>All</div>
                    <div className="bg-primary-100 rounded-full w-10 h-10 text-center content-center pl-1"><MdKeyboardArrowRight className="text-3xl group-hover:translate-x-2 transition-transform ease-in-out duration-300" /></div>
                </NavLink>
            </div>

            <div className="">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    {
                        CATEGORY_DATA3.map(({img, heading, category, subCategory}) => (
                            <NavLink key={heading} to={`/searched_products/category/${category}/${subCategory}`} className="text-center full w-20 sm:w-30">
                                <div className="w-full h-full mx-auto rounded-3xl overflow-hidden">
                                    <ImageWithFallback src={img} alt={img} fallbackSrc="/placeholders/no_product.jpg" />
                                </div>
                                <div className="text-gray-700 text-lg py-1">{heading}</div>
                            </NavLink>
                        ))
                    }
                </div>

            </div>


            {/* bestseller first row */}
            <div className="text-xl sm:text-2xl flex gap-2 font-semibold items-center my-5">
                <div>Bestsellers in Performance Nutrition</div>
                <NavLink to="####" className="text-primary-400 flex items-center gap-2 group hover:opacity-70">
                    <div>All</div>
                    <div className="bg-primary-100 rounded-full w-10 h-10 text-center content-center pl-1"><MdKeyboardArrowRight className="text-3xl group-hover:translate-x-2 transition-transform ease-in-out duration-300" /></div>
                </NavLink>
            </div>
            <div>
                <div className="flex justify-between">
                    {
                        //PRODUCTS.map((product, index) => (
                        //    // give only 6 products
                        //    <div className="w-[14%]">
                        //        <ProductCard
                        //            product={product}
                        //            isCartMutating={false}
                        //            isBestseller={index%3===0}
                        //            isVeg={(index!==1 && index!==3)}
                        //            off={index===2?25:undefined}
                        //        />
                        //    </div>
                        //))
                    }
                </div>
            </div>
        </section>
    )
};

export default Home;