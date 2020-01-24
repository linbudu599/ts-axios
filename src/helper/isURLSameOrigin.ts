interface URLOrigin {
  protocol: string;
  host: string;
}

export default function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL);
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  );
}

const urlParsingNode = document.createElement('a');
const currentOrigin = resolveURL(window.location.href);

export function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url);
  const { protocol, host } = urlParsingNode;

  return {
    protocol,
    host
  };
}
