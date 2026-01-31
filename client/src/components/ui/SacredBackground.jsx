import React from 'react';
import styled, { keyframes } from 'styled-components';
import Lotus from './assets/lotus-guide.png'; // A floating character version of the lotus

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
`;

const FlowerOfLife = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  animation: ${pulse} 20s infinite;
`;

const FloatingLotus = styled.img`
  position: absolute;
  bottom: 10%;
  right: 5%;
  height: 120px;
  animation: ${float} 6s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
`;

function SacredBackground() {
  return (
    <BackgroundWrapper>
      <FlowerOfLife viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Simple sacred pattern using circles */}
        {[...Array(10)].map((_, i) => (
          <circle key={i} cx="50" cy="50" r={5 + i * 5} />
        ))}
      </FlowerOfLife>
      <FloatingLotus src={Lotus} alt="Lotus Guardian" />
    </BackgroundWrapper>
  );
}

export default SacredBackground;