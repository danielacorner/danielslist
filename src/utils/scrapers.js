import Axios from 'axios';
import { detail as craigslistDetail } from 'craigslist-searcher';

export const getKijiji = ({ queryString, searchTerms, setItems }) => {
  const corsLink = `https://cors-anywhere.herokuapp.com/https://www.kijiji.ca/b-buy-sell/ontario/${
    searchTerms ? searchTerms : queryString
  }/k0c10l9004`;

  Axios.get(
    // use a cors proxy instead of a server https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347
    corsLink,
  ).then(response => {
    const imageDivArray = response.data.split(`<div class="image"`);
    const imgArray = imageDivArray.map(s =>
      s.slice(s.indexOf('=') + 2, s.indexOf('" ')),
    );

    const titleArray = imageDivArray
      .map(s => s.slice(s.indexOf('alt="') + 5, s.indexOf('</div>')))
      .map(s => s.slice(0, s.indexOf('">')));

    const linksArray = response.data.split(`data-vip-url="`).map(s => {
      const query = s.slice(0, s.indexOf(`"`));
      return `https://www.kijiji.ca${query}`;
    });

    const kijijiItems = imgArray.map((img, idx) => {
      return { image: img, title: titleArray[idx], url: linksArray[idx] };
    });
    // first item is always an ad
    setItems(kijijiItems.slice(1));
    console.log('kijiji results:', kijijiItems.slice(1));
  });
};

export const getCraigslist = ({ queryString, searchTerms, setItems }) => {
  const corsLink = `https://cors-anywhere.herokuapp.com/https://ottawa.craigslist.org/search/sss?sort=date&query=${
    // TODO: use search terms properly
    searchTerms ? searchTerms : queryString
  }`;

  Axios.get(corsLink).then(async response => {
    const itemsArray = response.data
      .slice(response.data.indexOf(`<li class="result-row"`))
      .split(`<li class="result-row"`);

    const linksArray = itemsArray.map(item =>
      item.slice(
        item.indexOf(`<a href="`) + 9,
        item.indexOf(`" class="result-image`),
      ),
    );

    setItems([]);
    Promise.all(
      linksArray.map(async (link, idx) => {
        try {
          const detail = await craigslistDetail(
            `https://cors-anywhere.herokuapp.com/` + (link || ''),
          );
          const nextItem = {
            image: detail.images ? detail.images[0] : null,
            title: detail.title,
            url: linksArray[idx],
          };
          return nextItem;
          // console.log({ items, nextItem });
          // console.log([...items, nextItem]);

          // setItems([...items, nextItem]);
          // return nextItem;
          // }
          // return null;
        } catch (error) {
          console.warn(error);
        }
      }),
    ).then(detailsArray => {
      console.log('craigslist results:', detailsArray);
      setItems(detailsArray);
    });
    // {
    //   title: 'Item's title text,
    //   price: 'Item's price',
    //   location: 'Item's location',
    //   images: ['The first image url', 'The second image url', ...],
    //   latitude: 'Latitude', // Will return null if no latitude information
    //   longitude: 'Longitude', // Will return null if no longitude information
    //   accuracy: 'Location accuracy', // Will return null if no accuracy information
    //   googleMap: 'Google map's url', // Will return null if no Google map information
    //   description: 'Item's description',
    //   postedDate: 'Posted date and time',
    //   dataId: 'post id'
    // }
  });

  console.log('getting craigslist');
};

export const getUsedottawa = ({ queryString, searchTerms, setItems }) => {
  const corsLink = `https://cors-anywhere.herokuapp.com/https://www.usedottawa.com/classifieds/all?description=${
    // TODO: use search terms properly
    searchTerms ? searchTerms : queryString
  }`;
  Axios.get(corsLink).then(async response => {
    const itemsArray = response.data
      .slice(response.data.indexOf(`<div class="article"`))
      .split(`<div class="article"`);

    const linksEndsArray = itemsArray.map(
      item =>
        `${item.slice(item.indexOf(`<a href="`) + 9, item.indexOf(`" ><`))}`,
    );
    const linksArray = linksEndsArray.map(
      end => `https://www.usedottawa.com${end}`,
    );
    const imgArray = itemsArray.map(item =>
      item.slice(item.indexOf(`<img src="`) + 10, item.indexOf(`" alt="`)),
    );
    const titleArray = itemsArray.map(item =>
      item.slice(
        item.indexOf(`itemprop="description">`) + 23,
        item.indexOf(`</p> <div class="property"`),
      ),
    );
    const usedOttawaItems = imgArray.map((img, idx) => {
      return { image: img, title: titleArray[idx], url: linksArray[idx] };
    });

    setItems(usedOttawaItems.slice(1));
  });

  console.log('getting usedottawa');
};
