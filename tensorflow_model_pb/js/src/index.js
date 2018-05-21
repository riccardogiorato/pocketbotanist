import * as tfc from '@tensorflow/tfjs-core';
import {ModelLoader} from './ModelLoader';


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

    let bgrImage=new Image();
    bgrImage.onload=function(){
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(bgrImage);
    };
    bgrImage.src=canv2.toDataURL();
    bgrImage.id="bgrImage";
}

const flower = document.getElementById('flower');
window.onload = async () => {

    RGBtoBGR(flower,227);

    const resultElement = document.getElementById('result');

    console.log("MobileNet");
    resultElement.innerText = 'Loading MobileNet...';

    const mobileNet = new ModelLoader();
    console.time('Loading of model');
    await mobileNet.load();
    console.timeEnd('Loading of model');

    const pixels = tfc.fromPixels(document.getElementById('bgrImage'));

    console.time('First prediction');
    let result = mobileNet.predict(pixels);
    const topK = mobileNet.getTopKClasses(result, 5);
    console.timeEnd('First prediction');

    resultElement.innerText = '';
    topK.forEach(x => {
        resultElement.innerText += `${x.value.toFixed(3)}: ${x.label}\n`;
    });

    console.time('Subsequent predictions');
    result = mobileNet.predict(pixels);
    mobileNet.getTopKClasses(result, 5);
    console.timeEnd('Subsequent predictions');

    mobileNet.dispose();
};

