import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";
import {useCallback, useEffect, useRef} from "react";


interface ScrollingProps {
    children: React.ReactNode;
}

const ScrollingBox = styled(Box)(() => ({
    height: `calc(100vh - 190px)`,
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#888",
        borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#555",
    },
    "&::-webkit-scrollbar-corner": {
        backgroundColor: "transparent",
    },
}));

const Scrolling = ({children}: ScrollingProps) => {
    const scrollingReference = useRef<HTMLDivElement>(null);
    const scrollToBottom = useCallback(() => {
        if(scrollingReference.current){
            scrollingReference.current.scrollTop = scrollingReference.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [scrollToBottom, children]);

    return <ScrollingBox ref={scrollingReference}>{children}</ScrollingBox>;
};
export default Scrolling;