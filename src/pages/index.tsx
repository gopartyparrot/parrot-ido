import usePool from '../hooks/usePool'
import React from 'react'
import { Header } from '../components/header'
import ContributionCard from '../components/ido/ContributionCard'
import Slider, { Settings } from 'react-slick'
import RedeemCard from '../components/ido/RedeemCard'

const settings: Settings = {
  dots: true,
  centerMode: true,
  swipeToSlide: false,
  swipe: false,
  infinite: false,
  slidesToScroll: 1,
  autoplay: false,
  centerPadding: '0px',
  slidesToShow: 1,
  arrows: false,
  variableWidth: true,
  appendDots: (dots) => (
    <div>
      <ul className="w-full flex justify-center items-center my-4 space-x-2">
        {' '}
        {dots}{' '}
      </ul>
    </div>
  ),
}

const Main = () => {
  const { startIdo, endIdo } = usePool()

  return (
    <main className="flex-1">
      <Slider {...settings} className="center my-6">
        <div className="w-full sm:w-card">
          <ContributionCard round="1" />
        </div>
        <div className="w-full sm:w-card">
          <ContributionCard round="2" />
        </div>
        <div className="w-full sm:w-card">
          <RedeemCard />
        </div>
      </Slider>
    </main>
  )
}

const Page: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-scaffold">
      <Header />
      <Main />
    </div>
  )
}

export default Page
