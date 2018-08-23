import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles
} from '@material-ui/core';
import * as classNames from 'classnames';
import { CaDelete, CaEdit, CaLock } from 'components';

import { HeaderName, ResultStatus, Row, TypeOfColumn } from 'models';

import * as React from 'react';

import { I18n, TranslationFunction } from 'react-i18next';
import { i18nInstance } from 'utils/i18n';

import { CaTableProps } from './CaTable.model';
import { styles } from './CaTable.styles';

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timezone: 'UTC',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

export const CaTable = withStyles(styles)(
  class extends React.Component<CaTableProps> {

    public getTextContentOfTheCell = (column: HeaderName, row: Row, t: TranslationFunction) => {
      let textContent;
      const text = row[`${column.field}`];

      switch (column.type) {
        case TypeOfColumn.String: {
          textContent = text;
          break;
        }
        case TypeOfColumn.TimeCount: {
          textContent = t('minutes', { count: text });
          break;
        }
        case TypeOfColumn.Points: {
          textContent = text;
          break;
        }
        case TypeOfColumn.Result: {
          if (text === ResultStatus.Win) {
            textContent = t('win');
          } else if (text === ResultStatus.Lose) {
            textContent = t('lose');
          } else if (text === ResultStatus.Draw) {
            textContent = t('draw');
          }

          break;
        }
        case TypeOfColumn.Date: {
          textContent = new Date(text).toLocaleString(i18nInstance.language, options);
          break;
        }
        default: {
          textContent = text;
        }
      }
      return textContent;
    }

    public getButtonContentOfTheCell = (column: HeaderName, row: any, t: TranslationFunction) => {
      const { classes } = this.props;

      const isCellHaveEditButton = column.editAction;
      const isCellHaveDeleteButton = column.deleteAction;
      const isCellHaveLockButton = column.lockAction;
      let buttonContent;
      const isCellHaveAnyButton = isCellHaveEditButton || isCellHaveDeleteButton || isCellHaveLockButton;

      if (isCellHaveAnyButton) {
        buttonContent =
          <div className={classes.buttonsInCellWithButtons}>
            {column.lockAction ? <CaLock showAppToken={() => column.lockAction && column.lockAction(row.appToken)} /> : null}
            {column.editAction ? <CaEdit editHandler={() => column.editAction && column.editAction(row.id)} /> : null}
            {column.deleteAction ? <CaDelete deleteHandler={() => column.deleteAction && column.deleteAction(row)} /> : null}
          </div>;
      }

      return buttonContent;
    }

    public getContentOfTheCell = (column: HeaderName, row: Row, t: TranslationFunction) => {
      const { classes } = this.props;

      const textContent = this.getTextContentOfTheCell(column, row, t);

      const buttonContent = this.getButtonContentOfTheCell(column, row, t);

      return (
        <div className={classes.cellWithButtons}>
          <div className={classes.textInCellWithButtons}>{textContent}</div>
          {buttonContent}
        </div>
      );
    }

    public onRowClick = (row: Row) => {
      if (this.props.handleRowClick) {
        this.props.handleRowClick(row);
      }
    }

    public render(): JSX.Element {
      const { columnDef, rowData, classes } = this.props;

      return (
        <I18n>
          {
            (t) => (
              <Table>
                <TableHead className={classes.tableHead}>
                  <TableRow className={classes.tableHeadRow}>
                    {columnDef.map((nameOfColumn, index) => {
                      const numeric = index !== 0;
                      return (
                        <TableCell
                          key={nameOfColumn.headerName}
                          numeric={numeric}
                          className={classNames(classes.columnCell, classes.tableHeadCell)}
                        >
                          {t(nameOfColumn.headerName)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowData.map((row, rowIndex) => {
                    return (
                      <TableRow key={rowIndex} onClick={() => this.onRowClick(row)}>
                        {columnDef.map((column, propertyIndex) => {
                          const numeric = propertyIndex !== 0;

                          return (
                            <TableCell
                              numeric={numeric}
                              key={propertyIndex}
                              className={classes.columnCell}
                            >
                              {this.getContentOfTheCell(column, row, t)}
                            </TableCell>
                          );
                        }
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )
          }
        </I18n>
      );
    }
  }
);
