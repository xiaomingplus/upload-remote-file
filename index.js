const rq = require("request-promise-native");
const fs = require("fs");
const tmp = require("tmp");
const download = require("node-save-file");
const fsExtra = require("fs-extra");
const debug = require('debug')('upload-remote-file')
module.exports = class Upload {
  constructor() {
    this.cleanCallback = null;
  }
  request(options) {
    options = Object.assign(
      {
        resolveWithFullResponse: true,
        method: "POST"
      },
      options
    );
    var promises = [];
    var p = Promise.resolve();
    if (options.formData) {
      var formData = options.formData;
      for (var formKey in formData) {
        if (formData.hasOwnProperty(formKey)) {
          var formValue = formData[formKey];
          if (formValue instanceof Array) {
            for (var j = 0; j < formValue.length; j++) {
              if (Promise.resolve(formValue[j]) == formValue[j]) {
                promises.push({
                  type: "array",
                  key: formKey,
                  index: j,
                  promise: formValue[j]
                });
              }
            }
          } else {
            if (Promise.resolve(formValue[j]) == formValue) {
              promises.push({
                type: "simple",
                key: formKey,
                promise: formValue
              });
            }
          }
        }
      }
    }
    if (promises.length > 0) {
      p = p.then(() => {
        return Promise.all(promises.map(item => item.promise)).then(results => {
          promises.forEach((item, index) => {
            if (item.type === "array") {
              options.formData[item.key][item.index] = results[index];
            } else {
              options.formData[item.key] = results[index];
            }
          });
          return Promise.resolve();
        });
      });
    }
    p = p.then(() => {
        debug('formData %o',options.formData)
      return rq(options)
        .then(data => {
          // clean
          if (this.cleanCallback) {
            return this.cleanCallback().then(() => data);
          } else {
            return data;
          }
        })
        .catch(e => {
          // also clean
          if (this.cleanCallback) {
            return this.cleanCallback().then(() => {
              return Promise.reject(e);
            });
          } else {
            return Promise.reject(e);
          }
        });
    });
    return p;
  }
  getReadStream(remoteUrl) {
    // getFiles
    return new Promise((resolve, reject) => {
      tmp.dir((err, dirPath, cleanupCallback) => {
        if (err) {
          return reject(err);
        }
        this.cleanCallback = function() {
          return new Promise(resolve2 => {
            cleanupCallback();
            return resolve2();
          });
        };
        download(remoteUrl, dirPath)
          .then(result => {
            this.cleanCallback = () => {
              return fsExtra.remove(result.filepath).then(() => {
                cleanupCallback();
                return Promise.resolve();
              });
            };
            return resolve(fs.createReadStream(result.filepath));
          })
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            reject(e);
          });
      });
    });
  }
};
