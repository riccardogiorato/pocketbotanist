<p align="center">
    <img src="./design/logo.jpg" width="200px"/>
</p>

# your Pocket botanist

[![Build Status](https://travis-ci.org/Giorat/pocketbotanist.svg?branch=master)](https://travis-ci.org/Giorat/pocketbotanist)
[![Known Vulnerabilities](https://snyk.io/test/github/Giorat/pocketbotanist/badge.svg?targetFile=js%2Fpackage.json)](https://snyk.io/test/github/Giorat/pocketbotanist?targetFile=js%2Fpackage.json)
[![GitHub Issues](https://img.shields.io/github/issues/giorat/pocketbotanist.svg)](https://github.com/giorat/pocketbotanist/issues)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Table of Contents**

- [design](./design)
- [docs](./docs)
- [js](./js)
- [python](./python)
- [tensorflow_model_pb](./tensorflow_model_pb)
- [transfer_learning](./transfer_learning)

## Basic Overview

## Installation

**Prerequisites:** you need to install yarn from [here](https://yarnpkg.com/lang/en/docs/install/) and pip3 with python3 version 3.6.5 64bit form [here](https://www.python.org/downloads/release/python-365/) then from this folder run in the terminal `yarn install-all`

## Be sure to run Python 3 and pip3 and 64BIT version of python!!

To check 32 or 64 bit run this in python and look ath the out:

```
import struct
print(struct.calcsize("P") * 8)
```

## Usage

- To run the Vue application run `yarn js`
- To run the Pyhton notebooks `yarn python_notebook`
- To run the Transfer Learning `yarn transfer_learning`

## Dataset

You can use easily the datasets used in this project from flodyhub:

- [training image dataset](https://www.floydhub.com/riccardogiorato/datasets/pocketbotanist-training), 7 classes \* 700 images = 4900 total images
- [testing image dataset](https://www.floydhub.com/riccardogiorato/datasets/pocketbotanist-test), 7 classes \* 50 images = 350 total images

## What have I done in this project?

![](http://www.plantuml.com/plantuml/proxy?idx=0&src=https://raw.github.com/giorat/pocketbotanist/master/docs/project.puml)

#### Frontend Hosting

**Thanks to Netlify**

<a href="https://www.netlify.com">
<img src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"/>
</a>
