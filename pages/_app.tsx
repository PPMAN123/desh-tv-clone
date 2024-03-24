import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {opacity: 0}
  100% {opacity: 1}
`;

const fadeOut = keyframes`
  0% {opacity: 1}
  100% {opacity: 0}
`;

const StyledWrapper = styled.div<{ leavingScreen: boolean }>`
  animation-name: ${({ leavingScreen }) => (leavingScreen ? fadeOut : fadeIn)};
  animation-duration: 0.5s;
`;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [leavingScreen, setLeavingScreen] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter == 0) {
      setLeavingScreen(true);
      setTimeout(() => {
        setLeavingScreen(false);
        setCounter(1);
      }, 500);
    }
  }, [pageProps]);

  return (
    <SessionProvider session={session}>
      <StyledWrapper leavingScreen={leavingScreen}>
        <Component {...pageProps} />
      </StyledWrapper>
    </SessionProvider>
  );
}
