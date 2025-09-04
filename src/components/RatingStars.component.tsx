

function RatingStars({rating, outOf}:{rating:number; outOf:number;}) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStar = outOf - fullStars - (hasHalf?1:0);

    return(
        <div className="flex">
            {
                Array.from({length:fullStars}).map((_, index) => (
                    <span key={index}>⭐</span>
                ))
            }
            {
                hasHalf && <span>💫</span>
            }
            {
                Array.from({length:emptyStar}).map((_, index) => (
                    <span key={index}>⭕</span>
                ))
            }

        </div>
    )
};

export default RatingStars;