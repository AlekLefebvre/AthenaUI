import { createSelector } from 'reselect';
import { get } from 'lodash';
import { VocabularyOption } from 'modules/Admin/components/Licenses/types';

type UserOption = {
	label: string;
	value: number;
};

const getRawVocs = (state: Object) => get(state, 'admin.vocabularies.queryResult', []) || [];
const getRawUsers = (state: Object) => get(state, 'admin.users.queryResult', []) || [];

const getVocabularies = createSelector(
    getRawVocs,
    (rawResults: Array<any>): Array<VocabularyOption> => rawResults.filter(voc => voc.required).map((voc) => ({
      label: voc.name,
      value: voc.id,
    })),
);

const getUsers = createSelector(
	getRawUsers,
	(rawUsers: Array<any>): Array<UserOption> => rawUsers.map(user => ({
		label: [user.firstName, user.middleName, user.lastName].filter(n => n).join(' '),
		value: user.id,
	}))
);

export default {
  getVocabularies,
  getUsers,
};
export {
	UserOption,
};
