import { useState } from "react";

export function IPDisplay({ ip }: { ip: string }) {
    const [show, setShow] = useState(false);
    return (
        <span
            onClick={(e) => {
                e.stopPropagation();
                setShow(!show);
            }}
            className="cursor-pointer hover:text-indigo-500 transition-colors select-none"
            title="Click to toggle IP visibility"
        >
            {show ? ip : '***.***.***.***'}
        </span>
    );
}
