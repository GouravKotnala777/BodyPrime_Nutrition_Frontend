import Spinner from "../components/Spinner.component";
import { BiDownArrow } from "react-icons/bi";
import { FcCancel } from "react-icons/fc";

interface ButtonPrimaryPropTypes{
    isLoading:boolean;
    isSuccess:boolean;
    isDisabled:boolean;
    onClickHandler:()=>void;
};

export function ButtonPrimary({isLoading, isSuccess, isDisabled, onClickHandler}:ButtonPrimaryPropTypes) {

    return(
        <div className="text-center">
            <button className="px-8 py-3 rounded-[8px] border-1 border-[#f44669]"
                disabled={isDisabled}
                onClick={onClickHandler}
                style={{
                    opacity:isDisabled?0.2:1
                    //border:isDisabled?"1px solid #ffabbc":"1px solid #f44669"
                }}
            >
                {
                    isLoading ?
                        <Spinner />
                        :
                        isSuccess ?
                            <BiDownArrow />
                            :
                            <FcCancel />
                }
            </button>
        </div>
    )
}