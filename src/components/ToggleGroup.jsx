import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React from 'react';

const ToggleGroup = ({ site, setSite }) => {
  const handleChange = (event, site) => {
    setSite(site);
  };
  return (
    <ToggleButtonGroup value={site} exclusive onChange={handleChange}>
      <ToggleButton value="kijiji">Kijiji</ToggleButton>
      <ToggleButton value="craigslist">Craigslist</ToggleButton>
      <ToggleButton value="usedottawa">UsedOttawa</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleGroup;
