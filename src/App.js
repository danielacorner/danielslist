import { CircularProgress } from '@material-ui/core';
import { navigate } from '@reach/router';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import Appbar from './components/Appbar';
import ItemsGrid from './components/ItemsGrid';
import { getCraigslist, getKijiji, getUsedottawa } from './utils/scrapers';
import styled from 'styled-components';

const AppStyles = styled.div`
  .background {
    position: fixed;
    top: 0;
    left: 0;
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
  .spinnerDiv {
    width: 100%;
    height: 100vh;
    display: grid;
    place-items: center center;
  }
`;

const App = () => {
  const [items, setItems] = useState([]);

  const [searchTerms, setSearchTerms] = useState(null);

  const setSearchTermsAndQueryParams = terms => {
    setItems([]);
    setSearchTerms(terms);
    navigate(`/${qs.stringify(terms.split(' '))}`);
    // setQueryParams(terms)
  };

  // const [{ data, loading, error }, refetch] = useAxios(
  //   'https://jsonplaceholder.typicode.com/todos/1'
  // )

  const [site, setSite] = useState('kijiji');

  useEffect(async () => {
    // if no search terms, try query string instead
    const queryString = window.location.search;
    // TODO: get Kijiji, then get UsedOttawa, then get Craigslist
    const kijijiItems = await getKijiji({
      queryString,
      searchTerms,
    });
    setItems(kijijiItems);
    const usedOttawaItems = await getUsedottawa({
      queryString,
      searchTerms,
    });
    setItems([...kijijiItems, ...usedOttawaItems]);
    const craigsListItems = await getCraigslist({
      queryString,
      searchTerms,
    });
    setItems([...kijijiItems, ...usedOttawaItems, ...craigsListItems]);
  }, [searchTerms]);

  return (
    <>
      <AppStyles className="AppStyles">
        <div className="background" />
        <Appbar
          setSearchTerms={setSearchTermsAndQueryParams}
          site={site}
          setSite={setSite}
        />
        {/* 'awww nuggets' */}
        {items.length > 0 ? (
          <ItemsGrid className="itemsGrid" items={items} />
        ) : (
          <div className="spinnerDiv">
            <CircularProgress className="spinner" size={30} thickness={5} />
          </div>
        )}
      </AppStyles>
    </>
  );
};

export default App;
