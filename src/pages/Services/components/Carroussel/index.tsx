import React from 'react';

import { Button, Flex, Text } from '@chakra-ui/core';
import { Pagination, Autoplay } from 'swiper';
import { Swiper } from 'swiper/react';

import glassImg from '../../../../assets/services/glass.jpg';
import sanitizationInteriorImg from '../../../../assets/services/higienizacao_interior.jpg';
import autoPolishmentImg from '../../../../assets/services/polimento.jpeg';
import { Slider } from './styles';

import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/autoplay/autoplay.min.css';

const Carroussel = () => (
  <Swiper
    spaceBetween={50}
    slidesPerView={1}
    onSlideChange={() => console.log('slide change')}
    onSwiper={swiper => console.log(swiper)}
    pagination={{
      dynamicBullets: true,
    }}
    modules={[Pagination, Autoplay]}
    className="mySwiper"
    autoplay
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
            lg: 'block',
            xl: 'block',
          }}
          fontSize={22}
          mt={4}
          textAlign="left"
          fontWeight="normal"
        >
          Nano proteção não é um serviço ou um produto de marca, é uma
          tecnologia de fabricação de produtos. É a capacidade do produto
          interagir e penetrar nos poros do material em questão. As Nano
          proteções de pintura, interagem quimicamente com o verniz, através de
          ligações iônicas ou covalentes. Por isso oferece uma durabilidade
          variável e em média muito mais longa do que as ceras.
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
            lg: 'block',
            xl: 'block',
          }}
          fontSize={22}
          mt={4}
          textAlign="left"
          fontWeight="normal"
        >
          É a aplicação de um produto hidratante ao couro dos bancos do veículo.
          É usado para preservar as características do couro como a textura,
          cheiro e cor originais. Protege o couro de ressecamento, trincas e de
          rachaduras ao longo do tempo causados pela exposição à luz solar, ar
          condicionado e até mesmo o suor. Deve ser aplicada no mínimo de 6 em 6
          meses. Se não hidratado, pode ocorrer o trincamento do couro.
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
            lg: 'block',
            xl: 'block',
          }}
          fontSize={22}
          mt={4}
          textAlign="left"
          fontWeight="normal"
        >
          A higienização do interior é um serviço completo de limpeza que
          higieniza profundamente todo o interior do veículo eliminando as
          sujeiras mais difíceis de alcançar. Ela se dá pela utilização de
          equipamentos e acessórios próprios para essa função. Lava-se banco,
          forro de porta, carpete, painel, teto e porta malas.
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
