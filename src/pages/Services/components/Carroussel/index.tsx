import React from 'react';

import { Button, Flex, Text } from '@chakra-ui/core';
import { Pagination, Autoplay, Navigation } from 'swiper';
import { Swiper } from 'swiper/react';

import glassImg from '../../../../assets/services/glass.jpg';
import sanitizationInteriorImg from '../../../../assets/services/higienizacao_interior.jpg';
import autoPolishmentImg from '../../../../assets/services/polimento.jpeg';
import { Slider } from './styles';

import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/autoplay/autoplay.min.css';
import 'swiper/modules/navigation/navigation.min.css';

const Carroussel = () => (
  <Swiper
    spaceBetween={50}
    slidesPerView={1}
    onSlideChange={() => console.log('slide change')}
    onSwiper={swiper => console.log(swiper)}
    pagination={{
      dynamicBullets: true,
    }}
    modules={[Pagination, Autoplay, Navigation]}
    className="mySwiper"
    autoplay={{
      delay: 15000,
    }}
    navigation
  >
    <Slider imagePath={autoPolishmentImg}>
      <Flex
        paddingBottom="32px"
        paddingX={16}
        pt={8}
        height="300px"
        flex={1}
        direction="column"
        alignItems="flex-start"
        style={{
          background: 'linear-gradient(to bottom, #00000029, #000000)',
        }}
      >
        <Flex flexDirection="column" alignItems="flex-start">
          <Text fontSize={28} fontWeight="bold">
            PINTURA
          </Text>
          <Text mt={2} fontSize={16} fontWeight="bold" color="#c7c7c7">
            SELANTES - IONIZAÇÃO - VITRIFICAÇÃO
          </Text>
        </Flex>

        <Text
          display={{
            xs: 'none',
            sm: 'none',
            md: 'none',
            lg: 'none',
            xl: 'block',
          }}
          fontSize={22}
          mt={4}
          textAlign="left"
          fontWeight="normal"
          color="#c7c7c7"
        >
          Os serviços na pintura automotiva são classificados como serviços de
          preparação e serviços de proteção. <br />
          Na preparação realiza-se técnicas de Espelhamento de Pintura.
          <br /> Quando se fala em proteção, a NANOTECH disponibiliza uma
          variedade de produtos, para você não perder nenhuma venda! Temos os
          Selantes, Ionizadores e Vitrificadores. <br />
          Todas as melhores tecnologias de Nano Proteção do mercado, para você
          oferecer a melhor opção ao cliente.
        </Text>

        <Flex
          justifyContent="flex-end"
          alignItems="flex-end"
          flex={1}
          width="100%"
        >
          <Button
            w="200px"
            backgroundColor="#355a9d"
            _hover={{
              backgroundColor: '#5580b9',
            }}
          >
            Saiba mais
          </Button>
        </Flex>
      </Flex>
    </Slider>

    <Slider imagePath={glassImg}>
      <Flex
        paddingBottom="32px"
        paddingX={16}
        pt={8}
        height="300px"
        flex={1}
        direction="column"
        alignItems="flex-start"
        style={{
          background: 'linear-gradient(to bottom, #00000029, #000000)',
        }}
      >
        <Flex flexDirection="column" alignItems="flex-start">
          <Text fontSize={28} fontWeight="bold">
            VIDROS
          </Text>
          <Text mt={2} fontSize={16} fontWeight="bold" color="#c7c7c7">
            CRISTALIZAÇÃO - IMPERMEABILIZAÇÃO
          </Text>
        </Flex>
        <Text
          display={{
            xs: 'none',
            sm: 'none',
            md: 'none',
            lg: 'none',
            xl: 'block',
          }}
          fontSize={22}
          mt={4}
          textAlign="left"
          fontWeight="normal"
          color="#c7c7c7"
        >
          Os serviços nos vidros são divididos em serviços de descontaminação e
          serviços de impermeabilização.
          <br /> A cristalização realiza esta descontaminação, por ação química
          e mecânica, através de processos de polimento.
          <br /> A Impermeabilização se faz com a aplicação de produtos de alta
          tecnologia, que confere a superfície vítrea uma super hidro
          repelência.
        </Text>

        <Flex
          justifyContent="flex-end"
          alignItems="flex-end"
          flex={1}
          width="100%"
        >
          <Button
            w="200px"
            backgroundColor="#355a9d"
            _hover={{
              backgroundColor: '#5580b9',
            }}
          >
            Saiba mais
          </Button>
        </Flex>
      </Flex>
    </Slider>

    <Slider imagePath={sanitizationInteriorImg}>
      <Flex
        paddingBottom="32px"
        paddingX={16}
        pt={8}
        height="300px"
        flex={1}
        direction="column"
        alignItems="flex-start"
        style={{
          background: 'linear-gradient(to bottom, #00000029, #000000)',
        }}
      >
        <Flex flexDirection="column" alignItems="flex-start">
          <Text fontSize={28} fontWeight="bold">
            INTERIORES
          </Text>
          <Text mt={2} fontSize={16} fontWeight="bold" color="#c7c7c7">
            HIGIENIZAÇÃO - IMPERMEABILIZAÇÃO DE TECIDOS - HIDRATAÇÃO DE COUROS -
            VITRIFICAÇÃO DE COUROS
          </Text>
        </Flex>
        <Text
          display={{
            xs: 'none',
            sm: 'none',
            md: 'none',
            lg: 'none',
            xl: 'block',
          }}
          fontSize={22}
          mt={4}
          textAlign="left"
          fontWeight="normal"
          color="#c7c7c7"
        >
          Os serviços no interior do veículo se dividem em Higienização e
          Proteção. Higienização é o serviço primordial para a realização de
          qualquer outro serviço de proteção. As proteções que a NANOTECH
          disponibiliza são: <br />
          Para o couro - Hidratação e Vitrificação <br />
          Para o tecido - Impermeabilização
        </Text>

        <Flex
          justifyContent="flex-end"
          alignItems="flex-end"
          flex={1}
          width="100%"
        >
          <Button
            w="200px"
            backgroundColor="#355a9d"
            _hover={{
              backgroundColor: '#5580b9',
            }}
          >
            Saiba mais
          </Button>
        </Flex>
      </Flex>
    </Slider>
  </Swiper>
);
export default Carroussel;
