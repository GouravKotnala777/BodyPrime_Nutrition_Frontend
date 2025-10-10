import "../styles/components/components.css";

type fontWeightType = "light"|"medium"|"semibold"|"bold"|"extrabold";
interface SpinnerPropTypes{
    width?:string;
    thickness?:string;
    type?:"primary"|"secondary";
    text?:string;
    fontSize?:string;
    fontWeight?:fontWeightType;
};
const FONT_WEIGHT:Record<fontWeightType, number> = {
    light:100,
    medium:300,
    semibold:500,
    bold:700,
    extrabold:800
};

function Spinner({width, thickness, type, text, fontSize, fontWeight}:SpinnerPropTypes) {

    return(
        <div className="spinner_cont relative" style={{

        }}>
            <div className="spinner w-full h-full mx-auto"
                style={{
                    width:width?width:"20px",
                    height:width?width:"20px",
                    border:thickness?`${thickness} solid #f44769`:"2px solid #f44769",
                    borderTop:thickness?`${thickness} solid transparent`:"2px solid transparent",
                    ...(type==="secondary"&&{
                        borderBottom:thickness?`${thickness} solid transparent`:"2px solid transparent"
                    })
                }}
            >
            </div>
            <span className="spinner_text absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-gray-600" style={{
                fontWeight:fontWeight?FONT_WEIGHT[fontWeight]:300,
                fontSize:fontSize?fontSize:"unset"
            }}>{text}</span>
        </div>
    )
};

export default Spinner;