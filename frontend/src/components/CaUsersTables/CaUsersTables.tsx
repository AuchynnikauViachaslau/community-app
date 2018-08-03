import * as React from 'react';

import { Tab, Tabs, withStyles } from '@material-ui/core';
import { CaTable } from 'components';
import { StatTab, tableCellDataType } from 'models';
import { I18n } from 'react-i18next';

import { CaUsersTablesProps, CaUsersTablesState, HeaderName, StatisticOfUser } from './CaUsersTables.model';
import { styles } from './CaUsersTables.styles';

import './CaUsersTables.scss';

export const CaUsersTables = withStyles(styles)(
  class extends React.Component<CaUsersTablesProps, CaUsersTablesState> {

    constructor(props: CaUsersTablesProps) {
      super(props);
      this.state = {
        value: 0,
        rowData: [],
        columnDef: []
      };
    }

    public componentWillMount(): void {
      this.changeContent(StatTab.BestUsers);
    }

    public render(): JSX.Element {

      return (
        <I18n>
          {
            ( t ) => (
              <div>
                <h2 className='ca-users-tables__title'>{t('statistics')}</h2>
                <Tabs value={this.state.value}>
                  <Tab
                    label={t('bestUsersLabel')}
                    onClick={() => this.changeContent(StatTab.BestUsers)}
                    classes={{ label: this.props.classes.label }} />
                  <Tab
                    label={t('mostPopularGamesLabel')}
                    onClick={() => this.changeContent(StatTab.TheMostPopularGames)}
                    classes={{ label: this.props.classes.label }}
                  />
                  <Tab
                    label={t('recentGamesLabel')}
                    onClick={() => this.changeContent(StatTab.RecentGames)}
                    classes={{ label: this.props.classes.label }} />
                </Tabs>

                <CaTable rowData={this.state.rowData} columnDef={this.state.columnDef} />
              </div>
            )
          }
        </I18n>
      );
    }

    public getNameOfHeaders(tableHeadersName: any, statistic: object): string[] {
      const propertyNames = Object.keys(statistic);
      const headersName: string[] = [];

      propertyNames.forEach(property => {
        if (tableHeadersName[property]) {
          headersName.push(tableHeadersName[property]);
        }
      });

      return [...headersName];
    }

    public changeContent(value: number): void {

      switch (value) {
        case StatTab.BestUsers: {

          const columnDef = [
            { headerName: 'userName', field: tableCellDataType.name },
            { headerName: 'playedTime', field: tableCellDataType.playedTime },
            { headerName: 'score', field: tableCellDataType.scores }
          ];
          const bestUsers = [...this.props.statistic.bestUsers];

          if (!this.isArrayEmpty(bestUsers)) {
            const arrayOfNecessaryProperty = this.getNecessaryProperty(columnDef);

            const arrayWithoutUnnecessaryProperties = this.deleteUnnecessaryProperty(bestUsers, arrayOfNecessaryProperty);
            const arrayWithCheckedProperties = this.checkPropertyOfObject(arrayWithoutUnnecessaryProperties, arrayOfNecessaryProperty);

            const rowData = arrayWithCheckedProperties.map(userStatistic => {
              const newUserStatistic = { ...userStatistic };

              // I'll leave these comments for a while, in case of further changes in the logic of the tabular data

              // const arrayOfProperty = Object.keys(newUserStatistic);

              // arrayOfProperty.forEach(property => {
              //   if (newUserStatistic[property] !== '-') {
              //     if (property === tableCellDataType.name) {
              //       newUserStatistic[property] = newUserStatistic[property];
              //     }

              //     if (property === tableCellDataType.playedTime) {
              //       // newUserStatistic[property] = newUserStatistic[property] + ' minutes';
              //       newUserStatistic[property] = newUserStatistic[property];
              //     }

              //     if (property === tableCellDataType.scores) {
              //       newUserStatistic[property] = newUserStatistic[property];
              //     }
              //   }
              // });

              return newUserStatistic;
            });

            this.setState({
              value,
              rowData,
              columnDef
            });
          } else {
            this.setState({
              value,
              rowData: [],
              columnDef
            });
          }
          break;
        }

        case StatTab.TheMostPopularGames: {

          const columnDef = [
            { headerName: 'game', field: tableCellDataType.name },
            { headerName: 'playedInWeek', field: tableCellDataType.playedInWeek },
            { headerName: 'playedAll', field: tableCellDataType.playedTime }
          ];
          const mostPopularGames = [...this.props.statistic.mostPopularGames];

          if (!this.isArrayEmpty(mostPopularGames)) {
            const arrayOfNecessaryProperty = this.getNecessaryProperty(columnDef);

            const arrayWithoutUnnecessaryProperties = this.deleteUnnecessaryProperty(mostPopularGames, arrayOfNecessaryProperty);
            const arrayWithCheckedProperties = this.checkPropertyOfObject(arrayWithoutUnnecessaryProperties, arrayOfNecessaryProperty);

            const rowData = arrayWithCheckedProperties.map(userStatistic => {
              const newUserStatistic = { ...userStatistic };

              // I'll leave these comments for a while, in case of further changes in the logic of the tabular data

              // const arrayOfProperty = Object.keys(newUserStatistic);

              // arrayOfProperty.forEach(property => {
              //   if (newUserStatistic[property] !== '-') {

              //     if (property === tableCellDataType.name) {
              //       newUserStatistic[property] = newUserStatistic[property];
              //     }

              //     if (property === tableCellDataType.playedInWeek) {
              //       // newUserStatistic[property] = newUserStatistic[property] + ' minutes';
              //       newUserStatistic[property] = newUserStatistic[property];
              //     }

              //     if (property === tableCellDataType.playedTime) {
              //       // newUserStatistic[property] = newUserStatistic[property] + ' minutes';
              //       newUserStatistic[property] = newUserStatistic[property];
              //     }
              //   }
              // });

              return newUserStatistic;
            });

            this.setState({
              value,
              rowData,
              columnDef
            });
          } else {
            this.setState({
              value,
              rowData: [],
              columnDef
            });
          }
          break;
        }

        case StatTab.RecentGames: {

          const columnDef = [
            { headerName: 'game', field: tableCellDataType.game },
            { headerName: 'score', field: tableCellDataType.scores },
            { headerName: 'result', field: tableCellDataType.result }
          ];
          const recentGames = [...this.props.statistic.recentGames] || [];

          if (!this.isArrayEmpty(recentGames)) {
            const arrayOfNecessaryProperty = this.getNecessaryProperty(columnDef);

            const arrayWithoutUnnecessaryProperties = this.deleteUnnecessaryProperty(recentGames, arrayOfNecessaryProperty);
            const arrayWithCheckedProperties = this.checkPropertyOfObject(arrayWithoutUnnecessaryProperties, arrayOfNecessaryProperty);

            const rowData = arrayWithCheckedProperties.map(userStatistic => {
              const newUserStatistic = { ...userStatistic };

              // I'll leave these comments for a while, in case of further changes in the logic of the tabular data

              // const arrayOfProperty = Object.keys(newUserStatistic);

              // arrayOfProperty.forEach(property => {
              //   if (newUserStatistic[property] !== '-') {
              //     if (property === tableCellDataType.game) {
              //       newUserStatistic[property] = newUserStatistic[property];
              //     }

              //     if (property === tableCellDataType.scores) {
              //       newUserStatistic[property] = newUserStatistic[property];
              //     }

              //     if (property === tableCellDataType.result) {
              //       // newUserStatistic[property] = newUserStatistic[property] ? 'W' : 'L';
              //       newUserStatistic[property] = newUserStatistic[property];
              //     }
              //   }
              // });

              return newUserStatistic;
            });

            this.setState({
              value,
              rowData,
              columnDef
            });
          } else {
            this.setState({
              value,
              rowData: [],
              columnDef
            });
          }
          break;
        }
        default:
          break;
      }
    }

    public isArrayEmpty(arrayOfData: any[]): boolean {
      return !Array.isArray(arrayOfData) || !arrayOfData.length;
    }

    public getNecessaryProperty(columnDef: HeaderName[]): string[] {
      return columnDef.map(column => column.field);
    }

    public checkPropertyOfObject(arrayOfData: StatisticOfUser[], arrayOfNecessaryProperty: string[]): any[] {

      const newArrayOfData = arrayOfData.map(userStatistic => {
        const newUserStatistic = { ...userStatistic };
        arrayOfNecessaryProperty.forEach(necessaryProperty => {
          if (newUserStatistic[necessaryProperty] === undefined || newUserStatistic[necessaryProperty] === null) {
            newUserStatistic[necessaryProperty] = '-';
          }

        });
        return newUserStatistic;
      });

      return [...newArrayOfData];
    }

    public deleteUnnecessaryProperty(arrayOfData: StatisticOfUser[], arrayOfNecessaryProperty: string[]): any[] {
      const newArrayOfData = arrayOfData.map(userStatistic => {
        const newUserStatistic = { ...userStatistic };

        for (const property in newUserStatistic) {
          if (!(arrayOfNecessaryProperty.indexOf(property) + 1)) {
            delete newUserStatistic[property];
          }
        }
        return newUserStatistic;
      });

      return newArrayOfData;
    }
  });
