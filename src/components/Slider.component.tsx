import { useEffect, useRef, useState, type ReactNode } from "react";




interface SliderPropTypes{
    style?:string;
    contents:ReactNode[];
    btns?:{
      inset?:"-30"|"-15"|"0"|"15"|"30";
      size?:"1"|"2"|"3"|"4";
    };
    animation?:{
      isAutomatic?:boolean;
      duration?:500|1000|2000|3000|4000;
    };
};

const btnSizeConfiguration = {
  1:20,
  2:30,
  3:40,
  4:50
};

function Slider({style, contents, btns={size:"3"}, animation={isAutomatic:false, duration:3000}}:SliderPropTypes) {
  const leftBtnRef = useRef<HTMLButtonElement|null>(null);
  const rightBtnRef = useRef<HTMLButtonElement|null>(null);
  const screenRef = useRef<HTMLDivElement|null>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0);


  function slideHandler(btnName: "left" | "right") {
    if (!screenRef.current) throw Error("screenRef not found");

    const screenElement = screenRef.current;
    let newIndex = slideIndex;

    if (btnName === "left") {
      newIndex = slideIndex === 0 ? 4 : slideIndex - 1;
    }
    else if (btnName === "right") {
      newIndex = slideIndex === 4 ? 0 : slideIndex + 1;
    }
    else {
      throw Error("btnName galat hai");
    }

    setSlideIndex(newIndex);
    screenElement.style.transform = `translateX(-${newIndex * 100}%)`;
  };


  useEffect(() => {
    if (!animation.isAutomatic) return;
    
    let interval = setInterval(() => {
      slideHandler("right");
    }, animation.duration);

    return() => clearInterval(interval);
  }, [slideHandler]);
 

  return (
    <section className={`relative ${style}`}>
      <button ref={leftBtnRef} className={`border-2 border-amber-300 absolute top-[50%] translate-y-[-50%] bg-neutral-500 max-w-[50px] max-h-[50px] grid place-items-center rounded-4xl opacity-60 hover:bg-neutral-400 cursor-pointer z-1`}
        style={{
          left:`${btns.inset}px`,
          width:`${btnSizeConfiguration[(btns.size||3)]}px`,
          height:`${btnSizeConfiguration[(btns.size||3)]}px`
        }}
        onClick={() => slideHandler("left")}
      ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`size-${Number(btns.size)+2}`}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      </button>
      <div className="h-full overflow-hidden z-0">
        <div ref={screenRef} className="flex h-full transition-transform duration-1000" >
        {
          contents.map((content, index) => (
            <div key={index} className="min-w-full min-h-full grid place-items-center text-5xl text-neutral-500">{content}</div>
          ))
        }
        </div>
      </div>
      <button ref={rightBtnRef} className={`border-2 border-amber-300 absolute top-[50%] translate-y-[-50%] bg-neutral-500 max-w-[50px] max-h-[50px] grid place-items-center rounded-4xl opacity-60 hover:bg-neutral-400 cursor-pointer z-1`}
        style={{
          right:`${btns.inset||"0"}px`,
          width:`${btnSizeConfiguration[(btns.size||3)]}px`,
          height:`${btnSizeConfiguration[(btns.size)||3]}px`
        }}
        onClick={() => slideHandler("right")}
      ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`size-${(Number(btns.size))+2}`}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
      </button>
    </section>
  )
}

export default Slider;
