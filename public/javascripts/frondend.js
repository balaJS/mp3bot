class Mp3bot {
  constructor() {
    const $offlineSourceForm = document.getElementsByClassName('js-offline-source-form')[0];
    const sourceFormSubmit = this.sourceFormSubmit.bind('', this);
    $offlineSourceForm.addEventListener('submit', sourceFormSubmit);
  }

  sourceFormSubmit(self, ev) {
    ev.preventDefault();
    const $this = ev.target;
    const $url = $this.querySelector('input[name="folderPath"]');
    let filteredPath = self.filterSourcePath($url.value);
    self.store({
      'path': filteredPath
    });

    // $url.value = '';
  }

  filterSourcePath(path = '') {
    // Linux OS
    if (path.indexOf('file:///') !== -1) {
      return path;
    }
    return false;
  }

  store(args = {}) {
    const data = {
      'method': 'POST',
      'path': '/store',
      'data': args
    };

    this.makeReq(data);
  }

  makeReq(req = {}) {
    let method = req['method'] ? req['method'] : 'POST';
    let path = req['path'] ? req['path'] : '/dummy';
    path = location.origin + path;
    let contentType = req['contentType'] ? req['contentType'] : 'application/json;charset=UTF-8';
    let data = req['data'] ? req['data'] : {};

    const xhr = new window.XMLHttpRequest();
    xhr.open(method, path, true);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log('INFO', this.responseText);
      }
    };
  }
}

const bot = new Mp3bot();
