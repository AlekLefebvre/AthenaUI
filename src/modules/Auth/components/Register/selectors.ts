/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov
 * Created: December 7, 2018
 *
 */

import { createSelector } from 'reselect';
import { get } from 'lodash';

const getRawCountries = (state: Object) => <any[]> get(state, 'auth.countries.queryResult.result') || [];
const getRawProvinces = (state: Object) => <any[]> get(state, 'auth.provinces.queryResult.result') || [];

const getCountries = createSelector(
  getRawCountries,
  rawCountries => rawCountries.map(c => ({
    label: c.name,
    value: c.isoCode,
  }))
);

const getProvinces = createSelector(
  getRawProvinces,
  rawProvinces => rawProvinces.map( p => ({
    label: p.name,
    value: p.isoCode,
  }))
);

export default {
  getCountries,
  getProvinces,
};