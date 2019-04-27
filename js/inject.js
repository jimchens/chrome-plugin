function hideHuodong() {	
	$('.prime-mask-exchange').css("display", "none");
	$('.mod.trade-panel').css("display", "block");
	$('trade').css("display", "block");
	tip("隐藏成功！");
}

var start = false;
var timerInt;
//开始定时抢购
function qiangGou() {
	let startTimeText = $('#start-time').val()
	let delayTimeText = $('#delay-time').val()
	let startTime = new Date(startTimeText).getTime();
	startTime -= parseInt(delayTimeText);
	start = false;
	if (timerInt !== null && timerInt > 0) {
		clearInterval(timerInt);
	}
	var first = true;
	timerInt = setInterval(() => {
		if (first) {
			first = false;
			tip("定时任务开始！");
		}

		let date = new Date();
		if (!start && date.getTime() >= startTime) {
			start = true;
			$('.submit.bg-buy.0').click();
			clearInterval(timerInt);
			timerInt = null;
			tip("开始抢购！");
		}
	}, 10);
}

let amountInput;
function getTradeButton() {
	let tabs = $('.mock-a');
	
	// debugger
	tabs.each(function () { 
		that = $(this);
		// console.log(that.context.innerText)
		if (that && that.context && that.context.innerText && that.context.innerText.indexOf("市价交易") != -1) {
			$(this).click();
		}
	});


	if (!amountInput) {
		amountInput = $('input.active');
	}
	// debugger
	
	amountInput.focus();
	amountInput.attr("id", "trade-amount");
// 	e.keyCode = 1;//keyCode=8是空格

	amountInput.keydown();//模拟按下空格键

	// var textbox = document.getElementById("trade-amount"), event; 
	if (document.implementation.hasFeature("KeyboardEvents", "3.0")){ 
	  event = document.createEvent("KeyboardEvent"); 
	  event.initKeyboardEvent("keydown", true, true, document.defaultView, "1",0, "Shift", 0); 
	} 
	amountInput.dispatchEvent(event); 


}

var tipCount = 0;
// 简单的消息通知
function tip(info) {
	info = info || '';
	var ele = document.createElement('div');
	ele.className = 'chrome-plugin-simple-tip slideInLeft';
	ele.style.top = tipCount * 70 + 20 + 'px';
	ele.innerHTML = `<div>${info}</div>`;
	document.body.appendChild(ele);
	ele.classList.add('animated');
	tipCount++;
	setTimeout(() => {
		ele.style.top = '-100px';
		setTimeout(() => {
			ele.remove();
			tipCount--;
		}, 400);
	}, 3000);
}