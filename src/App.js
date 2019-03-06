import { CircularProgress } from '@material-ui/core';
import { navigate } from '@reach/router';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { AppStyles } from './AppStyles';
import Appbar from './components/Appbar';
import ItemsGrid from './components/ItemsGrid';
import { getCraigslist, getKijiji, getUsedottawa } from './utils/scrapers';

const App = () => {
  const [items, setItems] = useState([]);

  const [searchTerms, setSearchTerms] = useState(null);

  const setSearchTermsAndQueryParams = terms => {
    setSearchTerms(terms);
    navigate(`/${qs.stringify(terms.split(' '))}`);
    // setQueryParams(terms)
  };

  // const [{ data, loading, error }, refetch] = useAxios(
  //   'https://jsonplaceholder.typicode.com/todos/1'
  // )

  const [site, setSite] = useState('kijiji');

  useEffect(() => {
    // if no search terms, try query string instead
    const queryString = window.location.search;
    setItems([]);
    site === 'kijiji'
      ? getKijiji({ queryString, searchTerms, setItems })
      : site === 'craigslist'
      ? getCraigslist({ queryString, searchTerms, setItems })
      : site === 'usedottawa'
      ? getUsedottawa({ queryString, searchTerms, setItems })
      : (() => {})();
  }, [searchTerms, site]);

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
