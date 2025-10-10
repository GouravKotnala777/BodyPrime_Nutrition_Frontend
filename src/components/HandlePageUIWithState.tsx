import type { ReactNode } from "react";
import Spinner from "./Spinner.component";
import insternalServerErrorImage from "../../public/internal_server_error5.png";

interface HandlePageUIWithStatePropTypes{
    isLoading:boolean;
    isSuccess:boolean;
    error:string;
    errorChildren?:ReactNode;
    children:ReactNode;
};

function HandlePageUIWithState({isLoading, isSuccess, error, errorChildren, children}:HandlePageUIWithStatePropTypes) {

    if (isLoading) return <Spinner text="Loading..." width="100px" fontWeight="bold" thickness="4px" />
    if (error) return (
        errorChildren ?
            errorChildren
            :
            <>
                <img src={insternalServerErrorImage} alt={insternalServerErrorImage} />
                <h1 className="text-center">{error}</h1>
            </>
    )
    if (isSuccess) return children;
};

export default HandlePageUIWithState;