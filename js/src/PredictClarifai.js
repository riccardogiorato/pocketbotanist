const Clarifai = require('clarifai');

export class PredictClarifai{
    // this.app;
    constructor() {
        this.app = new Clarifai.App({
            apiKey: 'bf19d5f4c6064ed0bd93ffe09cf2a4f0'
        });           
    }// constructor

    predict(image) {
        this.app.models.predict(Clarifai.GENERAL_MODEL, {base64: image}).then(
            function(response) {
                const arrConcepts = response['outputs'][0]['data']['concepts'];
                const flowers = arrConcepts.filter(obj => obj['name'] === 'flower');
                if(flowers[0]['value'] >= 0.51 ){
                    console.log("Clarifai found a flower!");
                }else{
                    console.log("Clarifai didn't find a flower... :(");
                }
                  
            },
            function(err) {
                console.error(err);
            }
        );
    }// predict

} 