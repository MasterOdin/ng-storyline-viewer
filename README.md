# ngx-storyline-viewer

![npm (scoped)](https://img.shields.io/npm/v/@cisl/ngx-storyline-viewer) ![Node.js CI](https://github.com/cislrpi/ngx-storyline-viewer/workflows/Node.js%20CI/badge.svg)

## Installation

```bash
npm install @cisl/ngx-storyline-viewer
```

## Usage

The app surfaces itself through the following tag:

```html
<ngx-storyline-viewer serviceUrl="http://localhost:3000">Loading...</ng-storyline-viewer>
```

### Inputs

The component supports the following inputs:

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

### Outputs

The component supports the following outputs:

* viewEvent, which outputs an object that contains the currently selected view, and all view objects. An example:

```js
{
    "currentView": "View 1",
    "views": {
        "View 1": {
            "people": Set(['A.J. Brown']),
            "companies": Set(['HP']),
            "organizations": Set()
        },
        "View 2": {
            "people": Set(),
            "companies": Set(),
            "organizations": Set()
        }
    }
}
```

Note: the `"all"` value for `currentView` represents the starting tab of "All Storylines".

* driverEvent, emitted when a driver chip is clicked on. Outputs the string representing the selected driver.

## Development

To work on the project, you need to run two pieces:

1. The mock SPA endpoint: `node mock_server.js`
2. The Angular demo project: `npm start`

Whenever any changes happen to the `storyline-viewer project`, you must re-build it by doing: `npm build`.

## Contributing

We are open to contributions.

* The software is provided under the [MIT license](LICENSE). Contributions to
this project are accepted under the same license.
* Please also ensure that each commit in the series has at least one
`Signed-off-by:` line, using your real name and email address. The names in
the `Signed-off-by:` and `Author:` lines must match. If anyone else
contributes to the commit, they must also add their own `Signed-off-by:`
line. By adding this line the contributor certifies the contribution is made
under the terms of the
[Developer Certificate of Origin (DCO)](DeveloperCertificateOfOrigin.txt).
* Questions, bug reports, et cetera are raised and discussed on the issues page.
* Please make merge requests into the master branch.
