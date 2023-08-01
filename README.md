# OpenIM H5

## Join Us 
![avatar](https://github.com/OpenIMSDK/OpenIM-Docs/blob/main/docs/images/WechatIMG20.jpeg)

## About us

Open im includes instant messaging and real-time audio and video server and client SDK, which realizes important features such as high performance, lightweight and easy expansion. By integrating open im components and privatizing the deployment server, developers can quickly integrate instant messaging and real-time audio and video interaction into their own applications free of charge, and ensure the security and privacy of business data.[Click here](https://www.openim.online) to visit our official website to learn more about Open IM.



## Getting Started

### Environment

> It is recommended to use node14-16.x version.

### Develop

- Get dependencies from npm

  ```bash
  npm install 
  ```


- Run and preview at local

  ```bash
  npm run dev
  ```

- Build
    > you need update `utils/open_im_sdk_wasm/api/database/instance.js` wasm import path first.
    >
    > ```javascript
    > - SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
    > + SQL = await initSqlJs({ locateFile: () => '../sql-wasm.wasm' });
    > ```

  ```
  npm run build
  ```

## Getting Help

The best way to interact with our team is through GitHub.You can open an issue with this.You can also find some Doc in [Our Developer Guide](https://doc.rentsoft.cn/) or visit [Our Community](https://join.slack.com/t/openimsdk/shared_invite/zt-1tmoj26uf-_FDy3dowVHBiGvLk9e5Xkg) to raise a query.
