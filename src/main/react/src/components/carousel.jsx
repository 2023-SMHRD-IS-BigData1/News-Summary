import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ItemsCarousel from 'react-items-carousel';
import ModalPortal from "./portal";
import Modal from './modal';
import { format, register } from 'timeago.js' //임포트하기 register 한국어 선택
import koLocale from 'timeago.js/lib/lang/ko' //한국어 선택
import { useNewsContext, useNewsViewContext, useTodayNewsContext } from '../data/news-data.context';

register('ko', koLocale);

// 캐러셀 임시 데이터 및 딜레이/width
const noOfItems = 19;
const noOfCards = 3;
const autoPlayDelay = 3000;
const chevronWidth = 40;

const Wrapper = styled.div`
  padding: 0 ${chevronWidth}px;
  max-width: 1300px;
  margin: 0 auto;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.background1};
  border-color: ${({ theme }) => theme.boardBorder1};
  @media screen and (max-width: 1340px) {max-width: 1210px;}
  @media screen and (max-width: 1240px) {max-width: 1110px;}
  @media screen and (max-width: 1140px) {max-width: 1010px;}
  @media screen and (max-width: 1040px) {max-width: 910px;}
  @media screen and (max-width: 940px) {max-width: 810px;}
  @media screen and (max-width: 840px) {max-width: 710px;}
  @media screen and (max-width: 740px) {max-width: 610px;}
  @media screen and (max-width: 640px) {max-width: 510px;}
  @media screen and (max-width: 540px) {max-width: 410px;}
`;

const SlideItem = styled.div`
  height: 500px;
  padding: 10px;
  border: 1px solid #99999999;
  display: flex;
  flex-direction: column;
`;

const NewsImageBox = styled.div`
    height: 200px;
    margin-bottom: 10px;
    overflow: hidden;
    background-color: #ffffff;
    border: 1px solid #99999944;
`;

const NewsImage = styled.img`
    width: 100%;
    object-fit:cover;
`;

const SubTextBox = styled.div`
  width: 100%;
  height: 30px;
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubDate = styled.div`
  color: #999999;
`;

const SubCategory = styled.div`
  padding: 5px 20px;
  border-radius: 5px;
  background-color: #F4A261;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NewsTitle = styled.div`
    height: 54px;
    overflow: hidden;
    font-size: 26px;
    font-weight: 600;
    margin: 10px;
    white-space: normal;
    word-wrap: break-word;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;


const NewsContent = styled.div`
    width: 100%;
    height: 150px;
    padding: 10px;
    font-size: 18px;
    overflow: hidden;
    line-height: 1.3;
    white-space: pre-wrap;
    word-wrap: break-word;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
`;

const CarouselButton = styled.button`
    width: 24px;
    height: 48px;
    font-size: 26px;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.background1};
    border-color: ${({ theme }) => theme.boardBorder1};
    border: 1px solid #99999944;
    &:hover{
        color: #ffffff;
        background-color: #f0be4d;
        border: none;
        transition: 0.5s;
    }
`;



export default function AutoPlayCarousel() {
  const { newsData, loading } = useNewsContext();
  // const { newsData, loading } = useTodayNewsContext();
  const { newsViewData, viewLoading } = useNewsViewContext();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [modalOn, setModalOn] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [numOfCards, setNumOfCards] = useState(3);

  let userData;
  let userEmailData;
  const userDataString = sessionStorage.getItem('userData');


  if (userDataString) {
    userData = JSON.parse(userDataString);
    userEmailData = userData.userEmail;
  }

  const resize = () => { // window 사이즈 변경되었을 때 실행되는 함수
    const width = window.innerWidth;
    if (width < 740) {
      setNumOfCards(1);
    } else if (width < 1340) {
      setNumOfCards(2);
    } else {
      setNumOfCards(3);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, autoPlayDelay);

    return () => {
      clearInterval(interval);
    };
  }, [activeItemIndex, newsData]);

  const tick = () => {
    // 만약 sortedNewsData가 존재하고 길이가 1 이상인 경우에만 실행
    if (newsData && newsData.length > 0) {
      // 현재 activeItemIndex를 업데이트하여 다음 항목으로 이동
      setActiveItemIndex((prevIndex) => (prevIndex + 1) % (noOfItems - noOfCards + 1));
    }
  };

  const onChange = (value) => {
    setActiveItemIndex(value);
  };

  const handleModal = async (item) => {
    setSelectedItem(item);
    setModalOn(true);

    // API 호출 등을 통해 viewCount를 1 증가시키는 작업 수행
    try {
      if (userEmailData) {
        const response = await axios.get(`/api/news/detail/${item.id}?userEmail=${userEmailData}`);
      } else {
        const response = await axios.get(`/api/news/detail/${item.id}`);
      }
      const { setNewsData } = useNewsViewContext();
      useEffect(() => {
        setNewsData(response.data);
        console.log('데이터가 성공적으로 로드되었습니다:', response.data);
      }, [response.data, setNewsData]);

    } catch (error) {
      console.error('데이터 로드 중 오류 발생:', error);
    }
  };

  // newsData가 있는 경우에만 실행
  const sortedNewsData = newsData && newsData
    // articleWriteTime을 기준으로 내림차순 정렬
    .sort((a, b) => new Date(b.articleWriteTime) - new Date(a.articleWriteTime))
    // 상위 20개 항목 선택
    .slice(0, 20);


  // 가져온 데이터를 사용하여 UI를 렌더링
  const carouselItems = sortedNewsData && sortedNewsData.map((item, index) => (
    <SlideItem key={item.id} onClick={() => handleModal(item)}>
      <NewsImageBox>
        <NewsImage src={item.picture} />
      </NewsImageBox>
      <SubTextBox>
        <SubCategory>{item.category}</SubCategory>
        <SubDate>{format(new Date(item.articleWriteTime), 'ko')}</SubDate>
      </SubTextBox>
      <NewsTitle>{item.title}</NewsTitle>
      <NewsContent>{item.summary}</NewsContent>
    </SlideItem>
  ));




  return (
    <Wrapper>
      <ItemsCarousel
        gutter={12}
        numberOfCards={numOfCards}
        activeItemIndex={activeItemIndex}
        requestToChangeActive={onChange}
        rightChevron={<CarouselButton>{'⟩'}</CarouselButton>}
        leftChevron={<CarouselButton>{'⟨'}</CarouselButton>}
        chevronWidth={chevronWidth}
        outsideChevron
        children={carouselItems}
      />
      <ModalPortal>
        {modalOn && <Modal item={selectedItem} onClose={() => setModalOn(false)} />}
      </ModalPortal>
    </Wrapper>
  );
};
