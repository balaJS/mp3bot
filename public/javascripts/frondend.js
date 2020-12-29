class Mp3bot {
  constructor() {
    const $offlineSourceForm = document.getElementsByClassName('js-offline-source-form')[0];
    const sourceFormSubmit = this.sourceFormSubmit.bind('', this);
    $offlineSourceForm.addEventListener('submit', sourceFormSubmit);
  }

  templateCreation(rawRes) {
    var res = JSON.parse(rawRes);
    var folderHtml = this.songsFolderListTemplate(res.dir);
    var songsHtml = this.songsListTemplate(res.files);
    var title = res.title;
    var template = `<div class="source-wrapper__folder-wrapper js-folder-wrapper">
      <h2 class="source-wrapper__folder-wrapper__title" data-src="${title}">${title}</h2>
      <div class="source-wrapper__folder-wrapper__songs">${songsHtml}</div>
      <div class="source-wrapper__folder-wrapper__folders">${folderHtml}</div>
    </div>
    `;

    document.getElementsByClassName('js-source-wrapper')[0].innerHTML += template;
  }

  songsFolderListTemplate(childDir) {
    // TODO: need to setup recursion for child folders.
    const self = this;
    var dirHtml = '', songsHtml = '';
    Object.keys(childDir).forEach(function(key) {
      let dir = childDir[key];
      songsHtml = self.songsListTemplate(dir.files);
      dirHtml += `<div class="source-wrapper__folder-wrapper js-child-folder-wrapper">
        <h2 class="source-wrapper__folder-wrapper__title" data-src="${dir.title}">${dir.title}</h2>
        <div class="source-wrapper__folder-wrapper__songs">${songsHtml}</div>
      </div>
      `;
    });
    return dirHtml;
  }

  songsListTemplate(files = []) {
    var filesHtml = '';
    files.forEach(function(file) {
      filesHtml += `<div class="source-wrapper__folder-wrapper__song js-song" data-src="${file}">
        <span class="song">${file}</span>
      </div>`;
    });
    return filesHtml;
  }

  playSong() {
    const $player = document.getElementsByClassName('js-player')[0];
    // $player.
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

  filterSourcePath(path = '~/Music') {
    return path;
  }

  store(args = {}) {
    const data = {
      'method': 'POST',
      'path': '/store',
      'data': args,
      'cb': this.templateCreation.bind(this)
    };

    this.makeReq(data);
  }

  makeReq(req = {}) {
    let method = req['method'] ? req['method'] : 'POST';
    let path = req['path'] ? req['path'] : '/dummy';
    path = location.origin + path;
    let contentType = req['contentType'] ? req['contentType'] : 'application/json;charset=UTF-8';
    let data = req['data'] ? req['data'] : {};
    const cb = req['cb'];

    const xhr = new window.XMLHttpRequest();
    xhr.open(method, path, true);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if (typeof cb === 'function') {
          cb(this.responseText);
        }
        console.log('INFO', this.responseText);
      }
    };
  }
}

const bot = new Mp3bot();
