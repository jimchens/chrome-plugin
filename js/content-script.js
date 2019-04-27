console.log('这是content script!');
// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()
{
	// 注入自定义JS
	if(location.host == 'www.huobi.co')
	{
		addScript(chrome.extension.getURL("js/jquery-1.8.3.js"));
		injectCustomJs();
		initCustomPanel();
	}
});

function initCustomPanel()
{
	var panel = document.createElement('div');
	panel.className = 'chrome-plugin-demo-panel';
	// panel.id = 'chrome-plugin-demo-panel';
	panel.innerHTML = `
		<h1>操作</h1>
		<div class="btn-area">
			<a onclick="javascript:hideHuodong()">隐藏活动</a><br>
		</div>
		<div class="btn-area">
			<a onclick="javascript:qiangGou()">开始定时抢购</a><br>
			输入时间：<input id="start-time" style="color:#000;" type=text value="2019-04-16 20:00:00"/><br>
			提前时间：<input id="delay-time" style="color:#000;" type=text value="500"/> ms
		</div>
		<div id="my_custom_log">
		</div>
	`;
	document.body.appendChild(panel);
}


// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}

function addScript(scriptURL, onload) {
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.setAttribute("src", scriptURL);
	if (onload) script.onload = onload;
	document.documentElement.appendChild(script);
 }
 
// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
	if(request.cmd == 'update_font_size') {
		var ele = document.createElement('style');
		ele.innerHTML = `* {font-size: ${request.size}px !important;}`;
		document.head.appendChild(ele);
	}
	else {
		tip(JSON.stringify(request));
		sendResponse('我收到你的消息了：'+JSON.stringify(request));
	}
});

// 主动发送消息给后台
// 要演示此功能，请打开控制台主动执行sendMessageToBackground()
function sendMessageToBackground(message) {
	chrome.runtime.sendMessage({greeting: message || '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
		tip('收到来自后台的回复：' + response);
	});
}

// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
	console.log(port);
	if(port.name == 'test-connect') {
		port.onMessage.addListener(function(msg) {
			console.log('收到长连接消息：', msg);
			tip('收到长连接消息：' + JSON.stringify(msg));
			if(msg.question == '你是谁啊？') port.postMessage({answer: '我是你爸！'});
		});
	}
});

window.addEventListener("message", function(e)
{
	console.log('收到消息：', e.data);
	if(e.data && e.data.cmd == 'invoke') {
		eval('('+e.data.code+')');
	}
	else if(e.data && e.data.cmd == 'message') {
		tip(e.data.data);
	}
}, false);