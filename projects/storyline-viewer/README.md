# ngx-storyline-viewer

## Installation

```bash
npm install @cisl/ngx-storyline-viewer
```

## Usage

The app surfaces itself through the following tag:

```html
<ngx-storyline-viewer serviceUrl="http://localhost:3000">Loading...</ng-storyline-viewer>
```

The element supports the following options:

* `serviceUrl: string` (required)
* `count: number` (default: 10)
* `currentView: string` (default: 'all')
* `views: {[key: string]: View}` (default: `{}`)

On the element, it surfaces the following DOM events:

* storyline-views
* storyline-driver
