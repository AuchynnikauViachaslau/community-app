import * as React from 'react';

import {CaTableProps} from './CaTable.model';
import * as classNames from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core';
import { styles } from './CaTable.styles';

export const CaTable = withStyles(styles)((props: CaTableProps) => {
  const { columnDef, rowData, classes } = props;

  const arrayOfColumnName = columnDef.map(column => column.headerName);
  const arrayOfPropertyName = columnDef.map(column => column.field);

  return(
    <Table>
        <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableHeadRow}>
                {arrayOfColumnName.map((nameOfColumn, index) => {
                    const numeric = index !== 0;
                    return (
                        <TableCell
                          key={nameOfColumn}
                          numeric={numeric}
                          className={classNames(classes.columnCell, classes.tableHeadCell)}
                        >
                        {nameOfColumn}
                        </TableCell>
                    );
                })}
            </TableRow>
        </TableHead>
        <TableBody>
            {rowData.map((user, index) => {
            return (
                <TableRow key={index}>
                    {arrayOfPropertyName.map((property, index) => {
                        const numeric = index !== 0;

                        return (
                            <TableCell
                              numeric={numeric}
                              key={index}
                              className={classes.columnCell}
                            >
                            {user[property]}
                            </TableCell>
                        );
                    }
                    )}
                </TableRow>
            );
            })}
        </TableBody>
    </Table>
  );
});