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

// TODO(traviskaufman): Come up with better UX solve when tabs wrapper scrolls due to tab focusing
// (e.g. on blur, reset scroll offset and translate properly so that active tab is in view.)?
// TODO(traviskaufman): Consider case where tabs inside scroller are adjusted programmatically
// (e.g. should we auto-translate the scroller to keep up with the tabs?).?

import MDCComponent from '@material/base/component';

import {MDCTab} from '../tab';
import {strings} from './constants';
import MDCTabsScrollerFoundation from './foundation';

export {MDCTabsScrollerFoundation};

export class MDCTabsScroller extends MDCComponent {
  static attachTo(root) {
    return new MDCTabsScroller(root);
  }

  get tabs() {
    return this.root_.tabs;
  }

  initialize() {
    this.mdcTabsInstance_ = this.root_;
    this.tabsWrapper_ = this.mdcTabsInstance_.root_;
    this.scrollFrame_ = this.tabsWrapper_.parentElement;
    this.shiftLeftTarget_ = this.scrollFrame_.previousElementSibling;
    this.shiftRightTarget_ = this.scrollFrame_.nextElementSibling;
    this.currentTranslateOffset_ = 0;
    this.computedFrameWidth_ = 0;
    // this.pointerDownRecognized_ = false;
    // this.bindEvents_();
    requestAnimationFrame(() => this.layout());
  }

  getDefaultFoundation() {
    return new MDCTabsScrollerFoundation({
      isRTL: () => getComputedStyle(this.root_.root_).getPropertyValue('direction') === 'rtl',
      registerLeftIndicatorInteractionHandler: (handler) => this.shiftLeftTarget_.addEventListener('click', handler),
      deregisterLeftIndicatorInteractionHandler: (handler) => this.shiftLeftTarget_.removeEventListener('click', handler),
      registerRightIndicatorInteractionHandler: (handler) => this.shiftRightTarget_.addEventListener('click', handler),
      deregisterRightIndicatorInteractionHandler: (handler) => this.shiftRightTarget_.removeEventListener('click', handler),
      registerWindowResizeHandler: (handler) => window.addEventListener('resize', handler),
      triggerNewLayout: () => requestAnimationFrame(() => this.layout()),
      scrollLeft: () => this.scrollLeft(),
      scrollRight: () => this.scrollRight(),
    });
  }

  // bindEvents_() {
  //   ['touchstart', 'mousedown'].forEach((evtType) => {
  //     this.el_.addEventListener(evtType, () => {
  //       this.pointerDownRecognized_ = true;
  //     }, true);
  //   });
  //
  //   this.el_.addEventListener('focus', (evt) => {
  //     if (this.pointerDownRecognized_) {
  //       this.el_.classList.remove(MDCTabsScroller.cssClasses.FOCUSED_CHILD);
  //     }
  //     else if (!isAncestorOf(evt.target, this.shiftLeftTarget_) &&
  //              !isAncestorOf(evt.target, this.shiftRightTarget_)) {
  //       this.el_.classList.add(MDCTabsScroller.cssClasses.FOCUSED_CHILD);
  //     }
  //     this.pointerDownRecognized_ = false;
  //   }, true);
  //
  //   this.el_.addEventListener('blur', (evt) => {
  //     if (!this.el_.classList.contains(MDCTabsScroller.cssClasses.FOCUSED_CHILD)) {
  //       return;
  //     }
  //     if (!evt.relatedTarget || !isAncestorOf(evt.relatedTarget, this.el_)) {
  //       this.el_.classList.remove(MDCTabsScroller.cssClasses.FOCUSED_CHILD);
  //     }
  //   }, true);
  //
  //   this.shiftLeftTarget_.addEventListener('click', (evt) => {
  //     evt.preventDefault();
  //     if (this.shiftLeftTarget_.classList.contains(MDCTabsScroller.cssClasses.INDICATOR_DISABLED)) {
  //       return;
  //     }
  //     this.scrollLeft();
  //   });
  //
  //   this.shiftRightTarget_.addEventListener('click', (evt) => {
  //     evt.preventDefault();
  //     if (this.shiftRightTarget_.classList.contains(MDCTabsScroller.cssClasses.INDICATOR_DISABLED)) {
  //       return;
  //     }
  //     this.scrollRight();
  //   });
  //
  //   window.addEventListener('resize', () => requestAnimationFrame(() => this.layout()));
  // }

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

  scrollLeft() {
    let tabToScrollTo;
    let tabWidthAccumulator = 0;

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

  scrollRight() {
    let scrollTarget;
    const frameOffset = this.computedFrameWidth_ + this.currentTranslateOffset_;

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
    this.tabsWrapper_.style.transform =
      this.tabsWrapper_.style.webkitTransform = `translateX(${-this.currentTranslateOffset_}px)`;
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
