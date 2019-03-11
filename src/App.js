import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Appbar from './components/Appbar';
import FilterDrawer from './components/FilterDrawer';
import ItemsGrid from './components/ItemsGrid';
import {
  getCraigslist,
  getKijiji,
  getLetgo,
  getUsedottawa,
} from './utils/scrapers';

const AppStyles = styled.div`
  .background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    opacity: 0.6;
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
  // static
  const corsProxy = `https://cors-proxy-danielslist.herokuapp.com/`;

  // state
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [proxy, setProxy] = useState(corsProxy);

  // TODO: filters

  const fetchData = async () => {
    // get Kijiji, then letgo, then UsedOttawa, then craigslist
    setItems([]);
    const kijijiItems = await getKijiji({ query, filters, proxy, setProxy });
    setItems(kijijiItems);
    const letgoItems = await getLetgo({ query, filters, proxy, setProxy });
    setItems([...kijijiItems, ...letgoItems]);
    const usedOttawaItems = await getUsedottawa({
      query,
      filters,
      proxy,
      setProxy,
    });
    setItems([...kijijiItems, ...letgoItems, ...usedOttawaItems]);
    const craigslistItems = await getCraigslist({
      query,
      filters,
      proxy,
      setProxy,
    });
    setItems([
      ...kijijiItems,
      ...letgoItems,
      ...usedOttawaItems,
      ...craigslistItems,
    ]);
  };

  useEffect(() => {
    fetchData();
  }, [query, filters, proxy]);

  return (
    <>
      <AppStyles className="AppStyles">
        <div className="background" />
        <Appbar
          setDrawerOpen={setDrawerOpen}
          setQuery={terms => {
            window.scrollTo(0, 0);
            setQuery(terms);
          }}
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
      <FilterDrawer
        filters={filters}
        setFilters={setFilters}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </>
  );
};

export default App;
