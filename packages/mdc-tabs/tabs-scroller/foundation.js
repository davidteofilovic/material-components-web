/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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


import MDCFoundation from '@material/base/foundation';

import {cssClasses, strings} from './constants';

export default class MDCTabsScrollerFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      isRTL: () => /* boolean */ false,
      registerBackIndicatorInteractionHandler: (/* handler: EventListener */) => {},
      deregisterBackIndicatorInteractionHandler: (/* handler: EventListener */) => {},
      registerForwardIndicatorInteractionHandler: (/* handler: EventListener */) => {},
      deregisterForwardIndicatorInteractionHandler: (/* handler: EventListener */) => {},
      registerWindowResizeHandler: (/* handler: EventListener */) => {},
      deregisterWindowResizeHandler: () => {},
      triggerNewLayout: () => {},
      scrollBack: () => {},
      scrollForward: () => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCTabsScrollerFoundation.defaultAdapter, adapter));

    this.forwardIndicatorClickHandler = () => this.scrollForward(this.adapter_.isRTL());
    this.backIndicatorClickHandler = () => this.scrollBack(this.adapter_.isRTL());
  }

  init() {
    this.adapter_.registerBackIndicatorInteractionHandler(this.backIndicatorClickHandler);
    this.adapter_.registerForwardIndicatorInteractionHandler(this.forwardIndicatorClickHandler);
    this.adapter_.registerWindowResizeHandler(this.adapter_.triggerNewLayout);
  }

  destroy() {
    this.adapter_.deregisterBackIndicatorInteractionHandler(this.backIndicatorClickHandler);
    this.adapter_.deregisterForwardIndicatorInteractionHandler(this.forwardIndicatorClickHandler);
    this.adapter_.deregisterWindowResizeHandler(this.adapter_.triggerNewLayout);
  }

  scrollBack(isRTL) {
    this.adapter_.scrollBack(isRTL);
  }

  scrollForward(isRTL) {
    this.adapter_.scrollForward(isRTL);
  }
}
