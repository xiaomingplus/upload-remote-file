# upload-remote-file

## Table of Contents

- [About](#about)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

Upload remote url file to upload server. The tool will download the remote file to a temp file and remove it when uploaded.

### Installing

A step by step series of examples that tell you how to get a development env running.

Say what the step will be

```bash
npm i upload-remote-file
```

## Usage <a name = "usage"></a>

Add notes about how to use the system.

```javascript
const Upload = require('upload-remote-file')
const upload = new Upload()
upload.request({
    url:"",
    formData:{
        file1:upload.getReadStream(remoteUrl)
    }
})
```

The other options is same as <https://github.com/request/request-promise-native>
