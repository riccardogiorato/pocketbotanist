# Project V2 - Cognitive Services

**Deadline?**

* during the exams period?

**Pipeline:**

1.  acquire data, clean
2.  load or find features manually to classify
3.  visualize image features for each image to check it's working in a right way
4.  build visual vocabolary with quantity of features for each image

**TODO:**
1. select an already built datasets
2. classify with Clarifai (clarifai.com)
3. classify using Custom Vision Microsoft(customvision.ai)
4. export the PB model 
5. construct a function that loads image and give the related predicted class or class index
6. generate slight variations to all images
7. convert the PB model to Saved Model 
8. train this last one with variations of the image to get better weights and --less error, ++more recall
9. serve the tensorflow model with a Serverless solution -> Algorithmia.com or Google Cloud Functions or AWS Lambda
10. understand which kind of model the microsoft team is using to make fast building models in customvision

**Possible goals:**
* understanding more the model horizontally too from Tensorboard
    * to run Tensorboard run 'tensorboard --logdir=./log', url (http://asus-ux310gio:6006/#graphs&run=.)
* might be usefuel to use a GAN or randomize images
* turn all images to black and white to remove bias?
* port Tensorflow model to JS version https://github.com/tensorflow/tfjs-converter
* look at Modeldepot
* classify with Tensorflow model built with Lobe

**Possible datasets:**
* 5 types of flowers
* 4 types of blood cells



**API call:**
https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Training/projects/bd1adee5-8e9e-4fe2-a0d8-ea275b91e2be/iterations/e39b2666-938d-4b45-8045-2c548ba2b1ad/export


fine grained datasets -> 17 types of flowers

fine tuning 

cutting the FC makes the CNN act as a feature extractor and by using really complex ones who has been trained for ages you get good results with short training time