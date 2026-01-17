**目录**

[1.Clash电脑版安装](#1.Clash%E7%94%B5%E8%84%91%E7%89%88%E5%AE%89%E8%A3%85)

[1.1安装包获取](#1.1%E5%AE%89%E8%A3%85%E5%8C%85%E8%8E%B7%E5%8F%96)

[1.2Clash电脑版安装](#1.2Clash%E7%94%B5%E8%84%91%E7%89%88%E5%AE%89%E8%A3%85)

[1.3电脑版Clash介绍](#1.3%E7%94%B5%E8%84%91%E7%89%88Clash%E4%BB%8B%E7%BB%8D)

[2.Clash手机版安装](#2.Clash%E6%89%8B%E6%9C%BA%E7%89%88%E5%AE%89%E8%A3%85)

[3.流量包购买](#3.%E6%B5%81%E9%87%8F%E5%8C%85%E8%B4%AD%E4%B9%B0)

[3.1XSUS流量包购买](#3.1XSUS%E6%B5%81%E9%87%8F%E5%8C%85%E8%B4%AD%E4%B9%B0)

[3.2订阅导入电脑版Clash](#3.2%E8%AE%A2%E9%98%85%E5%AF%BC%E5%85%A5%E7%94%B5%E8%84%91%E7%89%88Clash)

[3.3订阅导入手机版Clash](#3.3%E8%AE%A2%E9%98%85%E5%AF%BC%E5%85%A5%E6%89%8B%E6%9C%BA%E7%89%88Clash)

[4.ChatGPT体验](#4.ChatGPT%E4%BD%93%E9%AA%8C)

[4.1杂谈](#4.1%E6%9D%82%E8%B0%88)

[4.2ChatGPT的注册](#4.2ChatGPT%E7%9A%84%E6%B3%A8%E5%86%8C)

[4.3GPT Plus购买](#4.3GPT%20Plus%E8%B4%AD%E4%B9%B0)

---

# 1.Clash电脑版安装
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060688635-7546db2f-b6ed-4603-ac52-3e23a9d92cb1.png)

Clash可以理解为**一辆汽车**，为了规避风险，Clash不提供任何“翻墙”的服务。

正如，驾驶员给汽车加上油，驾驶汽车发生了车祸，这恐怕只能追究驾驶员的责任，而不能说<font style="color:#fe2c24;">车祸全都是汽车的责任。</font><font style="color:#0d0016;">所以Clash如此规避风险，才能一直为大众提供服务。</font>

## <font style="color:#0d0016;">1.1安装包获取</font>
<font style="color:#0d0016;">安装包的获取有两种途径，一种是从GitHub中下载资源。Github是一个软件源代码托管服务平台，正常情况需要通过外网访问。另一种可以直接使用下载好的安装包</font>

[https://github.com/lantongxue/clash_for_windows_pkg/releases](https://github.com/lantongxue/clash_for_windows_pkg/releases)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060688893-bc801db6-e7dd-420e-8c84-d1100ada1160.png)

电脑用户可以在附件压缩包中获取 <font style="color:#0d0016;">“Clash.for.Windows-0.20.39-win.7z”</font>

## <font style="color:#0d0016;">1.2Clash电脑版安装</font>
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060688645-0cb0f005-f000-4388-8d00-15a22de1928a.png)

压缩包下载到电脑中看到的应该是这个样子，是包含**软件运行的所有文件**，并**不需要**再次安装。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060688756-5fb9ebbe-3642-4016-814f-4bb82a4619f8.png)

解压后，点击 **Clash for Windows.exe** 就可以直接**启动软件**了。

## <font style="color:#0d0016;">1.3电脑版Clash介绍</font>
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060688766-5435b885-64a6-40bf-80cb-d8e822eb7eb4.png)

**左侧菜单**

**General（常规）** - 主要的全局设置界面，包括端口、模式、系统代理等选项。

**Proxies（代理）** - 显示已加载的代理节点，并允许用户选择代理模式（如全局、规则、直连）。

**Profiles（配置文件）** - 用于管理和选择不同的代理配置文件（订阅、手动导入等）。	

**Logs（日志）** - 显示运行日志，便于调试和查看网络请求的情况。	

**Connections（连接）** - 显示当前的网络连接详情，包括流量走向、目标 IP、代理方式等。	

**Settings（设置）** - 其他高级设置，比如 UI 主题、数据保存路径、自动更新等。	

**Feedback（反馈）** - 可能是提交问题或提供建议的渠道。 	

**右侧详细设置**

**Port（端口）** - 当前 Clash 代理监听的本地端口（这里是 `49760`），浏览器或应用可以通过这个端口使用 Clash 提供的代理服务。

**Allow LAN（允许局域网）** - 允许局域网设备使用 Clash 代理（适用于局域网共享或手机、其他设备连接）。	

**Log Level（日志级别）** - 设置日志的详细程度（这里是 `info`，表示一般信息）。	

**IPv6** - 是否启用 IPv6 代理（已开启）。	

**Clash Core（Clash 内核）** - 这里显示了 Clash 的内核版本（2023.08.17-13-gdcc8d87 Premium）。	

**Home Directory（主目录）** - Clash 配置文件所在的文件夹，点击 **"Open Folder"** 可以打开。	

**UWP Loopback** - 允许 Windows UWP 应用（如 Microsoft Store 下载的软件）使用 Clash 代理。	

**TAP Device（TAP 设备）** - TAP 设备用于 TUN 模式下的流量转发，可通过 **Manage** 进行管理。	

**Service Mode（服务模式）** - 开启后 Clash 以系统服务运行，可在后台稳定工作。	

**TUN Mode（TUN 模式）** - 允许 Clash 代理所有系统流量（包括不支持 HTTP 代理的软件），相当于 VPN 模式。	

**Mixin** - 允许高级用户自定义 Clash 配置，如添加额外的代理规则。	

**System Proxy（系统代理）** - 是否启用系统代理，使得 Windows 所有流量默认通过 Clash。	

# 2.Clash手机版安装
安卓手机版本可以在压缩包中获取。

安装流程如正常手机软件，可能会报病毒，但是其实并没有危险

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/jpeg/50465133/1741060689448-594d8cbf-6540-4c42-86d9-f882e0eec0ba.jpeg)

安装完成后应该是这个样子的

# 3.流量包购买
Clash好比一辆汽车，那么**流量包**就是汽油，有了汽油车才能正常行驶

## 3.1XSUS流量包购买
目前来看，NCloud是一个较为稳定且便宜的机场。

[NCloud链接https://xn--clouds-o43k.com/#/stage/dashboard](https://xn--clouds-o43k.com/#/stage/dashboard)

[XSUS流量包购买https://xs-us.xyz/plan](https://xs-us.xyz/plan)   

鉴于之前多个机场拿钱跑路，建议流量包按月购买，不要花太多钱。

> <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060689442-60598b9e-5d28-4221-a233-527c45f945b3.png)
>
> 悲报！本篇教程的作者充的流量还没用完，机场就跑路了！
>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060689437-90847e63-e504-48f1-9569-6e613747d8e2.png)

XSUS平台进入并且注册后，后界面如图所示 

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060689490-4a4a163e-db56-4946-a427-d070f5e7cddf.png)

点击购买 - 全部订阅 - Small基础套餐

虽然只有168G，但是流量非常耐用，基本上一个月也就10个G，然后不限制设备，所以可以不限人数的共享。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060689710-44afd42f-8aa9-4f25-bb84-3e0676368596.png)

购买后，在首页找到 “复制订阅链接”，点击后会弹出 “已复制订阅链接”。

## 3.2订阅导入电脑版Clash
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060690038-43f80d21-d203-4079-964e-1413c68433c0.png)

进入Clash，选择Profiles，然后将刚刚复制的订阅链接粘贴到框中，选择Download就可以直接下载订阅文件。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060690105-fa2c3f60-014d-4072-93e6-67b4ea12d174.png)

正常下载好后，点击一下，出现**绿条**说明已经配置好了。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060690287-f18f239a-b5ec-41b7-84f9-54257d3e6f5b.png)

通常，会有很多**节点**（比如香港、美国、意大利）供选择，有的时候某个节点不好用，可以再**Proxies**中选择其他的节点，出现绿条即是当前在使用的节点。

**注意！并不是所有节点都能登上GPT，但总有可以的！**

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060690375-865267a3-a9db-4927-beb3-35a2e1758af1.png)

最后的最后，别忘了打开VPN开关，要不然前面就白忙活了

## 3.3订阅导入手机版Clash
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060690608-2b9759bf-bc5c-452e-af61-4acf8c2a11c7.png)

进入手机版Clash，选择配置

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060690627-adbfe5ff-8c35-4bcf-8237-1c8ab3cd8adb.png)

进入配置后点击右上角的加号

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060690798-d2cd0306-a644-4bb2-8871-ad5dfc9edc01.png)

选择从URL导入

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060690978-301de3f0-4f55-446e-9e46-534d7ecdd68a.png)

填入名称，比如“XSUS”。

URL是从网站上复制下来的**订阅链接**，和电脑版是同一个链接。

这两项填好后，选择右上角保存。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060691190-625b73ea-ae19-4c0a-a561-7d5623257b17.png)

此刻就可以点击运行，使用VPN了

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060691338-9ebd5146-dca2-49cb-b065-4a40deea539e.png)

在代理选项中，可以选择不同的节点。 

# 4.ChatGPT体验
## 4.1杂谈
配置好梯子后，还可以访问其他的国外网站，比如

Twitter或者现在叫X： [https://x.com/home](https://x.com/home)

YouTube也叫油管 视频网站： [https://www.youtube.com/](https://www.youtube.com/)

Gmail 谷歌旗下邮箱 ：[https://mail.google.com/mail/u/0/](https://mail.google.com/mail/u/0/)

## 4.2ChatGPT的注册
ChatGPT [https://chatgpt.com/](https://chatgpt.com/)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060691580-3a7ea40d-7b08-4032-9067-6649d6936e8d.png)

进入网站后，选择“注册”

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060691594-c59c920a-e687-4194-aa53-adeefd4e4dfe.png)

点击创建账户，推荐使用QQ邮箱。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060691845-8b93668e-e377-4a45-a9a8-52454b8aa30e.png)

设置好密码。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/jpeg/50465133/1741060691975-d15e86da-d912-4a58-a7b5-58816b2362a8.jpeg)

接下来一步是邮箱接收验证码

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/50465133/1741060692183-1e00e86c-61e5-48a2-aaaf-ebfe433a6ad1.png)

接下来就可以正常使用GPT啦！

## 4.3GPT Plus购买
GPT5 等更加复杂的模型需要购买GPT plus权益才能访问，价格是每月20美元，折合人民币150左右。

请自行上网查阅谢谢。



2025.03.04

