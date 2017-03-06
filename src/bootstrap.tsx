import * as React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { browserHistory, Router, RouteConfig, PlainRoute, RouteComponent } from 'react-router';
import { syncHistoryWithStore, routerReducer as routing } from 'react-router-redux';

import configureStore from 'stores/configureStore';
import { IStoreAsync, injectReducer } from 'stores/configureStore';
import IModule from './modules/IModule';
import AppContainer from './AppContainer';
import { injectAction } from 'actions';
import modulesActions from 'actions/modules';
import { IModuleMetadata } from 'actions/modules';
import { indexRoute as modulesIndexRoute, modules } from './modules';

let globalStore: IStoreAsync;

function buildRoutes(
	container: RouteComponent,
	indexRoute: PlainRoute,
	moduleRouteList: PlainRoute[]
): RouteConfig {
	const routes: PlainRoute = {
	  path: '/',
	  component: container,
	  indexRoute,
	  childRoutes: moduleRouteList,
	};

	return routes;
}

function registerModule(moduleMetadata: IModuleMetadata) {
	globalStore.dispatch(
		modulesActions.register(moduleMetadata)
	);
}

function setActiveModule(activeModulePath: string) {
	globalStore.dispatch(
		modulesActions.setActive(activeModulePath)
	);
}

function initModule(module: IModule): RouteConfig {
	// Inject module's action creators
	injectAction(module.namespace, module.actions);
	// Inject module's reducer
	injectReducer(globalStore, module.namespace, module.reducer);
	// Fire action when module is activated
	module.rootRoute.onEnter = (nextState, replace) => setActiveModule(module.rootRoute.path);
	// Register module in store
	registerModule({
		path: module.rootRoute.path,
		navbarElement: module.navbarElement,
	});
	// Return module's Route
	return module.rootRoute;
}

function buildStore() {
	return configureStore({});
}

function bootstrap() {
	const store = globalStore = buildStore();
	const history = syncHistoryWithStore(browserHistory, store);
	const modulesRoutes: PlainRoute[] = modules.map(initModule);
	const appRoutes: RouteConfig = buildRoutes(AppContainer, modulesIndexRoute, modulesRoutes);

	return (
		<Provider store={store}>
	    <Router routes={appRoutes} history={history} />
	  </Provider>
	);
}

export default bootstrap;
