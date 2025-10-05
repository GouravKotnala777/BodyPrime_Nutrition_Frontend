import { useEffect, useState } from "react";
import { verifyEmail } from "../apis/user.api";
import { useParams } from "react-router-dom";


function Verification() {
    const {emailVerificationToken} = useParams();
    const [response, setResponse] = useState<{success:boolean; message:string;}>({success:false, message:""});


    async function verifyEmailHandler() {
        if (!emailVerificationToken) throw new Error("emailVerificationToken not found");
        const res = await verifyEmail({emailVerificationToken});
        console.log(res);

        setResponse(res);

        if (res.success) {
            setTimeout(() => {
                window.location.href = "/home";
            }, 1000);
        }
    }

    useEffect(() => {
        verifyEmailHandler();
    }, []);

    return(
        <div className="border-2 border-red-500">
            <h1 className="border-2 text-center text-2xl">Email Verification</h1>
            <h3 className="border-2 text-center text-xl">{emailVerificationToken}</h3>
            <pre>{JSON.stringify(response, null, `\t`)}</pre>
        </div>
    )
};

export default Verification;