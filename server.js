const express = require('express');
const webcam = require('node-webcam');
const app = express();
const cloudinary = require('cloudinary');
const cors = require('cors');
const config = require('./config');

const COMPLETE_STATUS = "complete";

app.use(cors());

cloudinary.config(config.cloudinary);

app.get('/car-numbers', (req, res) => {
  webcam.capture(
    "numbers_picture",
    { saveShots: false, callbackReturn: "base64"  },
    (err, imgBase64) => {
      cloudinary.v2.uploader.upload(
      imgBase64,
      {
        ocr: "adv_ocr"
      }, 
      (error, result) => {
          if(result.info.ocr.adv_ocr.status === COMPLETE_STATUS) {
            res.json((result.info.ocr.adv_ocr.data[0].textAnnotations || [{}])[0].description);
          }
      });
  });
  
});

app.listen(config.port, () => console.log('Server with detecting car numbers is running'));