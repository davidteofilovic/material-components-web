# MDC Tabs

The MDC Tabs component is a spec-aligned tabbed navigation component adhering to the
[Material Design tabs guidelines](https://material.io/guidelines/components/tabs.html).

## Installation

```
npm install --save @material/tabs
```

## Tabs usage

Tabs allow users to explore and switch between different views.

```html
<nav id="basic-tabs" class="mdc-tabs">
  <a class="mdc-tab mdc-tab--active" href="#one">Item One</a>
  <a class="mdc-tab" href="#two">Item Two</a>
  <a class="mdc-tab" href="#three">Three</a>
  <span class="mdc-tabs__indicator"></span>
</nav>
```

### Using the Component

MDC Tabs ships with a Component / Foundation combo for MDC Tab (a tab), MDC Tabs
(a collection of items of type MDC Tab), and MDC Tabs Scroller (used when
MDC Tabs overflows the window). This allows for frameworks to richly integrate the
correct tab behaviors into idiomatic components.

#### Including in code

##### ES2015

```javascript
import {MDCTab, MDCTabFoundation} from 'mdc-tab';
import {MDCTabs, MDCTabsFoundation} from 'mdc-tabs';
import {MDCTabsScroller, MDCTabsScrollerFoundation} from 'mdc-tabs-scroller';
```

##### CommonJS

```javascript
const mdcTab = require('mdc-tab');
const MDCTab = mdcTab.MDCTab;
const MDCTabFoundation = mdcTab.MDCTabFoundation;

const mdcTabs = require('mdc-tabs');
const MDCTabs = mdcTabs.MDCTabs;
const MDCTabsFoundation = mdcTabs.MDCTabsFoundation;

const mdcTabsScroller = require('mdc-tabs-scroller');
const MDCTabsScroller = mdcTabsScroller.MDCTabsScroller;
const MDCTabsScrollerFoundation = mdcTab.MDCTabsScrollerFoundation;
```

##### AMD

```javascript
require(['path/to/mdc-tab'], mdcTab => {
  const MDCTab = mdcTab.MDCTab;
  const MDCTabFoundation = mdcTab.MDCTabFoundation;
});

require(['path/to/mdc-tabs'], mdcTabs => {
  const MDCTabs = mdcTabs.MDCTabs;
  const MDCTabsFoundation = mdcTabs.MDCTabsFoundation;
});

require(['path/to/mdc-tabs-scroller'], mdcTabsScroller => {
  const MDCTabsScroller = mdcTabsScroller.MDCTabsScroller;
  const MDCTabsScrollerFoundation = mdcTabsScroller.MDCTabsScrollerFoundation;
});
```

##### Global

```javascript
const MDCTab = mdc.tab.MDCTab;
const MDCTabFoundation = mdc.tab.MDCTabFoundation;

const MDCTabs = mdc.tabs.MDCTabs;
const MDCTabsFoundation = mdc.tabs.MDCTabsFoundation;

const MDCTabsScroller = mdc.tabsScroller.MDCTabsScroller;
const MDCTabsScrollerFoundation = mdc.tabsScroller.MDCTabsScrollerFoundation;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the tabs, simply call `attachTo()`
and pass it a DOM element.

```javascript
mdc.tabs.MDCTabs.attachTo(document.querySelector('#my-mdc-tabs'));
```

#### Manual Instantiation

Tabs can easily be initialized using their default constructors as well, similar to `attachTo`.

```javascript
import {MDCTabs} from 'mdc-tabs';

const tabs = new MDCTabs(document.querySelector('#my-mdc-tabs'));
```

### Tab component API

#### MDCTab.destroy() => void

Cleans up ripple when tab is destroyed

### Tab Events

#### MDCTab:selected

Broadcast when a user actions on the tab.


### Using the Foundation Class

MDC Tab ships with an `MDCTabFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.

> **NOTE**: Components themselves must manage adding ripples to dialog buttons, should they choose to
do so. We provide instructions on how to add ripples to buttons within the [mdc-button README](https://github.com/material-components/material-components-web/tree/master/packages/mdc-button#adding-ripples-to-buttons).

### Adapter API

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `registerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the root element, for the specified event name. |
| `deregisterInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from the root element, for the specified event name. |
| `getOffsetWidth() => number` | Return the width of the tab |
| `getOffsetLeft() => number` | Return distance between left edge of tab and left edge of its parent element |
| `notifySelected() => {}` | Broadcasts an event denoting that the user has actioned on the tab |


### The full foundation API

#### MDCTabFoundation.getComputedWidth() => number

Return computed width for tab

#### MDCTabFoundation.getComputedLeft() => number

Return computed left offset for tab

#### MDCTabFoundation.isActive() => boolean

Return true if tab is active

#### MDCTabFoundation.setActive(isActive = false) => void

Set tab to active. If `isActive` is true, adds the active modifier class, otherwise removes it.

#### MDCTabFoundation.preventsDefaultOnClick() => boolean

Return true if the tab prevents the default click action

#### MDCTabFoundation.setPreventDefaultOnClick(preventDefaultOnClick = false) => void

Sets tabs `preventDefaultOnClick` property to the value of the `preventDefaultOnClick` argument passed.

#### MDCTabFoundation.measureSelf() => void

Sets `computedWidth_` and `computedLeft_` for a tab.


### Tabs component API

#### MDCTabs.initialize() => void

Gathers instances of MDC Tab.

#### MDCTabs.initialSyncWithDOM() => void

Syncs with tab selected in DOM

### Tabs Events

#### MDCTabs:change

Broadcast when a user actions on the tabs, causing a change in selected tab.


### Using the Foundation Class

MDC Tabs ships with an `MDCTabsFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.


### Adapter API

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `bindOnMDCTabSelectedEvent() => void` | Adds `MDCTab:selected` event listener to root |
| `unbindOnMDCTabSelectedEvent() => void` | Removes `MDCTab:selected` event listener from root |
| `registerResizeHandler(handler: EventListener) => void` | Adds an event listener to the root element, for a resize event. |
| `deregisterResizeHandler(handler: EventListener) => void` | Removes an event listener from the root element, for a resize event. |
| `getOffsetWidth() => number` | Returns width of root element. |
| `setStyleForIndicator(propertyName: string, value: string) => void` | Sets style property for indicator. |
| `getOffsetWidthForIndicator() => number` | Returns width of indicator. |
| `notifyChange(evtData: Object) => void` | Emits `MDCTabs:change` event, passes evtData. |
| `getNumberOfTabs() => number` | Returns number of tabs in MDC Tabs instance. |
| `getActiveTab() => MDCTab` | Returns the instance of MDCTab that is currently active. |
| `isTabActiveAtIndex(index: number) => boolean` | Returns true if tab at index is active. |
| `setTabActiveAtIndex(index: number) => void` | Sets tab active at given index. |
| `isDefaultPreventedOnClickForTabAtIndex(index: number) => boolean` | Returns true if tab does not prevent default click action. |
| `setPreventDefaultOnClickForTabAtIndex(index: number, preventDefaultOnClick: boolean)` | Sets preventDefaultOnClick for tab at given index |
| `measureTabAtIndex(index: number) => void` | sets measurements (width, left offset) for tab at given index. |
| `getComputedWidthForTabAtIndex(index: number) => number` | Returns width of tab at given index. |
| `getComputedLeftForTabAtIndex(index: number) => number` | Returns left offset of tab at given index. |


### The full foundation API

#### MDCTabsFoundation.layout() => void

Sets layout for Tabs component.

#### MDCTabFoundation.getActiveTabIndex() => number

Returns index of currently active tab

#### MDCTabFoundation.getComputedWidth() => number

Returns the width of the element containing the tabs.

#### MDCTabFoundation.switchToTabAtIndex(index, shouldNotify) => void

Updates the active tab to be the tab at the given index, emits `MDCTabs:change` if `shouldNotify` is true.



### Tabs Scroller component API

#### MDCTabsScroller.initialize() => void

initializes instance of MDC Tabs to be used.

#### MDCTabs.layout() => void

Lays out left and right indicators, prepares logic for shifting tabs in the scroll frame.

#### MDCTabs.scrollLeft() => void

Scrolls tabs left. If clicked, tabs will shift to the left, revealing tabs previously overflowed to the right.
This reverses if tabs are in an RTL context.

#### MDCTabs.scrollRight() => void

Scrolls tabs right. If clicked, tabs will shift to the right, revealing tabs previously overflowed to the left.
This reverses if tabs are in an RTL context.

#### MDCTabs.scrollToTab(tab: MDCTab) => void

Shifts to a given tab.


### Using the Foundation Class

MDC Tabs Scroller ships with an `MDCTabsScrollerFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.


### Adapter API

| Method Signature | Description |
| --- | --- |
| `isRTL() => boolean` | Returns true if the component exists within an RTL context. |
| `registerLeftIndicatorInteractionHandler(handler: EventHandler) => void` | Registers an event listener on the shift left indicator. |
| `deregisterLeftIndicatorInteractionHandler(handler: EventHandler) => void` | Deregisters an event listener from the shift left indicator. |
| `registerRightIndicatorInteractionHandler(handler: EventHandler) => void` | Registers an event listener on the shift right indicator. |
| `deregisterRightIndicatorInteractionHandler(handler: EventHandler) => void` | Deregisters an event listener from the shift right indicator. |
| `registerWindowResizeHandler(handler) => void` | Registers an `resize` event listener on the `window` |
| `deregisterWindowResizeHandler(handler) => void` | Deregisters an `resize` event listener from the `window` |
| `triggerNewLayout() => void` | Triggers a new layout render |
| `scrollLeft(isRTL: boolean) => void` | Scrolls left if isRTL is false. Scrolls right otherwise |
| `scrollRight(isRTL: boolean) => void` | Scrolls right if isRTL is false. Scrolls left otherwise |


### The full foundation API

#### MDCTabsFoundation.scrollRight(isRTL) => void

Calls the adapters `scrollRight()` method and passes RTL context as an argument.

#### MDCTabsFoundation.scrollLeft(isRTL) => void

Calls the adapters `scrollLeft()` method and passes RTL context as an argument.


## Theming

> **NOTE**: Tabs can have multiple theme color combinations. [The demo site](http://material-components-web.appspot.com/tabs.html) demonstrates the multitude of options when deciding on a theme.**

### Dark Theme

#### MDC Tab
```
Color: text-secondary-on-dark
Hover/Press/Active Color: text-primary-on-dark
Outline color on focus: text-secondary-on-dark
```

#### MDC Tabs
```
Indicator color: text-primary-on-dark
Ripple color: white
```

#### MDC Tabs Scroller
```
Fwd/Back indicator color: text-secondary-on-dark
Hover/Pressed indicator color: text-primary-on-dark
Disabled indicator color: text-disabled-on-dark
Indicator outline color on focus: text-secondary-on-dark
```
