import { useEffect, useState } from "react";




function RumbleText({finalText, interval, restart}:{finalText:string; interval:number; restart:boolean;}) {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        if (!restart) {
            console.log("123423456789098765456789");
            return;
        }

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let fixed = 0;
        let frame = 0;

        const intervalID = setInterval(() => {
            frame++;

            // Lock a new character every 6 frames
            if (frame % 6 === 0) {
                fixed++;
            }

            let output = "";

            for (let i = 0; i < finalText.length; i++) {
                if (finalText[i] === " ") {
                output += " ";
                } else if (i < fixed) {
                output += finalText[i];
                } else {
                output += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            setText(output);

            if (fixed >= finalText.length) {
                clearInterval(intervalID);
                setText(finalText);
            }
            }, interval);


        return () => clearInterval(intervalID);
    }, [restart]);

    return(text);
};

export default RumbleText;