# Portfolio Task Burn Up/Down

## Summary/Description
This app is a combination of per-feature task hour "To Do" burndown with task "Actual" burnup several custom
metrics.

![screenshot](./images/screenshot.png "This is an example")

### Features:
#### Chart controls
* Mouse over any field to see its values
* Drag a rectangle to zoom that area of the chart
* Click items in the Legend to turn that field on or off

#### Chart fields
* **Select Release** (_in app settings_) - The app will search up the project hierarchy for any
`PortfolioItem/Feature` whose `Release.Name` matches the selected Release.
* **Select Portfolio Items** (_in app settings_) - Select any number of individual Portfolio Items
(Features, Initiatives, etc).
* **Start / End Dates** - Based on **one of**
  * (release selected) the **first** release found in the project hierarchy that matches the
  selected `Release.Name`. **NOTE:** This might be the per-project release, NOT the parent release
  containing features.
  * (PIs selected) the earliest actual and latest end date of the selected PIs, defaulting to today
  if no dates are set on the PIs
* **Total To Do** - Burndown chart of the sum of all child stories `TaskRemainingTotal` values from
the given features. Each column is stacked by feature, and has rounded corners.  A line connects
the top of all bars to make the trend easier to see.
* **Total Actual** - Burndown chart of the sum of all child stories `TaskActual` values from
the given features. Each column is stacked by feature, and has square corners.  A line connects
the top of all bars to make the trend easier to see.
* **Preliminary Estimate** - Summary line showing the total `Feature.c_InitialHourEstimate` for all
features.
* **Refined Estimate** - Line showing the updated total of all `TaskEstimateTotal`.
* **Ideal** - Linear burndown assuming that the current max `TaskEstimateTotal` was known at the start
and indicates the contant rate hours need to be completed to finish on the planned end date.
* **Ideal Capacity Based Burndown** - Same as the **Ideal** except is burns down by the total `UserIterationCapacity`
values found for the current project that span the current day.
* **Future Ideal Capacity Based Burndown** - Starting on the most current day of the chart, at that
day's `TaskRemainingTotal`, and burns down by the total `UserIterationCapacity` values from that day.  Shows
roughly when team is forecast to finish based on their scheduled Iteration Capacity.

### Limitations

* Per-feature colors will repeat after 12 features

## Development Notes


### First Load

If you've just downloaded this from github and you want to do development, 
you're going to need to have these installed:

 * node.js
 * grunt-cli
 * grunt-init
 
Since you're getting this from github, we assume you have the command line
version of git also installed.  If not, go get git.

If you have those three installed, just type this in the root directory here
to get set up to develop:

  npm install

#### Deployment & Tests

If you want to use the automatic deployment mechanism, be sure to use the 
**makeauth** task with grunt to create a local file that is used to connect
to Rally.  This resulting auth.json file should NOT be checked in.

### Structure

  * src/javascript:  All the JS files saved here will be compiled into the 
  target html file
  * src/style: All of the stylesheets saved here will be compiled into the 
  target html file
  * templates: This is where templates that are used to create the production
  and debug html files live.  The advantage of using these templates is that
  you can configure the behavior of the html around the JS.
  * config.json: This file contains the configuration settings necessary to
  create the debug and production html files.  
  * package.json: This file lists the dependencies for grunt
  * auth.json: This file should NOT be checked in.  This file is needed for deploying
  and testing.  You can use the makeauth task to create this or build it by hand in this'
  format:
    {
        "username":"you@company.com",
        "password":"secret",
        "server": "https://rally1.rallydev.com"
    }

### Basic File Purpose
* src/javascript
   * app.js - load data and create a chart
   * Calculator.js - convert Lookback data for stories into a Highchart
   * DateManager.js - Determine Start/End dates from Features/Release
   * DateRange.js - Merge start/actual/end dates from features and releases
   * FeatureManager.js - Load appropriate features
   * StoriesManager.js - Load appropriate user stories
   * UserIterationsCapacitiesManager.js - Load UserIterationCapacities for date range
   * settings/
     * PortfolioItemPicker.js - Application settings page
     * Utils.js - Helpers to serialize/deserialize complex settings
  
### Usage of the grunt file

#### Tasks
    
##### grunt debug

Use grunt debug to create the debug html file.  You only need to run this when you have added new files to
the src directories.

##### grunt build

Use grunt build to create the production html file.  We still have to copy the html file to a panel to test.

##### grunt test-fast

Use grunt test-fast to run the Jasmine tests in the fast directory.  Typically, the tests in the fast 
directory are more pure unit tests and do not need to connect to Rally.

##### grunt test-slow

Use grunt test-slow to run the Jasmine tests in the slow directory.  Typically, the tests in the slow
directory are more like integration tests in that they require connecting to Rally and interacting with
data.

##### grunt deploy

Use grunt deploy to build the deploy file and then install it into a new page/app in Rally.  It will create the page on the Home tab and then add a custom html app to the page.  The page will be named using the "name" key in the config.json file (with an asterisk prepended).

You can use the makeauth task to create this file OR construct it by hand.  Caution: the 
makeauth task will delete this file.

The auth.json file must contain the following keys:
{
    "username": "fred@fred.com",
    "password": "fredfredfred",
    "server": "https://us1.rallydev.com"
}

(Use your username and password, of course.)  NOTE: not sure why yet, but this task does not work against the demo environments.  Also, .gitignore is configured so that this file does not get committed.  Do not commit this file with a password in it!

When the first install is complete, the script will add the ObjectIDs of the page and panel to the auth.json file, so that it looks like this:

{
    "username": "fred@fred.com",
    "password": "fredfredfred",
    "server": "https://us1.rallydev.com",
    "pageOid": "52339218186",
    "panelOid": 52339218188
}

On subsequent installs, the script will write to this same page/app. Remove the
pageOid and panelOid lines to install in a new place.  CAUTION:  Currently, error checking is not enabled, so it will fail silently.

##### grunt deploy-pretty

Same as `grunt deploy` but deploys the unminified version.

##### grunt deploy-debug
Same as ` grunt deploy` but deploys the unminified app and a debug version of the SDK.


##### grunt watch

Run this to watch files (js and css).  When a file is saved, the task will automatically build, run fast tests, and deploy as shown in the deploy section above.

##### grunt makeauth

This task will create an auth.json file in the proper format for you.  **Be careful** this will delete any existing auth.json file.  See **grunt deploy** to see the contents and use of this file.

##### grunt --help  

Get a full listing of available targets.

### NPM Scripts

Some helper scripts to provide variations on the grunt watch tasks

##### npm run deploy-debug:watch

Watches source for changes and re-deploys the debug version of the app.
