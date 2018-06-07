# Your pocket botanist

"Botany is the science in which plants are known by their aliases."

## Basic Overview

This is the web application for the trained model for Pocket Botanist，it use parcel to bundle all the files.

## Installation

Just run `yarn install`.

## Usage

Start local development app server
`yarn start`
Build production app
`yarn build`

On netlify I used the custom command `cd js; yarn install; yarn run build; cp src/_redirects public/`
 

## Libraries and Modules used
- vue as UI framework to build different pages
- clarifai to conncet to their general model to find a flower, [code here](./src/machinea_learning/PredictClarifai.js);
- vue-router to manage different pages/URL from [index.js](./src/index.js);
- vue-material to create easily a nice material user interface, [pages here](./src/pages);
- Algorithmia.js to predict flower class from the serverless function deployed on Algorithmia, [code here]()(./src/machinea_learning/PredictAlgorithmia.js);
- tensorflow/tfjs to run the locally inside the browser the trained frozen model, [code here](./src/machinea_learning/ModelLoader.js).

## Notes
- _redirects file inside the src folder is needed to let netlify serve the index.html as a single page application source. 
- _headers inside the assets folder is used because the assets folder is deployed to [subdomain](https://models.pocketbotanist.ml) with CORS(Cross origin request) enabled thanks to that file config.

#### Frontend Hosting

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"/>
</a>
