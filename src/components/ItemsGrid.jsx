import React from 'react';
import styled from 'styled-components';
import Tilt from 'react-vanilla-tilt';

const ItemsStyles = styled.div`
  --responsive-width: 140px;
  grid-column-gap: 10px;
  padding: 12px;
  grid-row-gap: 18px;
  @media (min-width: 700px) {
    --responsive-width: 175px;
    grid-column-gap: 20px;
    padding: 24px;
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
    transform: perspective(1000px);
    padding: 0 !important;
    width: var(--responsive-width) !important;
    background: none !important;
    height: calc(var(--responsive-width) + 80px) !important;
    box-shadow: none !important;
    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    transform: scale(0.98);
    cursor: pointer;
    &:hover {
      transform: scale(1) translate(0, -2px);
    }
    img {
      transform: translateZ(20px);
      box-shadow: 0px 3px 11px 5px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-height: var(--responsive-width);
      object-fit: cover;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      margin-bottom: -7px;
    }
    .title {
      padding: 8px;
      opacity: 0.8;
      font-family: system-ui;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      max-height: 80px;
      background: white;
      line-height: 1.5em;
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
`;

export default ({ items }) => (
  <ItemsStyles className="ItemsStyles">
    {items.map(item => (
      <a href={item.url} key={item.title}>
        <Tilt options={{ glare: true }} className="tilt">
          <img src={item.image} alt={item.title} />
          <div className="title">{item.title}</div>
        </Tilt>
      </a>
    ))}
  </ItemsStyles>
);
