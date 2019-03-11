import {
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import DollarIcon from '@material-ui/icons/AttachMoney';
import CloseIcon from '@material-ui/icons/Close';
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
  submit = (setDrawerOpen, setFilters) => {
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
    const {
      classes,
      setDrawerOpen,
      drawerOpen,
      setFilters,
      filters,
    } = this.props;
    const { priceFrom, priceTo } = filters;

    const sideList = (
      <div className={classes.list}>
        <List style={{ paddingTop: 0 }}>
          <ListItem
            style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}
          >
            <Typography variant="h5">Filters</Typography>{' '}
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </ListItem>
          <Divider />
          <ListItem style={{ marginTop: 10 }}>
            <DollarIcon />
            <TextField
              style={{ marginTop: -15, width: 72 }}
              label="Min price"
              pattern="[0-9]*"
              onChange={this.handleChange}
              name="priceFrom"
              defaultValue={priceFrom}
            />
            <ListItemText variant="h6" primary={'—'} />
            <TextField
              style={{ marginTop: -15, width: 72 }}
              label="Max price"
              pattern="[0-9]*"
              onChange={this.handleChange}
              name="priceTo"
              defaultValue={priceTo}
            />
          </ListItem>
        </List>
        <Button
          style={{ display: 'grid', margin: '10px auto 0 auto' }}
          variant="outlined"
          size="large"
          onClick={() => this.submit(setDrawerOpen, setFilters)}
        >
          Submit
        </Button>
      </div>
    );

    return (
      <div>
        <SwipeableDrawer
          open={drawerOpen}
          onClose={() => this.submit(setDrawerOpen, setFilters)}
          onOpen={() => setDrawerOpen(true)}
        >
          <div
            tabIndex={0}
            role="button"
            // onClick={() => setDrawerOpen(false)}
            onKeyDown={event => {
              if (event.charCode === 13 || event.key === 'Enter') {
                event.preventDefault();
                this.submit(setDrawerOpen, setFilters);
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
