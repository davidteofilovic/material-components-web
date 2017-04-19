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

import MDCTabsScrollerFoundation from './foundation';

export {MDCTabsScrollerFoundation};

export class MDCTabsScroller extends MDCComponent {
  static attachTo(root) {
    return new MDCTabsScroller(root);
  }

  get listOfTabNodes() {
    const tabNodesArray =
      Array.prototype.slice.call(this.root_.querySelectorAll(MDCTabsScrollerFoundation.strings.TAB_SELECTOR));

    return tabNodesArray;
  }

  initialize() {
    this.isRTL = false;
    this.currentTranslateOffset_ = 0;
    this.computedFrameWidth_ = 0;
    this.scrollFrame = this.root_.querySelector(MDCTabsScrollerFoundation.strings.FRAME_SELECTOR);
    this.tabs = this.root_.querySelector(MDCTabsScrollerFoundation.strings.TABS_SELECTOR);
    this.shiftBackTarget = this.root_.querySelector(MDCTabsScrollerFoundation.strings.INDICATOR_BACK_SELECTOR);
    this.shiftForwardTarget = this.root_.querySelector(MDCTabsScrollerFoundation.strings.INDICATOR_FORWARD_SELECTOR);

    requestAnimationFrame(() => this.layout_());
  }

  getDefaultFoundation() {
    return new MDCTabsScrollerFoundation({
      isRTL: () =>
        getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      registerBackIndicatorInteractionHandler: (handler) =>
        this.shiftBackTarget.addEventListener('click', handler),
      deregisterBackIndicatorInteractionHandler: (handler) =>
        this.shiftBackTarget.removeEventListener('click', handler),
      registerForwardIndicatorInteractionHandler: (handler) =>
        this.shiftForwardTarget.addEventListener('click', handler),
      deregisterForwardIndicatorInteractionHandler: (handler) =>
        this.shiftForwardTarget.removeEventListener('click', handler),
      registerWindowResizeHandler: (handler) =>
        window.addEventListener('resize', handler),
      deregisterWindowResizeHandler: (handler) =>
        window.removeEventListener('resize', handler),
      triggerNewLayout: () => requestAnimationFrame(() => this.layout_()),
      scrollBack: (isRTL) => this.scrollBack(isRTL),
      scrollForward: (isRTL) => this.scrollForward(isRTL),
    });
  }

  scrollBack(isRTL) {
    let scrollTarget;
    let tabWidthAccumulator = 0;

    this.isRTL = isRTL;

    for (let i = this.listOfTabNodes.length - 1, tab; tab = this.listOfTabNodes[i]; i--) {
      const tabOffsetX = this.isRTL ?
        this.getRTLNormalizedOffsetLeftForTab_(tab) : tab.offsetLeft;

      if (tabOffsetX >= this.currentTranslateOffset_) {
        continue;
      }

      tabWidthAccumulator += tab.offsetWidth;

      if (tabWidthAccumulator > this.scrollFrame.offsetWidth) {
        scrollTarget = this.isRTL ?
          this.listOfTabNodes[this.listOfTabNodes.indexOf(tab) + 1] :
          this.listOfTabNodes[this.listOfTabNodes.indexOf(tab) - 1];
        break;
      }
    }

    if (!scrollTarget) {
      scrollTarget = this.listOfTabNodes[0];
    }

    this.scrollToTab_(scrollTarget);
  }

  scrollForward(isRTL) {
    let scrollTarget;
    const tabsOffset = this.computedFrameWidth_ + this.currentTranslateOffset_;

    this.isRTL = isRTL;

    for (const tab of this.listOfTabNodes) {
      const tabOffsetX = this.isRTL ?
        this.getRTLNormalizedOffsetLeftForTab_(tab) : tab.offsetLeft;

      if (tabOffsetX + tab.offsetWidth >= tabsOffset) {
        scrollTarget = tab;
        break;
      }
    }

    if (!scrollTarget) {
      return;
    }

    this.scrollToTab_(scrollTarget);
  }

  layout_() {
    this.computedFrameWidth_ = this.scrollFrame.offsetWidth;

    const isOverflowing = this.tabs.offsetWidth > this.computedFrameWidth_;

    if (isOverflowing) {
      this.tabs.classList.add(MDCTabsScrollerFoundation.cssClasses.VISIBLE);
    } else {
      this.tabs.classList.remove(MDCTabsScrollerFoundation.cssClasses.VISIBLE);
      this.currentTranslateOffset_ = 0;
      this.shiftFrame_();
    }

    this.updateIndicatorEnabledStates_();
  }

  scrollToTab_(tab) {
    this.currentTranslateOffset_ = this.isRTL ?
      this.tabs.offsetWidth - (tab.offsetLeft + tab.offsetWidth) :
      tab.offsetLeft;
    requestAnimationFrame(() => this.shiftFrame_());
  }

  getRTLNormalizedOffsetLeftForTab_(tab) {
    return this.tabs.offsetWidth - (tab.offsetLeft + tab.offsetWidth);
  }

  shiftFrame_() {
    const shiftAmount = this.isRTL ?
      this.currentTranslateOffset_ : -this.currentTranslateOffset_;

    this.tabs.style.transform =
      this.tabs.style.webkitTransform = `translateX(${shiftAmount}px)`;

    this.updateIndicatorEnabledStates_();
  }

  updateIndicatorEnabledStates_() {
    if (this.currentTranslateOffset_ === 0) {
      this.shiftBackTarget.classList.add(MDCTabsScrollerFoundation.cssClasses.INDICATOR_DISABLED);
    } else {
      this.shiftBackTarget.classList.remove(MDCTabsScrollerFoundation.cssClasses.INDICATOR_DISABLED);
    }

    if (this.currentTranslateOffset_ + this.scrollFrame.offsetWidth > this.tabs.offsetWidth) {
      this.shiftForwardTarget.classList.add(MDCTabsScrollerFoundation.cssClasses.INDICATOR_DISABLED);
    } else {
      this.shiftForwardTarget.classList.remove(MDCTabsScrollerFoundation.cssClasses.INDICATOR_DISABLED);
    }
  }
}
