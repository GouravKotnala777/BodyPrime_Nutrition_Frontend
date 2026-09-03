import { useEffect, useState, type ChangeEvent } from "react";
import { createReview } from "../apis/review.api";
import { BiRefresh, BiSolidStar } from "react-icons/bi";
import Spinner from "./Spinner.component";


function RatingFormModal() {
    const [rating, setRating] = useState<number>(0);
    const [hoveringStarIndex, setHoveringStarIndex] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [isReviewMutating, setIsReviewMutating] = useState<boolean>(false);
    const [ratingFormModalEventData, setRatingFormModalEventData] = useState<{isReviewCardOpen:boolean; productID:string;}>({isReviewCardOpen:false, productID:""});



    async function createReviewHandler() {
        setIsReviewMutating(true);
        if (!ratingFormModalEventData.productID) return;
        
        console.log({productID:ratingFormModalEventData.productID, rating, comment});
        
        
        const res = await createReview({productID:ratingFormModalEventData.productID, rating, comment});
        
        console.log(res);
        setIsReviewMutating(false);
    };

    function resetReviewForm() {
        setRating(0);
        setComment("");
    };

    function closeRatingFormModal() {
        setRatingFormModalEventData({isReviewCardOpen:false, productID:""});
    };

    function onChangeCommentHandler(e:ChangeEvent<HTMLTextAreaElement>) {
        setComment(e.target.value);
    };

    function receiveRatingFormModalEvent(event:Event) {
        const customEvent = (event as CustomEvent<{isReviewCardOpen:boolean; productID:string;}>);
        console.log(customEvent.detail);
        setRatingFormModalEventData({...customEvent.detail});
    };

    useEffect(() => {
        window.addEventListener("toggleReviewCard", receiveRatingFormModalEvent);
        return() => window.removeEventListener("toggleReviewCard", receiveRatingFormModalEvent);
    }, []);
    useEffect(() => {
        document.body.style.overflow = ratingFormModalEventData.isReviewCardOpen ? "hidden" : "auto";
    }, [ratingFormModalEventData]);
    
    return(
        <div className={`fixed top-0 left-0 w-full h-full bg-black/70 grid place-items-center ${ratingFormModalEventData.isReviewCardOpen?"scale-y-100 opacity-100":"scale-y-0 opacity-0"} z-100`}
            onClick={closeRatingFormModal}
        >
            <div className="bg-white w-full max-w-md h-md p-4 rounded-xl relative" onClick={(e) => e.stopPropagation()}>
                <button className="bg-white text-gray-700 w-min py-2.5 px-4.5 rounded-md hidden sm:inline absolute -top-14 right-0 hover:bg-red-500/70 hover:text-white transition-all ease-out duration-75" onClick={closeRatingFormModal}>X</button>
                <div className="flex gap-4">
                    <div className="w-full text-lg font-semibold text-center py-2">Give Review</div>
                </div>
                {/* stars hovering and selected */}
                <div className="flex text-5xl justify-center my-2 py-2">
                    {
                        Array.from({length:5}).map((_,num) => (
                            <span className=""
                                key={num}
                                onClick={() => (rating === num+1) ? setRating(0) : setRating(num+1)}
                                onMouseEnter={() => setHoveringStarIndex(num+1)}
                                onMouseLeave={() => setHoveringStarIndex(0)}
                            ><BiSolidStar
                                className={`
                                    ${(rating > 0) && (rating-num > 0) ?
                                        num<rating && "text-yellow-400"
                                        :
                                        num<hoveringStarIndex ? "text-primary-400":"text-gray-300"
                                    }
                                    ${hoveringStarIndex===(0) ?
                                        "sm:translate-y-0"
                                        :
                                        hoveringStarIndex===(num+1) ?
                                            "sm:-translate-y-5"
                                            :
                                            (hoveringStarIndex===(num) || hoveringStarIndex===(num+2)) ?
                                                "sm:-translate-y-2.5"
                                                :
                                                "sm:translate-y-0"
                                    }
                                    scale-70 transition-all ease-out duration-500
                                `}
                                
                            /></span>
                        ))
                            
                        
                    }
                </div>
                {/* comment field */}
                <div className="relative mt-4 rounded-md">
                    <textarea rows={5} maxLength={100} className="border border-gray-200 text-gray-700 font-mono w-full py-1.5 px-3 rounded-sm" placeholder="Comment...(optional)" value={comment} onChange={onChangeCommentHandler}></textarea>
                    <div className={`absolute block -top-2 -right-2 size-4.5 bg-primary-500 rounded-full ${comment.length===100&&"animate-ping"}`}></div>
                    <span className={`absolute -top-3 -right-3 size-6.5 text-center content-center bg-white border ${comment.length===100?"text-primary-500":"text-gray-500"}  text-xs font-semibold font-mono rounded-full`}>{100-comment.length}</span>
                </div>
                {/* submit and reset button */}
                <div className="flex gap-4 mt-4 relative">
                    <button className="border border-primary-400 bg-primary-400 text-white font-semibold w-full py-2.5 rounded-md hover:opacity-80" disabled={isReviewMutating} onClick={createReviewHandler}>{isReviewMutating?<div className="w-max mx-auto"><Spinner width="20px" color="white" type="secondary" /></div>:"Submit"}</button>
                    <button className="border border-primary-400 text-primary-400 font-semibold w-min py-2.5 px-4 rounded-md hover:opacity-80 group" disabled={isReviewMutating} onClick={resetReviewForm}><BiRefresh className="text-2xl group-hover:rotate-180 transition-transform ease-out duration-300" /></button>
                </div>
            </div>
        </div>
    )
};

export default RatingFormModal;