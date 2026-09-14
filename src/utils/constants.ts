

export const buttonNames = {
    addToCartHandler:"addToCartHandler",
    addToWishlistHandler:"addToWishlistHandler"
};

export const MIN_PRICE_INITIALLY = 0;
export const MAX_PRICE_INITIALLY = 10000;

//["protein", "Mass Gainer", "Fat Burner", "Beauty Wellness", "Vitamins", "Minerals", "pre-workout", "fatty acids", "ayurvedic", "other"]
export const FILTER_CATEGORIES_OBJECT = [
    {heading:"Protein", category:"protein"},
    {heading:"Weight Management", category:"weight"},
    {heading:"Pre-Workout", category:"pre-workout"},
    {heading:"Vitamins", category:"vitamins"},
    {heading:"Minerals", category:"minerals"},
    {heading:"Essential Fatty Acids", category:"fatty acids"},
    {heading:"Ayurvedic", category:"ayurvedic"},
    {heading:"Digestive Health", category:"wellness"},
    {heading:"Health Foods", category:"health food"},
];
export const FILTER_SUB_CATEGORIES_OBJECT = {
    protein:[
        {heading:"Whey Protein", subCategory:"whey"},
        {heading:"Yeast Protein", subCategory:"yeast"},
        {heading:"Plant Protein", subCategory:"plant"},
        {heading:"Whey Isolate", subCategory:"isolate"},
        {heading:"Whey Concentrate", subCategory:"concentrate"},
        {heading:"Whey Hydrolyzed", subCategory:"Hydrolyzed"},
    ],
    weight:[
        {heading:"Mass Gainer", subCategory:"mass gainer"},
        {heading:"Fat Burner", subCategory:"fat burner"}
    ],
    "pre-workout":[
        {heading:"Creatine", subCategory:"creatine"},
        {heading:"Caffeine", subCategory:"caffeine"},
        {heading:"L-Citrulline", subCategory:"l-citrulline"},
        {heading:"Beta-Alanine", subCategory:"beta-alanine"},
        {heading:"L-Tyrosine", subCategory:"l-tyrosine"},
        {heading:"Betaine", subCategory:"betaine"},
        {heading:"Electrolytes", subCategory:"electrolytes"},
    ],
    vitamins:[
        {heading:"Vitamin A", subCategory:"vitamin a"},
        {heading:"Vitamin B Complex", subCategory:"vitamin b"},
        {heading:"Vitamin C", subCategory:"vitamin c"},
        {heading:"Vitamin D", subCategory:"vitamin d"},
        {heading:"Vitamin E", subCategory:"vitamin e"},
        {heading:"Vitamin F", subCategory:"vitamin f"},
    ],
    minerals:[
        {heading:"Magnesium Glycinate", subCategory:"magnesium glycinate"},
        {heading:"Magnesium Citrate", subCategory:"magnesium citrate"},
        {heading:"Magnesium Oxide", subCategory:"magnesium oxide"},
        {heading:"Zinc", subCategory:"zinc"},
        {heading:"Calcium", subCategory:"calcium"},
        {heading:"Iron", subCategory:"iron"},
        {heading:"Potassium", subCategory:"potassium"},
    ],
    "fatty acids":[
        {heading:"Fish Oil", subCategory:"fish oil"},
        {heading:"Krill Oil", subCategory:"krill oil"},
        {heading:"Flaxseed Oil", subCategory:"flaxseed oil"},
        {heading:"Omega 3", subCategory:"omega 3"},
    ],
    ayurvedic:[
        {heading:"Ashwagandha", subCategory:"ashwagandha"},
        {heading:"Shilajit", subCategory:"shilajit"},
        {heading:"Brahmi", subCategory:"brahmi"},
        {heading:"Tribulus", subCategory:"tribulus"},
    ],
    wellness:[
        {heading:"Probiotics", subCategory:"probiotics"},
        {heading:"Prebiotics", subCategory:"prebiotics"},
        {heading:"Fiber Supplements", subCategory:"fiber"},
        {heading:"Liver Support", subCategory:"liver"},
        {heading:"Immune Support", subCategory:"immune"},
        {heading:"Sleep & Relaxation", subCategory:"sleep"},
        {heading:"Antioxidants", subCategory:"antioxidants"},
    ],
    "health food":[
        {heading:"Oats", subCategory:"grain"},
        {heading:"Peanuts", subCategory:"legumes"},
        {heading:"Almonds", subCategory:"nut"},
        {heading:"Cashews", subCategory:"nut"},
        {heading:"Pistachios", subCategory:"nut"},
        {heading:"Hazelnuts", subCategory:"nut"},
        {heading:"Apple Cider Vineger", subCategory:"vineger"},
        {heading:"Protein Bars", subCategory:"bar"},
        {heading:"Yogurt", subCategory:"yogurt"},
        {heading:"Soy Milk", subCategory:"milk"},
        {heading:"Fortified Oat", subCategory:"milk"}
    ]
}
//const CATEGORIES = [
//    ["protein", "Mass Gainer", "Fat Burner", "Beauty Wellness", "Vitamins", "Minerals", "pre-workout", "fatty acids", "ayurvedic", "other"]
//    {heading:"Plant Protein", category:"protein", subCategory:"plant"},
//    {heading:"Whey Protein", category:"protein", subCategory:"whey"},
//    {heading:"Yeast Protein", category:"protein", subCategory:"yeast"},
//    {heading:"Mass Gainer", category:"weight", subCategory:"mass gainer"},
//    {heading:"Fat Burner", category:"weight", subCategory:"fat burner"},
//    {heading:"Fat Burner", category:"weight", subCategory:"fat burner"},
//];