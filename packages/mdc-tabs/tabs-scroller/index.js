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

import MDCComponent from '@material/base/component';

import {MDCTabs} from '../tabs';
import {strings} from './constants';
import MDCTabsScrollerFoundation from './foundation';

export {MDCTabsScrollerFoundation};

export class MDCTabsScroller extends MDCComponent {
  static attachTo(root, tabs) {

    return new MDCTabsScroller(root, undefined, tabs);
  }

  initialize(tabs) {
    this.isRTL = false;
    this.mdcTabsInstance_ = tabs;
    this.tabsWrapper_ = this.mdcTabsInstance_.root_;
    this.scrollFrame_ = this.tabsWrapper_.parentElement;
    this.shiftLeftTarget_ = this.scrollFrame_.previousElementSibling;
    this.shiftRightTarget_ = this.scrollFrame_.nextElementSibling;
    this.currentTranslateOffset_ = 0;
    this.computedFrameWidth_ = 0;
    requestAnimationFrame(() => this.layout());
  }

  getDefaultFoundation() {
    return new MDCTabsScrollerFoundation({
      isRTL: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      registerLeftIndicatorInteractionHandler: (handler) => this.shiftLeftTarget_.addEventListener('click', handler),
      deregisterLeftIndicatorInteractionHandler: (handler) => this.shiftLeftTarget_.removeEventListener('click', handler),
      registerRightIndicatorInteractionHandler: (handler) => this.shiftRightTarget_.addEventListener('click', handler),
      deregisterRightIndicatorInteractionHandler: (handler) => this.shiftRightTarget_.removeEventListener('click', handler),
      registerWindowResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterWindowResizeHandler: (handler) => window.removeEventListener('resize', handler),
      triggerNewLayout: () => requestAnimationFrame(() => this.layout()),
      scrollLeft: (isRTL) => this.scrollLeft(isRTL),
      scrollRight: (isRTL) => this.scrollRight(isRTL),
    });
  }

  layout() {
    this.computedFrameWidth_ = this.scrollFrame_.offsetWidth;

    const isOverflowing = this.tabsWrapper_.offsetWidth > this.computedFrameWidth_;

    if (isOverflowing) {
      this.tabsWrapper_.classList.add(MDCTabsScrollerFoundation.cssClasses.VISIBLE);
    }
    else {
      this.tabsWrapper_.classList.remove(MDCTabsScrollerFoundation.cssClasses.VISIBLE);
      this.currentTranslateOffset_ = 0;
      this.shiftFrame_();
    }

    this.updateIndicatorEnabledStates_();
  }

  scrollLeft(isRTL) {
    let tabToScrollTo;
    let tabWidthAccumulator = 0;
    this.isRTL = isRTL;

    for (let i = this.mdcTabsInstance_.tabs.length - 1, tab; tab = this.mdcTabsInstance_.tabs[i]; i--) {
      if (tab.computedLeft_ >= this.currentTranslateOffset_) {
        continue;
      }

      tabWidthAccumulator += tab.computedWidth_;

      if (tabWidthAccumulator > this.computedFrameWidth_) {
        tabToScrollTo = this.mdcTabsInstance_.tabs[this.mdcTabsInstance_.tabs.indexOf(tab) + 1];
        break;
      }
    }

    if (!tabToScrollTo) {
      tabToScrollTo = this.mdcTabsInstance_.tabs[0];
    }

    this.scrollToTab(tabToScrollTo);
  }

  scrollRight(isRTL) {
    let scrollTarget;
    const frameOffset = this.computedFrameWidth_ + this.currentTranslateOffset_;
    this.isRTL = isRTL;

    for (let tab of this.mdcTabsInstance_.tabs) {
      if (tab.computedLeft_ + tab.computedWidth_ >= frameOffset) {
        scrollTarget = tab;
        break;
      }
    }

    if (!scrollTarget) {
      return;
    }

    this.scrollToTab(scrollTarget);
  }

  scrollToTab(tab) {
    this.currentTranslateOffset_ = tab.computedLeft_;
    requestAnimationFrame(() => this.shiftFrame_());
  }

  shiftFrame_() {
    let shiftDistance = this.isRTL ?
      this.currentTranslateOffset_ : -this.currentTranslateOffset_;

    this.tabsWrapper_.style.transform =
      this.tabsWrapper_.style.webkitTransform = `translateX(${shiftDistance}px)`;

    this.updateIndicatorEnabledStates_();
  }

  updateIndicatorEnabledStates_() {
    if (this.currentTranslateOffset_ === 0) {
      this.shiftLeftTarget_.classList.add(MDCTabsScrollerFoundation.cssClasses.INDICATOR_DISABLED);
    }
    else {
      this.shiftLeftTarget_.classList.remove(MDCTabsScrollerFoundation.cssClasses.INDICATOR_DISABLED);
    }

    if (this.currentTranslateOffset_ + this.computedFrameWidth_ > this.tabsWrapper_.offsetWidth) {
      this.shiftRightTarget_.classList.add(MDCTabsScrollerFoundation.cssClasses.INDICATOR_DISABLED);
    }
    else {
      this.shiftRightTarget_.classList.remove(MDCTabsScrollerFoundation.cssClasses.INDICATOR_DISABLED);
    }
  }
}
