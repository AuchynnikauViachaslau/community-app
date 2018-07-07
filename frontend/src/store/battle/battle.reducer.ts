import { BattleStatus } from 'models';

import { BattleActions, BattleActionTypes } from './battle.action';
import { initialState } from './battle.initial';

export const battleReducer = (state = initialState, action: BattleActions) => {
    switch (action.type) {
        case BattleActionTypes.JoinBattle: {
            return {
                ...state,
                status: BattleStatus.WAIT,
                battleName: action.payload
            };
        }

        case BattleActionTypes.LeaveBattle: {
            return {
                ...state,
                status: BattleStatus.INIT,
                battleName: action.payload,
                countdown: 0
            };
        }

        case BattleActionTypes.RedirectToBattle: {
            return {
                ...state,
                roomURL: action.payload,
                status: BattleStatus.PLAY,
                countdown: 0
            };
        }

        case BattleActionTypes.SetWaitBattlePlayersCount: {
            return {
                ...state,
                waitBattlePlayersCount: action.payload
            };
        }

        case BattleActionTypes.NotifyCountdown: {
            return {
                ...state,
                countdown: action.payload
            };
        }

        default:
            return state;
    }
};
