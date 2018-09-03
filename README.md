# Currency Converter (ALC3.0)

  This is a web application that allows users to convert currencies from their web browser quickly and conveniently.  
  Scaffolded with [`Yeoman`](https://github.com/yeoman/generator-webapp).
  The app uses [Currency Converter API](https://www.currencyconverterapi.com/)'s currency api for fetching live conversion rates.
  
## Local Development

  - Clone or fork the repo
  - Go into the repo's directory
  - Run `npm install`
  - Run `npm run dev`

## Architecture

  The source code for the app is available in `/currency-converter/app`, split into the following directories:

  - `scripts`: contains the JavaScript files.  
  - `styles`: contains .scss stylesheets.

## Features

  | Feature | Description |
  | ------- | ----------- |
  | Convert currencies | Quickly convert currencies using the most current exchange rates |
  | Offline-first | The app works offline as well as online by storing the most recent used exchange rates |

## Dependencies

  - `gulp`  
  - `Babel`  
  - `sweetalert2`  
  - `idb`  
  - `browserify`  
