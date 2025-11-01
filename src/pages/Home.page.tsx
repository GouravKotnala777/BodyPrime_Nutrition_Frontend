import {HomeProducts, BestSellers, FeatureProducts} from "../components/HomeProducts.component";


function Home() {
    
    return(
        <section>
            <HomeProducts />

            <h1 className="text-2xl font-semibold text-white mt-10 p-2 bg-gradient-to-br from-[#f44669] to-[#ff7f50]">Best Sellers</h1>
            <BestSellers />

            <h1 className="text-2xl font-semibold text-white mt-10 p-2 bg-gradient-to-br from-[#f44669] to-[#ff7f50]">Feature Products</h1>
            <FeatureProducts />
        </section>
    )
};

export default Home;