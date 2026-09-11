import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";


interface RangeInputInterface{
    minState:number;
    setMinState:Dispatch<SetStateAction<number>>;
    maxState:number;
    setMaxState:Dispatch<SetStateAction<number>>;
    minValue:number;
    maxValue:number;
    thumbSize?:"xxs"|"xs"|"sm"|"md"|"lg"|"xl";
    rangeThickness?:"xs"|"sm"|"md"|"lg"|"xl";
    onChangeHandlers:{
        minChangeHandler?(e:ChangeEvent<HTMLInputElement>):void;
        maxChangeHandler?(e:ChangeEvent<HTMLInputElement>):void;
    }
};

const applyThumbSize = {
    xxs:"[&::-webkit-slider-thumb]:size-2",
    xs:"[&::-webkit-slider-thumb]:size-2.5",
    sm:"[&::-webkit-slider-thumb]:size-3",
    md:"[&::-webkit-slider-thumb]:size-3.5",
    lg:"[&::-webkit-slider-thumb]:size-4",
    xl:"[&::-webkit-slider-thumb]:size-4.5",
};
const applyRangeThickness = {
    xs:"h-0.25",
    sm:"h-0.5",
    md:"h-0.75",
    lg:"h-1",
    xl:"h-1.5",
};


function RangeInput({
    minState, setMinState, maxState, setMaxState, minValue, maxValue,
    thumbSize="md", rangeThickness="md",
    onChangeHandlers

}:RangeInputInterface) {

    function convertPxtoPercentage(iter:number, minInput:number, maxInput:number) {
        return(0 + ((iter-minInput) * (100-0)) / (maxInput-minInput));
    };
    
    return(
        <div className="w-full">
            <div className="relative h-6">
                {/* Track */}
                <div className={`absolute top-1/2 ${applyRangeThickness[rangeThickness]} w-full -translate-y-1/2 rounded-full bg-gray-300`} />

                {/* Selected range */}
                <div
                className={`absolute top-1/2 ${applyRangeThickness[rangeThickness]} -translate-y-1/2 rounded-full bg-blue-500`}
                style={{
                    left: `${convertPxtoPercentage(minState, minValue, maxValue)}%`,
                    right: `${100-convertPxtoPercentage(maxState, minValue, maxValue)}%`,
                }}
                />

                {/* Minimum thumb */}
                <input
                name="minPrice"
                type="range"
                min={minValue}
                max={maxValue}
                value={minState}
                onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value < maxState) setMinState(value);
                    if (onChangeHandlers.minChangeHandler) {
                        onChangeHandlers.minChangeHandler(e);
                    }
                }}
                className={`pointer-events-none absolute top-1/2 w-full -translate-y-1/2 appearance-none bg-transparent
                    [&::-webkit-slider-thumb]:pointer-events-auto
                    ${applyThumbSize[thumbSize]}
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-blue-500
                    hover:[&::-webkit-slider-thumb]:bg-blue-400
                    cursor-grab active:cursor-grabbing
                    `}
                />

                {/* Maximum thumb */}
                <input
                name="maxPrice"
                type="range"
                min={minValue}
                max={maxValue}
                value={maxState}
                onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > minState) setMaxState(value);
                    if (onChangeHandlers.maxChangeHandler) {
                        onChangeHandlers.maxChangeHandler(e);
                    }
                }}
                className={`pointer-events-none absolute top-1/2 w-full -translate-y-1/2 appearance-none bg-transparent
                    [&::-webkit-slider-thumb]:pointer-events-auto
                    ${applyThumbSize[thumbSize]}
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-blue-500
                    hover:[&::-webkit-slider-thumb]:bg-blue-400
                    cursor-grab active:cursor-grabbing
                    `}
                />
            </div>
        </div>
    )
};

export default RangeInput;