# 监听上传/下载进度

- XHR.upload 属性

XMLHttpRequest.upload 属性返回一个 XMLHttpRequestUpload 对象，用来表示上传的进度。这个对象是不透明的，但是作为一个 XMLHttpRequestEventTarget，可以通过对其绑定事件来追踪它的进度。

|    事件     |        相应属性的信息类型        |
| :---------: | :------------------------------: |
| onloadstart |             获取开始             |
| onprogress  |          数据传输进行中          |
|   onabort   |           获取操作终止           |
|   onerror   |             获取失败             |
|   onload    |             获取成功             |
|  ontimeout  | 获取操作在用户规定的时间内未完成 |
|  onloadend  |     获取完成（不论成功与否）     |

- XHR.progress 事件

progress 事件会在请求接收到数据的时候被周期性触发。

- 使用

  ```javascript
  axios.get('/more/get', {
    onDownloadProgress(progressEvent) {
      // 监听下载进度
    }
  });

  axios.post('/more/post', {
    onUploadProgress(progressEvent) {
      // 监听上传进度
    }
  });
  ```

- 实现过程中需要注意的地方

  如果请求的数据是 FormData 类型，我们应该主动删除请求 headers 中的 Content-Type 字段，让浏览器自动根据请求数据设置 Content-Type。比如当我们通过 FormData 上传文件的时候，浏览器会把请求 headers 中的 Content-Type 设置为 multipart/form-data。
