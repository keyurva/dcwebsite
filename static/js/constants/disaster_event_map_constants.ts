/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Constants used by disaster event map components.
 */

// The key to use for date option of last 30 days.
export const DATE_OPTION_30D_KEY = "lastThirtyDays";
// The key to use for date option of last 6 months.
export const DATE_OPTION_6M_KEY = "lastSixMonths";
// The key to use for date option of last 1 year.
export const DATE_OPTION_1Y_KEY = "lastYear";
// The key to use for date option of last 3 years.
export const DATE_OPTION_3Y_KEY = "last3Year";
// Special overrides for default date for a place. If place is not in this map,
// its default date will be DATE_OPTION_3Y_KEY
export const PLACE_DEFAULT_DATE = {
  Earth: DATE_OPTION_1Y_KEY,
};
export const DEFAULT_DATE = DATE_OPTION_3Y_KEY;
export const PROTO_DATE_MAPPING = {
  THIRTY_DAYS: DATE_OPTION_30D_KEY,
  SIX_MONTHS: DATE_OPTION_6M_KEY,
  ONE_YEAR: DATE_OPTION_1Y_KEY,
  THREE_YEARS: DATE_OPTION_3Y_KEY,
};
export const URL_HASH_PARAM_KEYS = {
  SEVERITY_FILTER: "filter",
  DATE: "date",
  USE_JSON: "json",
};
