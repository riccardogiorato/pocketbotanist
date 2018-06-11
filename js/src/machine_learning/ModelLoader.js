import {
  div,
  sub,
  tidy,
  softmax,
  scalar,
  loadFrozenModel
} from "@tensorflow/tfjs";

import {
  IMAGE_CLASSES
} from "../classes";

/**
 * This class loads your custom frozen tensorflow model
 * just pass the model remote location and names for input and output nodes
 * @export
 * @class ModelLoader
 */
export class ModelLoader {
  /**
   * construct a tensorflow.js frozen model
   */
  constructor() {
    this.CURRENT_ASSETS_DIR = "https://models.pocketbotanist.ml/";
    this.MODEL_FILE_URL = "tensorflowjs_model.pb";
    this.WEIGHT_MANIFEST_FILE_URL = "weights_manifest.json";
    this.INPUT_NODE_NAME = "Placeholder";
    this.OUTPUT_NODE_NAME = "loss";
    this.PREPROCESS_DIVISOR = scalar(255 / 2);
  } // constructor

  /**
   * load the remote tensorflow model and weight
   */
  async load() {
    this.model = await loadFrozenModel(
      this.CURRENT_ASSETS_DIR + this.MODEL_FILE_URL,
      this.CURRENT_ASSETS_DIR + this.WEIGHT_MANIFEST_FILE_URL
    );
  }

  /**
   * dispose the model from memory when not needed anymore
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }

  /**
   * @param input un-preprocessed input Array.
   * @return The logits.
   */
  predict(input) {
    const preprocessedInput = div(
      sub(input.asType('float32'), this.PREPROCESS_DIVISOR),
      this.PREPROCESS_DIVISOR);
    const reshapedInput =
      preprocessedInput.reshape([1, ...preprocessedInput.shape]);
    return this.model.execute({
      [this.INPUT_NODE_NAME]: reshapedInput
    }, this.OUTPUT_NODE_NAME);
  }

  /**
   * get the first prediction, max value
   * @param {*} predictions the return from predict function
   */
  getFoundClasse(predictions) {
    const preds = this.getTopKClasses(predictions, 7);
    console.dir(preds);
    return preds;
  }

  /**
   * get the first topK predictions
   * @param {*} predictions the return from predict function
   * @param {*} topK number of predictions to return
   */
  getTopKClasses(logits, topK) {
    const predictions = tidy(() => {
      return softmax(logits);
    });

    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({
        value: values[i],
        index: i
      });
    }
    predictionList = predictionList
      .sort((a, b) => {
        return b.value - a.value;
      })
      .slice(0, topK);

    return predictionList.map(x => {
      return {
        label: IMAGE_CLASSES[x.index],
        value: x.value
      };
    });
  }
}