// 好像在使用官方axios的时候也见过这个文件
interface URLOrigin {
  protocol: string;
  host: string;
  // port: string;
}

export default (requestURL: string): boolean => {
  // URL解析函数
  const resolveURL = (url: string): URLOrigin => {
    urlParsingNode.setAttribute('href', url);
    return {
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host
      // port: urlParsingNode.port
    };
  };

  let urlParsingNode = document.createElement('a');

  const currOrigin = resolveURL(window.location.href);

  const requestURLOrigin = resolveURL(requestURL);
  console.log(JSON.stringify(currOrigin), JSON.stringify(requestURLOrigin));
  // 暂不确定可行性
  return JSON.stringify(currOrigin) === JSON.stringify(requestURLOrigin);
};
