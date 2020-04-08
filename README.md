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

A fully defined example:

```html
<ngx-storyline-viewer
    serviceUrl="http://localhost:3000"
    count="10"
    currentView="all"
    [views]="{'View1': {'people': ['A.J. Brown']}}"
>
    Loading...
</ngx-storyline-viewer>
```

## Development
