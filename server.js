const express = require('express');
const app = express();
const multipart = require('connect-multiparty');
const cloudinary = require('cloudinary');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');

const COMPLETE_STATUS = "complete";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const multipartMiddleware = multipart();

cloudinary.config(config.cloudinary);

app.post('/get-car-number', multipartMiddleware, (req, res) => {
  cloudinary.v2.uploader.upload(
    req.files.image.path,
    {
      ocr: "adv_ocr"
    }, 
    (error, result) => {
        if(result.info.ocr.adv_ocr.status === COMPLETE_STATUS) {
          res.json(result.info.ocr.adv_ocr.data[0].textAnnotations[0].description);
        }
    });
});

app.listen(config.port, () => console.log('Server with detecting car numbers is running'));