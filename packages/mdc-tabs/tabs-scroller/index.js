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
  static get cssClasses() {
    return {
      VISIBLE: 'mdc-tabs-scroller--visible',
      FOCUSED_CHILD: 'mdc-tabs-scroller--focused-child',
      INDICATOR_DISABLED: 'mdc-tabs-scroller__indicator--disabled',
    };
  }
  
  static get strings() {
    return {
      WRAPPER_SELECTOR: '.mdc-tabs-scroller__tabs-wrapper',
      INDICATOR_LEFT_SELECTOR: '.mdc-tabs-scroller__indicator--left',
      INDICATOR_RIGHT_SELECTOR: '.mdc-tabs-scroller__indicator--right',
    }
  }
  
  constructor(el, tabs) {
    super();
    this.el_ = el;
    this.tabs_ = tabs;
    this.tabsWrapper_ = this.el_.querySelector(MDCTabsScroller.strings.WRAPPER_SELECTOR);
    this.leftIndicator_ = this.el_.querySelector(MDCTabsScroller.strings.INDICATOR_LEFT_SELECTOR);
    this.rightIndicator_ = this.el_.querySelector(MDCTabsScroller.strings.INDICATOR_RIGHT_SELECTOR);
    this.pointerDownRecognized_ = false;
    this.computedWrapperWidth_ = 0;
    this.computedWidth_ = 0;
    this.currentTranslateOffset_ = 0;
    this.bindEvents_();
    requestAnimationFrame(() => this.layout());
  }

  getDefaultFoundation() {
    return new MDCTabsScrollerFoundation({
			addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => {},
      registerInteractionHandler: (/* type: string, handler: EventListener, useCapture: boolean */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerResizeHandler: (/* handler: EventListener */) => {},
      deregisterResizeHandler: (/* handler: EventListener */) => {},
      eventTargetHasClass: (/* target: EventTarget, className: string */) => /* boolean */ false,
      isEventTargetAncestorOfForwardIndicator: (/* target: EventTarget */) => /* boolean */ false,
      isEventTargetAncestorOfBackIndicator: (/* target: EventTarget */) => /* boolean */ false,
      addClassToBackIndicator: (/* className: string */) => {},
      removeClassFromBackIndicator: (/* className: string */) => {},
      backIndicatorHasClass: (/* className: string */) => {},
      addClassToForwardIndicator: (/* className: string */) => {},
      removeClassFromForwardIndicator: (/* className: string */) => {},
      forwardIndicatorHasClass: (/* className: string */) => {},
      layoutTabs: () => {},
      getOffsetWidth: () => /* number */ 0,
      getBackIndicatorOffsetWidth: () => /* number */ 0,
      getForwardIndicatorOffsetWidth: () => /* number */ 0,
      getNumberOfTabs: () => /* number */ 0,
      getOffsetLeftForTabAtIndex: (/* index: number */) => /* number */ 0,
      getOffsetWidthForTabAtIndex: (/* index: number */) => /* number */ 0,
      setStyleForWrapperElement: (/* propertyName: string, value: string */) => {},
      isRTL: () => /* boolean */ false,
		});
  }

  get tabs() {
    return this.tabs_;
  }
  
  bindEvents_() {
    ['touchstart', 'mousedown'].forEach((evtType) => {
      this.el_.addEventListener(evtType, () => {
        this.pointerDownRecognized_ = true;
      }, true);
    });
    
    this.el_.addEventListener('focus', (evt) => {
      if (this.pointerDownRecognized_) {
        this.el_.classList.remove(MDCTabsScroller.cssClasses.FOCUSED_CHILD);
      }
      else if (!isAncestorOf(evt.target, this.leftIndicator_) &&
               !isAncestorOf(evt.target, this.rightIndicator_)) {
        this.el_.classList.add(MDCTabsScroller.cssClasses.FOCUSED_CHILD);
      }
      this.pointerDownRecognized_ = false;
    }, true);
    
    this.el_.addEventListener('blur', (evt) => {
      if (!this.el_.classList.contains(MDCTabsScroller.cssClasses.FOCUSED_CHILD)) {
        return;
      }
      if (!evt.relatedTarget || !isAncestorOf(evt.relatedTarget, this.el_)) {
        this.el_.classList.remove(MDCTabsScroller.cssClasses.FOCUSED_CHILD);
      }
    }, true);
    
    this.leftIndicator_.addEventListener('click', (evt) => {
      evt.preventDefault();
      if (this.leftIndicator_.classList.contains(MDCTabsScroller.cssClasses.INDICATOR_DISABLED)) {
        return;
      }
      this.scrollLeft();
    });
    
    this.rightIndicator_.addEventListener('click', (evt) => {
      evt.preventDefault();
      if (this.rightIndicator_.classList.contains(MDCTabsScroller.cssClasses.INDICATOR_DISABLED)) {
        return;
      }
      this.scrollRight();
    });
    
    window.addEventListener('resize', () => requestAnimationFrame(() => this.layout()));
  }
  
  layout() {
    this.tabs.layout();
    this.computedWrapperWidth_ = this.tabsWrapper_.offsetWidth;
    this.computedWidth_ =
      this.el_.offsetWidth - this.leftIndicator_.offsetWidth - this.rightIndicator_.offsetWidth;
    const isOverflowing = this.el_.offsetWidth < this.computedWrapperWidth_;
    if (isOverflowing) {
      this.el_.classList.add(MDCTabsScroller.cssClasses.VISIBLE);
    }
    else {
      this.el_.classList.remove(MDCTabsScroller.cssClasses.VISIBLE);
      this.currentTranslateOffset_ = 0;
      this.shiftWrapper_();
    }
    this.updateIndicatorEnabledStates_();
  }
  
  scrollLeft() {
    var tabToScrollTo;
    // TODO better name
    let accum = 0;
    let viewAreaMin = this.currentTranslateOffset_;
    for (let i = this.tabs.tabs.length - 1, tab; tab = this.tabs.tabs[i]; i--) {
      if (tab.computedLeft > viewAreaMin) {
        continue;
      }
      accum += tab.computedWidth;
      if (accum >= this.computedWidth_) {
        tabToScrollTo = tab;
        break;
      }
    }
    if (!tabToScrollTo) {
      if (!accum) {
        return;
      }
      tabToScrollTo = this.tabs.tabs[0];
    }
    this.scrollToTab(tabToScrollTo);
  }
  
  scrollRight() {
    var tabToScrollTo;
    // TODO better name
    const viewAreaMax = this.currentTranslateOffset_ + this.computedWidth_;
    for (let tab of this.tabs.tabs) {
      if (tab.computedLeft + tab.computedWidth >= viewAreaMax) {
        tabToScrollTo = tab;
        break;
      }
    }
    if (!tabToScrollTo) {
      return;
    }
    this.scrollToTab(tabToScrollTo);
  }
  
  scrollToTab(tab) {
    this.currentTranslateOffset_ = tab.computedLeft;
    requestAnimationFrame(() => this.shiftWrapper_());
  }
  
  shiftWrapper_() {
    this.tabsWrapper_.style.transform =
      this.tabsWrapper_.style.webkitTransform = `translateX(${-this.currentTranslateOffset_}px)`;
    this.updateIndicatorEnabledStates_();
  }
  
  updateIndicatorEnabledStates_() {
    if (this.currentTranslateOffset_ === 0) {
      this.leftIndicator_.classList.add(MDCTabsScroller.cssClasses.INDICATOR_DISABLED);
    }
    else {
      this.leftIndicator_.classList.remove(MDCTabsScroller.cssClasses.INDICATOR_DISABLED);
    }
    if (this.currentTranslateOffset_ + this.computedWidth_ >= this.computedWrapperWidth_) {
      this.rightIndicator_.classList.add(MDCTabsScroller.cssClasses.INDICATOR_DISABLED);
    }
    else {
      this.rightIndicator_.classList.remove(MDCTabsScroller.cssClasses.INDICATOR_DISABLED);
    }
  }
}
