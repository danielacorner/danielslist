import React from 'react';
import Tilt from 'react-vanilla-tilt';
import styled from 'styled-components';
import { KijijiLogo } from '../assets/KijijiLogo';
import { LetgoLogo } from '../assets/LetgoLogo';
import { UsedLogo } from '../assets/UsedLogo';

const ItemsStyles = styled.div`
  --responsive-width: 140px;
  grid-column-gap: 10px;
  padding: 12px;
  padding-top: 36px;
  grid-row-gap: 18px;
  @media (min-width: 700px) {
    --responsive-width: 175px;
    grid-column-gap: 20px;
    padding: 24px;
    padding-top: 36px;
    grid-row-gap: 24px;
  }
  @media (min-width: 1000px) {
    --responsive-width: 225px;
    grid-row-gap: 40px;
  }
  margin: 64px auto 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--responsive-width), 1fr));
  justify-items: center;
  .tilt {
    transform-style: preserve-3d;
    transform: perspective(10px);
    * {
      transform-style: preserve-3d;
    }
    padding: 0 !important;
    width: var(--responsive-width) !important;
    background: none !important;
    height: calc(var(--responsive-width) + 80px) !important;
    box-shadow: none !important;
    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    transform: scale(0.98);
    cursor: pointer;
    &:hover {
      img {
        transform: scale(1.1) translate(0, -5px) translateZ(55px);
      }
    }
    img {
      z-index: 2;
      border-radius: 4px;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform: translateZ(50px);
      box-shadow: 0px 3px 11px 5px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-height: var(--responsive-width);
      object-fit: cover;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      margin-bottom: -7px;
    }
    .title {
      z-index: 1;
      text-decoration: none;
      padding: 8px;
      padding-top: 28px;
      margin-top: -20px;
      opacity: 0.8;
      font-family: 'Open Sans', sans-serif;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      max-height: 80px;
      background: white;
      line-height: 1.6em;
      box-sizing: content-box;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      color: rgba(0, 0, 0, 0.9);
      text-decoration: none;
    }
  }
  .item {
    position: relative;
    .logo {
      display: block;
      position: absolute;
      top: -24px;
      left: -20px;
      transform: rotate(-10deg) translateZ(70px);
      .background {
        opacity: 0.65;
        height: 40px;
        width: 70px;
        transform: perspective(200px) translateZ(10px);
      }
      .logoImg {
        transform: translateZ(30px);
        position: absolute;
        padding: 5px;
      }
      &.kijiji {
        width: 70px;
      }
      &.usedottawa {
        .logoImg {
          transform: translateZ(-25px);
          width: 80px;
          left: 4px;
          top: 5px;
        }
        .background {
          width: 85px;
          height: 48px;
        }
      }
      &.craigslist {
        .logoImg {
          width: 130px;
          padding: 5px;
          top: -5px;
          text-align: center;
        }
        .background {
          width: 130px;
          height: 35px;
        }
        color: #042aee;
        font-family: 'Times New Roman', Times, serif;
        font-size: 22px;
      }
      &.letgo {
        svg {
          position: absolute;
          transform: translateZ(20px);
          width: 80px;
          left: 3px;
          top: 7px;
        }
        .background {
          width: 84px;
          height: 45px;
        }
      }
    }
  }
`;

export default ({ items }) => (
  <ItemsStyles className={`ItemsStyles`}>
    {items.map(item => {
      if (item) {
        return (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={item.url}
            key={item.url}
            className={`item`}
          >
            <Tilt className="tilt">
              <img src={item.image} alt={item.title} />
              {/* TODO: convert special characters in title */}
              <div className="title">{item.title}</div>
              <div className={`logo ${item.type}`}>
                {item.type === 'kijiji' ? (
                  <>
                    <div className="background" />
                    <KijijiLogo className="logoImg" />
                  </>
                ) : item.type === 'usedottawa' ? (
                  <>
                    <div className="background" />
                    <UsedLogo className="logoImg" />
                  </>
                ) : item.type === 'craigslist' ? (
                  <>
                    <div className="background" />
                    <div className="craigslist logoImg">craigslist ☮</div>
                  </>
                ) : item.type === 'letgo' ? (
                  <>
                    <div className="background" />
                    <LetgoLogo className="logoImg" />
                  </>
                ) : null}
              </div>
            </Tilt>
          </a>
        );
      } else {
        return null;
      }
    })}
  </ItemsStyles>
);
