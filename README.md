<p align="center">
    <a href="https://www.openim.online">
        <img src="./docs/images/openim-logo.gif" width="60%" height="30%"/>
    </a>
</p>

# OpenIM H5 Demo 💬💻

<p>
  <a href="https://doc.rentsoft.cn/">OpenIM Docs</a>
  •
  <a href="https://github.com/openimsdk/open-im-server">OpenIM Server</a>
  •
  <a href="https://github.com/openimsdk/open-im-sdk-web-wasm">openim-sdk-wasm</a>
  •
  <a href="https://github.com/openimsdk/openim-sdk-core">openim-sdk-core</a>
</p>

<br>

OpenIM H5 Demo is an open-source instant messaging application built on OpenIM SDK Wasm, OpenIM Server, and H5. It demonstrates how to quickly integrate instant messaging capabilities into any web app using OpenIM.

## Tech Stack 🛠️

- This is a web project bootstrapped with [`Vite`](https://vitejs.dev/).
- App is built with [openim-sdk-wasm](https://github.com/openimsdk/open-im-sdk-web-wasm) library.

## Live Demo 🌐

Give it a try at [https://h5-enterprise.rentsoft.cn](https://h5-enterprise.rentsoft.cn).

## Dev Setup 🛠️

> It is recommended to use version 16.x-18.x.

Follow these steps to set up a local development environment:

1. Run `npm install` to install all dependencies.
2. Modify the request address to your own OpenIM Server IP in the following files:
   > Note: You need to [deploy](https://github.com/openimsdk/open-im-server#rocket-quick-start) OpenIM Server first, the default port of OpenIM Server is 10001, 10002, 10008.
   - `config/dev.env.ts`

     ```js
     CHAT_URL: "http://your-server-ip:10008",
     API_URL: "http://your-server-ip:10002",
     WS_URL: "ws://your-server-ip:10001",
     ```
3. Run `npm run dev` to start the development server. Visit [http://localhost:3003](http://localhost:3003) to see the result. An Electron application will be launched by default.
4. Start development! 🎉

## Build 🚀

1. You need update `utils/open_im_sdk_wasm/api/database/instance.js` wasm import path first.

  ```js
  - SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
  + SQL = await initSqlJs({ locateFile: () => '../sql-wasm.wasm' });
  ```
2. Run the following command to build the web application:

  ```bash
  npm run build
  ```

3. The build result will be located in the `dist` folder.

## Community :busts_in_silhouette:

- 📚 [OpenIM Community](https://github.com/OpenIMSDK/community)
- 💕 [OpenIM Interest Group](https://github.com/Openim-sigs)
- 🚀 [Join our Slack community](https://join.slack.com/t/openimsdk/shared_invite/zt-22720d66b-o_FvKxMTGXtcnnnHiMqe9Q)
- :eyes: [Join our wechat (微信群)](https://openim-1253691595.cos.ap-nanjing.myqcloud.com/WechatIMG20.jpeg)

## Community Meetings :calendar:

We want anyone to get involved in our community and contributing code, we offer gifts and rewards, and we welcome you to join us every Thursday night.

Our conference is in the [OpenIM Slack](https://join.slack.com/t/openimsdk/shared_invite/zt-22720d66b-o_FvKxMTGXtcnnnHiMqe9Q) 🎯, then you can search the Open-IM-Server pipeline to join

We take notes of each [biweekly meeting](https://github.com/orgs/OpenIMSDK/discussions/categories/meeting) in [GitHub discussions](https://github.com/openimsdk/open-im-server/discussions/categories/meeting), Our historical meeting notes, as well as replays of the meetings are available at [Google Docs :bookmark_tabs:](https://docs.google.com/document/d/1nx8MDpuG74NASx081JcCpxPgDITNTpIIos0DS6Vr9GU/edit?usp=sharing).

## Who are using OpenIM :eyes:

Check out our [user case studies](https://github.com/OpenIMSDK/community/blob/main/ADOPTERS.md) page for a list of the project users. Don't hesitate to leave a [📝comment](https://github.com/openimsdk/open-im-server/issues/379) and share your use case.

## License :page_facing_up:

OpenIM is licensed under the Apache 2.0 license. See [LICENSE](https://github.com/openimsdk/open-im-server/tree/main/LICENSE) for the full license text.
