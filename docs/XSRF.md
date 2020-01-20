# 防御 XSRF/CSRF

## 前置

CSRF（Cross-site request forgery）跨站请求伪造，也被称为“One Click Attack”或者 Session Riding，通常缩写为 CSRF 或者 XSRF，一般是攻击者冒充用户进行站内操作，它与 XSS 非常不同，XSS 利用站点内的信任用户，而 CSRF 则是伪装成受信任用户的请求来访问操作受信任的网站，CSRF 攻击允许恶意用户在另一个用户不知情的情况下利用其身份信息执行操作。

> MDN 案例：
> John 是一个恶意用户，他知道某个网站允许已登陆用户使用包含了账户名和数额的 HTTP POST 请求来转帐给指定的账户。John 构造了包含他的银行卡信息和某个数额做为隐藏表单项的表单，然后通过 Email 发送给了其它的站点用户（还有一个伪装成到 “快速致富”网站的链接的提交按钮）.
> 如果某个用户点击了提交按钮，一个 HTTP POST 请求就会发送给服务器，该请求中包含了交易信息以及用户自己的浏览器中与该站点关联的所有客户端 cookie（将相关联的站点 cookie 信息附加发送是正常的浏览器行为） 。服务器会检查这些 cookie，以判断对应的用户是否已登陆且有权限进行上述交易。
> 最终的结果就是任何已登陆到站点的用户在点击了提交按钮后都会进行这个交易。John 发财啦！

在上面的例子里，John 不需要访问那些用户的 cookie(或者说身份信息) -- 用户的浏览器存储了这些信息，而且会自动将其包含在发送给对应服务器的请求中

杜绝此类攻击的一种方式是在服务器端要求每个 POST 请求都包含一个用户特定的由站点生成的密钥( 这个密钥值可以由服务器在发送用来传输数据的网页表单时提供）。这种方式可以使 John 无法创建自己的表单，因为他必须知道服务器提供给那个用户的密钥值。即使他找出了那个密钥值，并为那个用户创建了表单，他也无法用同样的表单来攻击其他的所有用户。

## 原理

CSRF 攻击经常利用目标站点的身份验证机制，CSRF 攻击这一弱点的根源在于 Web 的身份验证机制虽然可以向目标站点保证一个请求来自于经过站点认证的某个用户的账号，但是却无法保证该请求的确是那个用户发出的或者是经过那个用户批准的。

目前 web 网站泛用的身份验证机制就是 cookie-session 认证机制，来跟踪记录用户的行为。

CSRF 攻击依赖下面的假定：

- 攻击者了解受害者所在的站点；
- 攻击者的目标站点具有持久化授权 cookie 或者受害者具有当前会话 cookie；
- 目标站点没有对用户在网站行为的第二授权；
- 欺骗用户的浏览器发送 HTTP 请求给目标站点（也就是忽悠用户点击攻击链接）或者攻击者控制部分 or 全部站点（比如攻击者通过 XSS 拿到未失效且经过网站授权的 cookie）。

![example](https://pic002.cnblogs.com/img/hyddd/200904/2009040916453171.jpg)

要完成一次 CSRF 攻击，受害者必须依次完成两个步骤：

1.登录受信任网站 A，并在本地生成 Cookie。  
2.在不登出 A 的情况下，访问危险网站 B。

**为什么它难以防范？**

1.你不能保证你登录了一个网站后，不再打开一个 tab 页面并访问另外的网站。

2.你不能保证你关闭浏览器了后，你本地的 Cookie 立刻过期，你上次的会话已经结束。（事实上，关闭浏览器不能结束一个会话，但大多数人都会错误的认为关闭浏览器就等于退出登录/结束会话了……）

3.上图中所谓的攻击网站，可能是一个存在其他漏洞的可信任的经常被人访问的网站。

## 常见防范措施-Token

- 在客户端与服务端首次登录确认身份成功后，服务端会颁发给客户端一个身份认证令牌，即 token，客户端将其存储在 cookie 中，然后要求客户端以后每次请求都要携带此 token，客户端往往会把这个 toekn 添加到请求的 headers 中。
- 服务端接收到请求后，先从从请求 headers 中读取这个 token ，然后验证该 token 是否合法，如果合法则进行下一步操作，如果不合法，则直接拒绝服务。
- 服务器端要求每次请求都包含一个 token，这个 token 不在前端生成，而是在我们每次访问站点的时候生成，并通过 set-cookie 的方式种到客户端，然后客户端发送请求的时候，从 cookie 中对应的字段读取出 token，然后添加到请求 headers 中。
- 这样服务端就可以从请求 headers 中读取这个 token 并验证，由于这个 token 是很难伪造的，所以就能区分这个请求是否是用户正常发起的。

### axios 官方的实现

官方 axios 在默认请求配置对象中为我们提供了 `xsrfCookieName` 和 `xsrfHeaderName` 这两个属性，其中 `xsrfCookieName` 表示存储 `token` 的 `cookie` 名称，`xsrfHeaderName` 表示请求 `headers` 中 `token` 对应的 `header` 名称。然后每次发送请求的时候，会自动从 `cookie` 中读取对应的 `token` 值，然后将其添加到请求 `headers`中。

### 实现思路

- 给请求配置对象 config 上添加 xsrfCookieName 和 xsrfHeaderName 这两个属性的接口，并且将其写入默认请求配置对象中；
- 跨站请求伪造是由于进行了跨域请求才有了被攻击的可能，而如果是同域请求那就不存在这个问题，所以我们需要先判断该请求是否跨域；
- 还要判断之前中添加的 withCredentials 是否为 true ，因为该属性表示请求是否允许携带 cookie，如果不允许携带，那就没法防御了；
- 如果上面两个判断都成功，则从 cookie 中根据 xsrfCookieName 来获取到 token 值；
- 获取到以后，将 token 值添加到请求 headers 中，即 xsrfHeaderName 的属性值；

#### 判断跨域

> axios 官方对于这一步的实现使用了一个很巧妙的方法，即创建一个 a 标签，并把这个 a 标签的 `href` 属性设置为请求 url，就可以获取到该请求的 `protocol`、`host`、`port`，再把当前页面的 url 也是用这种方式获取到三项信息后进行分别比对，来判断出请求是否跨域。

详细过程见各部分代码及注释

#### 最终效果

在访问页面的时候，服务端通过 set-cookie 往客户端种了 key 为 XSRF-TEST，值为 TESTTTTT 的 cookie，作为 防御 srf 的 token 值。

然后我们在前端发送请求的时候，就能从 cookie 中读出 key 为 XSRF-TOKEN 的值，然后把它添加到 key 为 X-XSRF-TOKEN 的请求 headers 中。

## 参考资料

- [CSRF/XSRF 概述](https://blog.csdn.net/weixin_38597669/article/details/90694407)
- [MDN-CSRF](<https://developer.mozilla.org/zh-CN/docs/learn/Server-side/First_steps/Website_security#跨站请求伪造_(CSRF)>)
- **[（推荐阅读）浅谈 CSRF](<https://developer.mozilla.org/zh-CN/docs/learn/Server-side/First_steps/Website_security#跨站请求伪造_(CSRF)>)**
