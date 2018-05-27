import * as tfc from "@tensorflow/tfjs-core";
import {
  loadFrozenModel
} from "@tensorflow/tfjs-converter/dist/executor/frozen_model";
import {
  IMAGE_CLASSES
} from "./classes";

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
   * transform the image from RGB to BGR color dimension
   * @param {*} img image to transform
   * @param {*} dimension max dimension of the image === cnn size
   */
  RGBtoBGR(img, dimension) {
    let c = document.createElement("canvas");
    c.width = dimension;
    c.height = dimension;
    let ctx = c.getContext("2d");

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, c.width, c.height);

    let canv2 = document.createElement("canvas");
    canv2.width = dimension;
    canv2.height = dimension;
    let ctx2 = canv2.getContext("2d");
    let imgBGR = ctx2.createImageData(dimension, dimension);

    // convert RGB to BGR colors
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgBGR.data[i] = imgData.data[i + 2];
      imgBGR.data[i + 1] = imgData.data[i + 1];
      imgBGR.data[i + 2] = imgData.data[i];
      imgBGR.data[i + 3] = 255;
    }
    ctx2.putImageData(imgBGR, 0, 0);
    this.blurCanvas(canv2, ctx2);

    return canv2;
  }

  /**
   * blurs the selected canvas
   * @param {*} c canvas on which is displayed the image
   * @param {*} ctx context to the specific canvas
   */
  blurCanvas(c, ctx) {
    ctx.globalAlpha = 0.2;
    const offset = 2;
    for (let i = 1; i <= 8; i += 1) {
      ctx.drawImage(
        c,
        offset,
        0,
        c.width - offset,
        c.height,
        0,
        0,
        c.width - offset,
        c.height
      );
      ctx.drawImage(
        c,
        0,
        offset,
        c.width,
        c.height - offset,
        0,
        0,
        c.width,
        c.height - offset
      );
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
    return this.getTopKClasses(predictions, 1);
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