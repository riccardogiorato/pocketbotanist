# Tensorflow and other experiments!

## Table of Contents

**Big experiments**

- getting a Tensorflow Frozen model
- testing out a Tensorflow Frozen model locally
- Tensorflow as a serverless function in the cloud (Algorithmia)
- turning images to black and white to remove bias?

[**Testing Models**](#testing-models)

- [Datasets](#datasets)
- [Clarifai](#clarifai)
- [Tensorflow](#tensorflow)
    - custom-vision model
    - Tensorflow Inception V3
    - Tensorflow Mobilenet-V2

## Testing Models

### Datasets

**Classes:**

1.  daisy
2.  dandelion
3.  iris
4.  rose
5.  sunflower
6.  tulip
7.  waterlily

**Training Dataset:** 700 images each class

**Testing Dataset:** 50 images each class

### Clarifai 

Tested Clarifai general API to detect a flower on the testing dataset of 350 images.

| Flower found | Probability > 50 | Average Probability |
| ------------ | ---------------- | ------------------- |
| 318          | 318              | 0,984802079378047   |
| 91%          | 91%              | 98%                 |

To visualized the images not founded look at  [the notebook](./testing-clarifai.ipynb) used for the testing.

### Tensorflow


| Model name/source | Top-1 | Top-5 | Size MB |
| ----------------- | ----- | ----- | ------- |
| Custom-Vision     | 0     | 0     | 3 MB    |
| Inception V3      | 0     | 0     | 80 MB   |
| Mobilenet-V2      | 0     | 0     | 8 MB    |