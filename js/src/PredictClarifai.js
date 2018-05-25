const Clarifai = require('clarifai');

/**
 * This class predict content of an image with 
 * general clarifai model, telling if it found a flower
 * 
 * @export
 * @class PredictClarifai
 */
export class PredictClarifai {
  /**
   * construct a clarifai app
   */
  constructor() {
    this.app = new Clarifai.App({
      apiKey: "bf19d5f4c6064ed0bd93ffe09cf2a4f0"
    });
  } // constructor

  /**
   * return boolean === if image contains a flower
   * @param {*} image base64 image to send to Clarifai general model API
   */
  async isThereAFlower(image) {
    const response = await this.app.models.predict(Clarifai.GENERAL_MODEL, {
      base64: image
    });

    if (response) {
      const arrConcepts = response["outputs"][0]["data"]["concepts"];
      const flowers = arrConcepts.filter(obj => obj["name"] === "flower");

      if (flowers.length !== 0 && flowers[0]["value"] >= 0.51) {
        console.log("yes");
        return true;
      }

    } else console.log("error", response);

    return false;
  } // predict
}
