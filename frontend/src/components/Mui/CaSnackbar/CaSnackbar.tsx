import * as React from 'react';

import { Slide, Snackbar, withStyles } from '@material-ui/core';
import { SnackbarType } from 'models';

import { CaSnackbarProps } from './CaSnackbar.model';
import { styles } from './CaSnackbar.styles';
import { CaSnackbarContent } from './CaSnackbarContent';

export const CaSnackbar = withStyles(styles)(
  class extends React.Component<CaSnackbarProps> {
    public render(): JSX.Element {

      const { classes, type, handleClose, message, transitionDirection, ...otherProps } = this.props;

      const transition = (props: CaSnackbarProps): JSX.Element => {
        return <Slide {...props} direction={transitionDirection} />;
      };

      const position: string = type === SnackbarType.Info ? classes.positionBottom : classes.positionTop;

      return (
        <Snackbar
          className={position}
          anchorOrigin={this.props.anchorOrigin}
          open={this.props.open}
          onClose={handleClose && handleClose}
          autoHideDuration={this.props.autoHideDuration}
          action={this.props.action}

          TransitionComponent={transition}
          {...otherProps}
        >
          <CaSnackbarContent
            /* there is some discrepancy with types of message attribute:
            Snackbar message attribute has the following type: {message?: React.ReactElement<any>;}
            However, SnackbarContent message attribute type is as follows: {message: React.ReactElement<any> | string;}
            */
            message={this.props.message || ''}
            type={type}
          />
        </Snackbar>
      );
    }
  });
