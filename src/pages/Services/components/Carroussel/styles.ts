import styled, { css } from 'styled-components';
import { SwiperSlide } from 'swiper/react';

interface ISliderProps {
  imagePath: string;
}

export const Slider = styled(SwiperSlide)<ISliderProps>`
  ${({ imagePath }) => css`
    text-align: center;
    font-size: 18px;

    background: url(${imagePath}) no-repeat center;
    background-size: cover;

    border-radius: 8px;

    /* filter: grayscale(85%); */

    display: flex;
    align-items: flex-end;
  `}
`;
