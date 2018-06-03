import * as tfc from "@tensorflow/tfjs-core";
import {
  loadFrozenModel
} from "@tensorflow/tfjs-converter/dist/executor/frozen_model";
import {
  IMAGE_CLASSES
} from "../classes";

const CURRENT_ASSETS_DIR = "https://models.pocketbotanist.ml/";

const MODEL_FILE_URL = "tensorflowjs_model.pb";
const WEIGHT_MANIFEST_FILE_URL = "weights_manifest.json";
const INPUT_NODE_NAME = "Placeholder";
const OUTPUT_NODE_NAME = "loss";
const PREPROCESS_DIVISOR = tfc.scalar(255 / 2);

/**
 * This class loads your custom frozen tensorflow model
 * just pass the model remote location and names for input and output nodes
 * @export
 * @class ModelLoader
 */
export class ModelLoader {
  constructor() {

  }

  /**
   * load the remote tensorflow model and weight
   */
  async load() {
    this.model = await loadFrozenModel(
      CURRENT_ASSETS_DIR + MODEL_FILE_URL,
      CURRENT_ASSETS_DIR + WEIGHT_MANIFEST_FILE_URL
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
    const preprocessedInput = tfc.div(
      tfc.sub(input.asType("float32"), PREPROCESS_DIVISOR),
      PREPROCESS_DIVISOR
    );
    const reshapedInput = preprocessedInput.reshape([
      1,
      ...preprocessedInput.shape
    ]);
    return this.model.execute({
        [INPUT_NODE_NAME]: reshapedInput
      },
      OUTPUT_NODE_NAME
    );
  }

  /**
   * get the first prediction, max value
   * @param {*} predictions the return from predict function
   */
  getFoundClasse(predictions) {
    const preds = this.getTopKClasses(predictions, 5);
    console.dir(preds);
    return preds;
  }

  /**
   * get the first topK predictions
   * @param {*} predictions the return from predict function
   * @param {*} topK number of predictions to return
   */
  getTopKClasses(predictions, topK) {
    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({
        value: values[i],
        index: i
      });
    }

    // reorder the predictions from the biggest to the smallest one
    predictionList = predictionList
      .sort((a, b) => {
        return b.value - a.value;
      })
      .slice(0, topK);

    // map the prediction to the right label
    return predictionList.map(x => {
      return {
        label: IMAGE_CLASSES[x.index],
        value: x.value
      };
    });
  }
}