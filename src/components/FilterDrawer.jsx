import { Divider, TextField, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import DollarIcon from '@material-ui/icons/AttachMoney';
import React from 'react';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

class SwipeableTemporaryDrawer extends React.Component {
  state = {
    priceFrom: null,
    priceTo: null,
  };

  handleChange = event => {
    console.log(event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };
  closeDrawer = (setDrawerOpen, setFilters) => {
    const initialState = {
      priceFrom: null,
      priceTo: null,
    };

    // only update the filters if the state is different from initial
    // ? can use shouldComponentUpdate?
    Object.entries(this.state).forEach(([key, val]) => {
      if (initialState[key] !== val) {
        setFilters(this.state);
        return;
      }
    });
    setDrawerOpen(false);
  };

  render() {
    const { classes, setDrawerOpen, drawerOpen, setFilters } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          <ListItem>
            <Typography variant="h5">Filters</Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <DollarIcon />
            <TextField
              style={{ marginTop: -15, width: 72 }}
              label="Min price"
              pattern="[0-9]*"
              onChange={this.handleChange}
              name="priceFrom"
            />
            <ListItemText variant="h6" primary={'—'} />
            <TextField
              style={{ marginTop: -15, width: 72 }}
              label="Max price"
              pattern="[0-9]*"
              onChange={this.handleChange}
              name="priceTo"
            />
          </ListItem>
        </List>
      </div>
    );

    return (
      <div>
        <SwipeableDrawer
          open={drawerOpen}
          onClose={() => this.closeDrawer(setDrawerOpen, setFilters)}
          onOpen={() => setDrawerOpen(true)}
        >
          <div
            tabIndex={0}
            role="button"
            // onClick={() => setDrawerOpen(false)}
            onKeyDown={event => {
              if (event.charCode === 13 || event.key === 'Enter') {
                event.preventDefault();
                this.closeDrawer(setDrawerOpen, setFilters);
              }
            }}
          >
            {sideList}
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

export default withStyles(styles)(SwipeableTemporaryDrawer);
