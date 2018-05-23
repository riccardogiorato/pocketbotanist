import * as tfc from '@tensorflow/tfjs-core';
import {ModelLoader} from './ModelLoader';
import {PredictClarifai} from './PredictClarifai';

function resizeImg(img,dimension){
    let c=document.createElement('canvas');
    let ctx=c.getContext('2d');
    let iw=img.width;
    let ih=img.height;
    c.width=dimension;
    c.height=dimension;

    let scaleFactor = dimension/iw;
    ctx.drawImage(img,0,0,iw*scaleFactor,ih*scaleFactor);
    let scaledImg=new Image();
    scaledImg.onload=function(){
        document.body.appendChild(scaledImg);
    };
    scaledImg.src=c.toDataURL();
    scaledImg.id="resizedImg";
    return c;
}

function RGBtoBGR(img,dimension){
    let c=document.createElement('canvas');
    c.width=dimension;
    c.height=dimension;
    let ctx=c.getContext("2d");
    let base64mini =resizeImg(img,dimension);

    // call clarifai general model
    const clarifai = new PredictClarifai();
    // get only base64 without prefix
    const base64img = base64mini.toDataURL().substring(22);
    // predict with clarifai API
    clarifai.predict(base64img);


    ctx.drawImage(base64mini, 0, 0);
    const imgData = ctx.getImageData(0, 0, c.width, c.height);

    let canv2=document.createElement('canvas');
    canv2.width=dimension;
    canv2.height=dimension;
    let ctx2=canv2.getContext("2d");
    let imgBGR = ctx2.createImageData(dimension,dimension);

    // convert RGB to BGR colors
    for (let i = 0; i < imgData.data.length; i += 4)
    {
        imgBGR.data[i] = imgData.data[i+2];
        imgBGR.data[i+1] = imgData.data[i+1];
        imgBGR.data[i+2] = imgData.data[i];
        imgBGR.data[i+3] = 255;
    }
    ctx2.putImageData(imgBGR, 0, 0);
    blurCanvas(canv2,ctx2);

    let bgrImage=new Image();
    bgrImage.onload=function(){
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(bgrImage);
    };
    bgrImage.src=canv2.toDataURL();
    bgrImage.id="bgrImage";
}

function blurCanvas(c,ctx) {
    ctx.globalAlpha = 0.2;
    var offset = 2;
    for (var i=1; i<=8; i+=1) {
        ctx.drawImage(c, offset, 0, c.width - offset, c.height, 0, 0, c.width-offset, c.height);
        ctx.drawImage(c, 0, offset, c.width, c.height - offset, 0, 0,c.width, c.height-offset);
    }
};

const flower = document.getElementById('flower');
window.onload = async () => {

    RGBtoBGR(flower,227);

    const resultElement = document.getElementById('result');

    const mobileNet = new ModelLoader();
    console.time('Loading of model');
    await mobileNet.load();
    console.timeEnd('Loading of model');

    const pixels = tfc.fromPixels(document.getElementById('bgrImage'));

    console.time('First prediction');
    let result = await mobileNet.predict(pixels);
    const topK = mobileNet.getFoundClasse(result);
    console.timeEnd('First prediction');

    resultElement.innerText = '';
    topK.forEach(x => {
        resultElement.innerText += `${x.value.toFixed(3)}: ${x.label}\n`;
    });

    mobileNet.dispose();
};

