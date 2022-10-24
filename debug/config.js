const path = require('path');

module.exports = () => {
  // Путь до json layout
   const entrypoint = 'https://layout.vxv.me'; // json mock
  
  // Пути до репозитория виджетов
  const localWidgets = [
    '/User/{username}/vexa/widget-1',
    '/User/{username}/vexa/widget-2'
  ];

  const remoteServer = (name) => `https://ceph.vxv.me/vexa/server/${name}/dist.tgz`;
  const remotePublic = (name) => `https://ceph.vxv.me/vexa/client/`;
  const localPublic = (name) => `http://127.0.0.1:8080/client/`;
}

// 1. Читаем package.json, формируем название видетов
// 2. Билд виджетов производится в кеш репозитория