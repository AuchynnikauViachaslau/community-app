import * as React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-i18next';

import {
  AuthStatus,
  LoadStatus
} from 'models';

import {
  AppState
} from 'store';

import './EventPage.scss';

import {
  EventProps,
} from './Event.model';

import { Dispatch } from 'redux';
import { LoadEvent } from 'store/events';
import { Redirect } from 'react-router';

//import { YandexMap } from 'components';

import iconShare from 'assets/svg/icon-share.svg';
import calendarGreen from 'assets/svg/icon-calendar--green.svg';
import location from 'assets/svg/icon-location.svg';
import online from 'assets/svg/icon-online.svg';

export class EventPageComp extends React.Component<EventProps> {
  public componentWillMount(): void {
    if (this.props.authStatus === AuthStatus.NotAuthorized) {
      this.props.history.push('/battles');
    }
  }

  public componentDidMount(): void {
    const { loadEvent, match } = this.props;
    loadEvent(match.params['id']);
  }

  public componentWillReceiveProps(nextProps: EventProps): void {
    const { loadEvent, match } = this.props;
    if (nextProps.match.params['id'] !== match.params['id']) {
      loadEvent(nextProps.match.params['id']);
    }
  }

  public render(): JSX.Element {
    const { events, loadEventStatus } = this.props;
    return (
      <I18n>
        {
          (t) => (
            <React.Fragment>
              {
                loadEventStatus === LoadStatus.Error
                  ? <Redirect to="/events" />
                  : events.map(event => {
                    return (
                      <div key={event.id} className='page'>
                        <div className='header'>
                          <div className='header__title'>{event.title}</div>
                          <div className='event-information'>
                            <div className='information-nav'>
                              <div className='widget'>
                                <img src={ online } alt='' className='widget__online'/>
                                <div className='widget__date'>
                                  <img src={ calendarGreen } alt='' />
                                  <div className='number'>
                                    { event.begginingDate }
                                  </div>
                                </div>
                                <div className='widget__city'>
                                  <img src={ location } alt='' />
                                  <div className='title-city'>
                                    { event.city }
                                  </div>
                                </div>
                                <div className='widget__skills'>Java, С++, Ruby, Go</div>
                              </div>
                              <div className='information__share'>
                                <img src={ iconShare } />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  )}
            </React.Fragment>
          )
        }
      </I18n>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadEvent: (id: number) => dispatch(new LoadEvent(id)),
});

const mapStateToProps = (state: AppState) => ({
  authStatus: state.auth.status,
  events: state.events.events,
  loadEventStatus: state.events.loadEventStatus,
});

export const EventPage = connect(mapStateToProps, mapDispatchToProps)(EventPageComp);