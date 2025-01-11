import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";

interface ScrollingProps {
  children: React.ReactNode;
  scrollToTop?: boolean;
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

const Scrolling = ({ children, scrollToTop = false }: ScrollingProps) => {
  const scrollingReference = useRef<HTMLDivElement>(null);

  const scrollToPosition = useCallback(() => {
    if (scrollingReference.current) {
      if (scrollToTop) {
        scrollingReference.current.scrollTop = 0;
      } else {
        scrollingReference.current.scrollTop = scrollingReference.current.scrollHeight;
      }
    }
  }, [scrollToTop]);

  useEffect(() => {
    scrollToPosition();
  }, [scrollToPosition, children, scrollToTop]);

  return <ScrollingBox ref={scrollingReference}>{children}</ScrollingBox>;
};

export default Scrolling;
