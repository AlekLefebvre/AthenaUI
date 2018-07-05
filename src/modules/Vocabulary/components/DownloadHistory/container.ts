/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Vocabulary/actions';
import { get } from 'lodash';
import { modal } from 'modules/Vocabulary/const';
import { ModalUtils } from 'arachne-ui-components';
import FileSaver from 'file-saver';
import presenter, { IDownloadRequest } from './presenter';
import selectors from './selectors';

import {
	IDownloadHistoryStateProps,
	IDownloadHistoryDispatchProps,
	IDownloadHistoryProps,
} from './presenter';

interface IDownloadHistory {
	refreshInterval: number;
};

class DownloadHistory
extends Component<IDownloadHistoryProps, { expandedBundleId: number }>
implements IDownloadHistory {
	public refreshInterval;

	constructor() {
		super();
		this.state = {
			expandedBundleId: 0,
		};
		this.toggle = this.toggle.bind(this);
		this.refreshInterval = null;
	}

	startPolling() {
		this.refreshInterval = setInterval(this.props.load, 5000);
	}

	stopPolling() {
		clearInterval(this.refreshInterval);
	}

	componentWillMount() {
		this.props.load();
		this.startPolling();
	}

	componentWillUnmount() {
		this.stopPolling();
	}

	toggle(bundleId) {
		this.setState({
			expandedBundleId: this.state.expandedBundleId !== bundleId ? bundleId : -1,
		});
	}

	render() {
		return presenter({
			...this.props,
			expandedBundleId: this.state.expandedBundleId,
			toggle: this.toggle,
		});
	}
}

function mapStateToProps(state: Object): IDownloadHistoryStateProps {
	const history = selectors.getHistory(state);

	return {
		isLoading: get(state, 'vocabulary.history.isLoading', false)
			|| get(state, 'vocabulary.restore.isSaving', false),
		history,
	};
}

const mapDispatchToProps = {
	load: actions.history.load,
	remove: actions.history.remove,
	restore: actions.history.restore,
	showNotifications: () => ModalUtils.actions.toggle(modal.notifications, true),
	checkAvailability: actions.download.checkBundleAvailability,
	showRequestModal: (ids = []) => ModalUtils.actions.toggle(modal.licenses, true, ids),
};

function mergeProps(
	stateProps: IDownloadHistoryStateProps,
	dispatchProps: IDownloadHistoryDispatchProps
): IDownloadHistoryProps {
	return {
		...stateProps,
		...dispatchProps,
		removeBundle: (id: number) => {
			dispatchProps
				.remove(id)
				.then(dispatchProps.load);
		},
		restoreBundle: (id) => {
			dispatchProps
				.checkAvailability(id)
				.then(({ accessible, vocabularyIds }) => {
					if (accessible) {
						dispatchProps.restore(id).then(dispatchProps.load);
					} else {
						dispatchProps.showRequestModal(vocabularyIds);
					}
				})
		},
		download(bundle: IDownloadRequest) {
			dispatchProps
				.checkAvailability(bundle.id)
				.then(({ accessible, vocabularyIds }) => {
					if (accessible) {
						window.open(bundle.link, '_blank');
					} else {
						dispatchProps.showRequestModal(vocabularyIds);
					}					
				});
		},
	};
}

export default connect<IDownloadHistoryStateProps, IDownloadHistoryDispatchProps, void>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps,
)(DownloadHistory);
