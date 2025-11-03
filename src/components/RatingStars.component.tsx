import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";


function RatingStars({rating, outOf}:{rating:number; outOf:number;}) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStar = outOf - fullStars - (hasHalf?1:0);

    return(
        <div className="flex text-[1.4rem] text-yellow-500">
            {
                Array.from({length:fullStars}).map((_, index) => (
                    <span key={index}><IoIosStar /></span>
                ))
            }
            {
                hasHalf && <span><IoIosStarHalf /></span>
            }
            {
                Array.from({length:emptyStar}).map((_, index) => (
                    <span key={index}><IoIosStarOutline /></span>
                ))
            }

        </div>
    )
};

export default RatingStars;