import * as React from 'react';
import {
  PageContent,
  Panel,
  LoadingPanel,
  Link,
  ListItem,
  Tabs,
} from 'arachne-components';
import { RouterAction } from 'react-router-redux';
import BEMHelper from 'services/BemHelper';
import { get } from 'lodash';
import TermConnections from './components/Connections';
import TermConnectionsTable from './components/Table';
import TermFiltersPanel from './components/Filters';

require('./style.scss');

interface ITermStateProps {
  details: any;
  isLoading: boolean;
  name: string;
  termId: number;
  isTableMode: boolean;
  isStandard: boolean;
  relationshipsCount: number;
  termFilters: any;
};

interface ITermDispatchProps {
  fetch: (termId: number) => (dispatch: Function) => any;
  goBack: () => RouterAction;
  fetchConceptAncestors: (termId: number, levels: number) => (dispatch: Function) => any;
  fetchRelationships: (termId: number, standards: boolean) => (dispatch: Function) => any;
  redirect: (address: string) => (dispatch: Function) => any;
};

interface ITermProps extends ITermStateProps, ITermDispatchProps {
  changeTab: (tab: string) => any;
};

function Term(props: ITermProps) {
  const {
    details,
    goBack,
    isLoading,
    name,
    isTableMode,
    isStandard,
    relationshipsCount,
    termId,
    changeTab,
  } = props;
  const classes = BEMHelper('term');
  let title = 'Term connections';
  if (isTableMode && relationshipsCount) {
    title += ` (${relationshipsCount})`;
  }
  const tabs = [
    {
      label: <span {...classes('tab')}>Concept relationships</span>,
      value: 'graph',
      mods: ['purple'],
    },
    {
      label: <span {...classes('tab')}>Concept ancestors</span>,
      value: 'table',
      mods: ['purple'],
    },
  ];

  return (    
    <div {...classes()}>
      <div {...classes({ element: 'subheader-wrapper', extra: 'row' })}>
        <div className="col-xs-12">
          <div {...classes('subheader')}>
            <Link onClick={goBack} {...classes('subheader-back-btn')}>keyboard_backspace</Link>
            <span {...classes('subheader-title')}>{name}</span>
          </div>
        </div>
      </div>
      <div {...classes({ element: 'content', extra: 'row' })}>
        <div className="col-xs-12 col-md-5">
          <Panel title='Details'>
            <ul>
              <ListItem>
                <span {...classes('attribute-name')}>Domain ID</span>
                <span>{get(details, 'domain.id', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Concept Class ID</span>
                <span>{get(details, 'conceptClassId', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Vocabulary ID</span>
                <span>{get(details, 'vocabulary.id', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Concept ID</span>
                <span>{get(details, 'id', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Concept code</span>
                <span>{get(details, 'conceptCode', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Invalid reason</span>
                <span>{get(details, 'invalidReason', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Standard concept</span>
                <span>{get(details, 'standardConcept', '')}</span>
              </ListItem>
            </ul>
          </Panel>
        </div>
        <div className="col-xs-12 col-md-7">
          <Panel
            {...classes({ element: 'connections-wrapper', modifiers: { stretched: !isStandard || !isTableMode } })}
            title={title}
            headerBtns={() => {
                if (details && isStandard) {
                  return <Tabs
                    options={tabs}
                    onChange={changeTab}
                    value={isTableMode ? tabs[1].value : tabs[0].value}
                  />;
                }
              }
            }
          >
            {isTableMode || isStandard
              ? <TermFiltersPanel termId={termId} isTableMode={isTableMode} />
              : null
            }
            {isTableMode || !isStandard
              ? <TermConnectionsTable />
              : <TermConnections />
            }
          </Panel>
        </div>
      </div>
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default Term;
export {
  ITermProps,
  ITermStateProps,
  ITermDispatchProps,
};
