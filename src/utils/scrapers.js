import Axios from 'axios';
import { detail as craigslistDetail } from 'craigslist-searcher';

const proxyBackup = `https://cors-anywhere.herokuapp.com/`;

const filtersChanged = filters => {
  let filtersChanged = false;
  Object.values(filters).forEach(value => {
    if (value !== null) {
      filtersChanged = true;
    }
  });
  return filtersChanged;
};

export const getKijiji = ({ query, filters, proxy, setProxy }) => {
  return new Promise((resolve, reject) => {
    const corsLink = `${proxy}https://www.kijiji.ca/b-buy-sell/ontario/${
      query ? query : ''
    }/k0c10l9004${
      filtersChanged(filters)
        ? '?' +
          Object.entries(filters)
            .map(([filterName, value]) => {
              if (filterName === 'priceFrom') {
                return `price=${value}`;
              } else if (filterName === 'priceTo') {
                return filters.priceFrom === null
                  ? `price=__${value}`
                  : `__${value}`;
              }
            })
            .join('')
        : ''
    }`;

    Axios.get(corsLink)
      .then(response => {
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
          return {
            image: img,
            title: titleArray[idx],
            url: linksArray[idx],
            type: 'kijiji',
          };
        });
        // first item is always an ad
        console.log('Kijiji results:', kijijiItems);
        resolve(kijijiItems.slice(1));
      })
      .catch(error => {
        console.warn(
          'No items fetched...  switching to backup cors proxy',
          error,
        );
        setProxy(proxyBackup);
      });
  });
};

export const getUsedottawa = ({ query, filters, proxy, setProxy }) => {
  return new Promise((resolve, reject) => {
    const corsLink = `${proxy}https://www.usedottawa.com/classifieds/all?description=${
      query ? query : ''
    }${
      filtersChanged(filters)
        ? '?' +
          Object.entries(filters)
            .map(([filterName, value]) => {
              if (filterName === 'priceFrom') {
                return `&pricefrom=${value}`;
              } else if (filterName === 'priceTo') {
                return `&priceto=${value}`;
              }
            })
            .join('')
        : ''
    }`;
    // & pricefrom=0 & priceto=100
    Axios.get(corsLink)
      .then(async response => {
        const itemsArray = response.data
          .slice(response.data.indexOf(`<div class="article"`))
          .split(`<div class="article"`);
        const linksEndsArray = itemsArray.map(
          item =>
            `${item.slice(
              item.indexOf(`<a href="`) + 9,
              item.indexOf(`" ><`),
            )}`,
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
          return {
            image: img,
            title: titleArray[idx],
            url: linksArray[idx],
            type: 'usedottawa',
          };
        });

        console.log('Used Ottawa results:', usedOttawaItems);
        resolve(usedOttawaItems.slice(1));
      })
      .catch(error => {
        console.warn(
          'No items fetched...  switching to backup cors proxy',
          error,
        );
        setProxy(proxyBackup);
      });

    console.log('getting usedottawa');
  });
};

export const getCraigslist = ({ query, filters, proxy, setProxy }) => {
  return new Promise((resolve, reject) => {
    const corsLink = `${proxy}https://ottawa.craigslist.org/search/sss?sort=date&query=${
      query ? query : ''
    }${
      filtersChanged(filters)
        ? '?' +
          Object.entries(filters)
            .map(([filterName, value]) => {
              if (filterName === 'priceFrom') {
                return `&min_price=${value}`;
              } else if (filterName === 'priceTo') {
                return `&max_price=${value}`;
              }
            })
            .join('')
        : ''
    }`;

    Axios.get(corsLink)
      .then(async response => {
        const itemsArray = response.data
          .slice(response.data.indexOf(`<li class="result-row"`))
          .split(`<li class="result-row"`);

        const linksArray = itemsArray.map(item =>
          item.slice(
            item.indexOf(`<a href="`) + 9,
            item.indexOf(`" class="result-image`),
          ),
        );

        Promise.all(
          linksArray.map(async (link, idx) => {
            try {
              const detail = await craigslistDetail(`${proxy}` + (link || ''));
              const nextItem = {
                image: detail.images ? detail.images[0] : null,
                title: detail.title,
                url: linksArray[idx],
                type: 'craigslist',
              };
              return nextItem;
            } catch (error) {
              console.warn('craigslist item not fetched', error);
            }
          }),
        ).then(craigslistItems => {
          console.log('Craigslist results:', craigslistItems);
          resolve(craigslistItems);
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
      })
      .catch(error => {
        console.warn(
          'No items fetched...  switching to backup cors proxy',
          error,
        );
        setProxy(proxyBackup);
      });

    console.log('getting craigslist');
  });
};

export const getLetgo = ({ query, filters, proxy, setProxy }) => {
  return new Promise((resolve, reject) => {
    const corsLink = `${proxy}https://ca.letgo.com/en?${
      query ? `searchTerm=${query}` : ''
    }${
      filtersChanged(filters)
        ? '?' +
          Object.entries(filters)
            .map(([filterName, value]) => {
              if (filterName === 'priceFrom') {
                return `&price[min]=${value}`;
              } else if (filterName === 'priceTo') {
                return `&price[max]=${value}`;
              }
            })
            .join('')
        : ''
    }`;
    Axios.get(corsLink)
      .then(async response => {
        const itemsArray = response.data
          .slice(response.data.indexOf(`FeedListstyles__FeedListContainer`))
          .split(`FeedListstyles__FeedCardItem`)
          .slice(2);

        const linksArray = itemsArray.map(
          item =>
            `https://ca.letgo.com${item.slice(
              item.indexOf(`<a href="`) + 9,
              item.indexOf(`" title="`),
            )}`,
        );
        const imgArray = itemsArray.map(item =>
          item.slice(item.indexOf(`<img src="`) + 10, item.indexOf(`" alt="`)),
        );
        const titleArray = itemsArray.map(item =>
          item.slice(
            item.indexOf(`" title="`) + 9,
            item.indexOf(`"><img src="`),
          ),
        );
        const letgoItems = imgArray.map((img, idx) => {
          return {
            image: img,
            title: titleArray[idx],
            url: linksArray[idx],
            type: 'letgo',
          };
        });

        console.log('Letgo results:', letgoItems);
        resolve(letgoItems);
      })
      .catch(error => {
        console.warn(
          'No items fetched...  switching to backup cors proxy',
          error,
        );
        setProxy(proxyBackup);
      });

    console.log('getting letgo');
  });
};
