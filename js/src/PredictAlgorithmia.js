//import Algorithmia from "./Algorithmia"

/**
 * This class predict content of an image with the 
 * custom Algorithmia serverless function, telling the class of a flower
 * 
 * @export
 * @class PredictAlgorithmia
 */
export class PredictAlgorithmia {
  /**
   * construct a clarifai app
   */
  constructor() {
    this.apiKey = "simj8qWc7hacc8hWeSw6e+oJe/d1";
    this.projectName = "riccardogiorato/yourPocketbotanist/0.1.1";
  } // constructor

  /**
   * return boolean === if image contains a flower
   * @param {*} image base64 image to send to Algorithmia function
   */
  async predict(image) {

    return await new Promise(resolve => {
      Algorithmia.client(this.apiKey)
        .algo(this.projectName)
        .pipe(image)
        .then(function (output) {
          resolve(output.result);
        });
    });


    /*return await new Promise(resolve => {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.algorithmia.com/v1/web/algo/riccardogiorato/yourPocketbotanist/0.1.1/", true);
      xhr.setRequestHeader("Authorization", "Simple" +  this.apiKey);
      xhr.setRequestHeader("Content-type", "text/plain");
      xhr.setRequestHeader("user", "riccardogiorato");
    
      xhr.onload = function(e) {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        resolve(undefined);
        console.log("** An error occurred during the XMLHttpRequest");
      };

      xhr.send(image);
    }) */

  } // predict
}