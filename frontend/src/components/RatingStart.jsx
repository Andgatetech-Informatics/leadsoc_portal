
export const StarRating = ({ field, rating, onRate }) => {
    const handleStarClick = (index, e) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const isHalf = e.clientX - left < width / 2;
        const value = isHalf ? index - 0.5 : index;
        onRate(field, value);
    };

    return (
        <div className="flex space-x-1 mt-1">
            {[1, 2, 3, 4, 5].map((index) => {
                let fill = "none";
                if (rating >= index) fill = "#facc15";
                else if (rating >= index - 0.5) fill = "url(#half-gradient)";

                return (
                    <svg
                        key={index}
                        className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
                        viewBox="0 0 24 24"
                        onClick={(e) => handleStarClick(index, e)}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="half-gradient">
                                <stop offset="50%" stopColor="#facc15" />
                                <stop offset="50%" stopColor="white" stopOpacity="1" />
                            </linearGradient>
                        </defs>
                        <path
                            fill={fill}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        />
                    </svg>
                );
            })}
        </div>
    );
};