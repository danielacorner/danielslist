import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Appbar from './components/Appbar';
import ItemsGrid from './components/ItemsGrid';

const AppStyles = styled.div`
  .background {
    position: fixed;
    height: 100vh;
    width: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300cac8' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 0h35v35H0V0zm5 5h25v25H5V5zm5 5h15v15H10V10zm5 5h5v5h-5v-5zM40 5h25v25H40V5zm5 5h15v15H45V10zm5 5h5v5h-5v-5zM70 35H35v35h35V35zm-5 5H40v25h25V40zm-5 5H45v15h15V45zm-5 5h-5v5h5v-5zM30 40H5v25h25V40zm-5 5H10v15h15V45zm-5 5h-5v5h5v-5z'/%3E%3C/g%3E%3C/svg%3E"),
      linear-gradient(
        to right top,
        #287c11,
        #1d903e,
        #07a464,
        #00b889,
        #00ccae,
        #00cac8,
        #00c6dd,
        #00c0eb,
        #00a1ea,
        #007ee0,
        #4a56c6,
        #74199b
      );
  }
`;

const App = () => {
  const [items, setItems] = useState([]);

  const [searchTerms, setSearchTerms] = useState(null);

  useEffect(() => {
    Axios.get(
      // use a cors proxy instead of a server https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347
      `https://cors-anywhere.herokuapp.com/https://www.kijiji.ca/b-buy-sell/ontario/${searchTerms}/k0c10l9004`,
      {
        // params: {
        //   url: `https://www.kijiji.ca/b-buy-sell/ontario/${searchTerms}/k0c10l9004`,
        // },
      },
    ).then(response => {
      const imageDivArray = response.data.split(`<div class="image"`);
      const imgArray = imageDivArray.map(s =>
        s.slice(s.indexOf('=') + 2, s.indexOf('" ')),
      );
      const titleArray = imageDivArray
        .map(s => s.slice(s.indexOf('alt="') + 5, s.indexOf('</div>')))
        .map(s => s.slice(0, s.indexOf('">')));
      const urlArray = response.data
        .split(`data-vip-url="`)
        .map(s => s.slice(0, s.indexOf(` class="`)));
      console.log(urlArray);
      setItems(
        imgArray.map((img, idx) => {
          return { image: img, title: titleArray[idx], url: urlArray[idx] };
        }),
      );
    });
  }, [searchTerms]);

  return (
    <>
      <AppStyles className="AppStyles">
        <div className="background" />
        <Appbar setSearchTerms={setSearchTerms} />
        {/* 'awww nuggets' */}
        <ItemsGrid className="itemsGrid" items={items} />
      </AppStyles>
    </>
  );
};

export default App;
