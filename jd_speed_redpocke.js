/*
京东极速版红包、签到提现
欧皇3个微信现金，支持自动提现
支持签到提现活动
活动时间：2021-5-6至2021-5-31
活动地址：https://prodev.m.jd.com/jdlite/active/31U4T6S4PbcK83HyLPioeCWrD63j/index.html
活动入口：京东极速版app-领红包，签到提现
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京东极速版红包
0 0 * * * https://github.com/wulove/my_scripts/raw/master/jd_speed_redpocke.js, tag=京东极速版红包, enabled=true

================Loon==============
[Script]
cron "0 0 * * *" script-path=https://github.com/wulove/my_scripts/raw/master/jd_speed_redpocke.js,tag=京东极速版红包

===============Surge=================
京东极速版红包 = type=cron,cronexp="0 0 * * *",wake-system=1,timeout=3600,script-path=https://github.com/wulove/my_scripts/raw/master/jd_speed_redpocke.js

============小火箭=========
京东极速版红包 = type=cron,script-path=https://github.com/wulove/my_scripts/raw/master/jd_speed_redpocke.js, cronexpr="0 0 * * *", timeout=3600, enable=true
*/

const $ = new Env("京东极速版红包");

const notify = $.isNode() ? require("./sendNotify") : "";
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const shareCodeApi = $.isNode() ? require("./share_code_api") : "";
const linkId = "AkOULcXbUA_8EAPbYLLMgg";
const signLinkId = "9WA12jYGulArzWS7vcrwhw";
var newShareCodes = [];
var shareCodeType = "speedredpocke";

let cookiesArr = [],
  cookie = "",
  message;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false")
    console.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...jsonParse($.getdata("CookiesJD") || "[]").map((item) => item.cookie),
  ].filter((item) => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg(
      $.name,
      "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
      "https://bean.m.jd.com/bean/signIndex.action",
      { "open-url": "https://bean.m.jd.com/bean/signIndex.action" }
    );
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(
        cookie.match(/pt_pin=([^; ]+)(?=;?)/) &&
          cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
      );
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = "";
      message = "";
      //await TotalBean();
      console.log(
        `\n******开始【京东账号${$.index}】${
          $.nickName || $.UserName
        }*********\n`
      );
      if (!$.isLogin) {
        $.msg(
          $.name,
          `【提示】cookie已失效`,
          `京东账号${$.index} ${
            $.nickName || $.UserName
          }\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`,
          { "open-url": "https://bean.m.jd.com/bean/signIndex.action" }
        );

        if ($.isNode()) {
          await notify.sendNotify(
            `${$.name}cookie已失效 - ${$.UserName}`,
            `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`
          );
        }
        continue;
      }
      if ($.isNode()) {
        if(process.argv && process.argv.length > 3){
          console.log('process.argv', process.argv[2])
          if(process.argv.length == 4){
            await helpOpenRedEnvelopeInteract(process.argv[2], process.argv[3], "2");
          } else if(process.argv.length == 5){
            await helpOpenRedEnvelopeInteract(process.argv[2], process.argv[3]);
          } 
          continue;
        }
      }
      if ($.isNode()) {
        if(process.argv && process.argv.length > 2){
          console.log('process.argv', process.argv[2], process.env.FIRST_RED_USERNAME)
          if(process.argv[2] == $.UserName || (process.argv[2] == "update" && $.UserName == process.env.FIRST_RED_USERNAME)){
            var now = new Date()
            while(true){
              var serverTime = await getJDServerTime()
              var time = new Date(serverTime)
              if((time.getHours() >= 23)){
                console.log('活动未开始，当前时间：' + parseTime(serverTime))
                if(time.getMinutes()< 58){
                  await $.wait(60000);
                } else {
                  await $.wait(200);
                }
                
                continue
              } else {
                console.log('活动开始，当前时间：' + parseTime(serverTime))
                // break;
                await $.wait(100);
                break;
              }
            }
            await helpOpenRedEnvelopeInteract('','')
            // await redEnvelopeInteractHome("","","");
            newShareCodes.push('HXXWw2u04ABdDAqpyhiWZA')
          } 
          continue;
        }
      }
      await springRewardQuery();
      await shareCodesFormat();
      await jsRedPacket();
    }
  }
})()
  .catch((e) => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

async function jsRedPacket() {
  try {
    // await invite()
    console.log("===================领红包===================");
    for (let i = 0; i < 3; ++i) {
      let data = await redPacket();
      if (data && data.code !== 0) {
        break;
      }
      await $.wait(2000);
    }
    await redPacketList();
  //   console.log("===================助力省钱大赢家===================");
  //   var inviter = "";
  //   var redEnvelopeId = "";

  //   let helpOpenRedEnvelopeInteractResult = await redEnvelopeInteractHome(inviter, redEnvelopeId);
  //   if(helpOpenRedEnvelopeInteractResult && helpOpenRedEnvelopeInteractResult.data && helpOpenRedEnvelopeInteractResult.redEnvelopeId){
  //     redEnvelopeId = helpOpenRedEnvelopeInteractResult.redEnvelopeId
  //   }
  //   var helpOpenRedEnvelopeInteractResultData ={}
  //   if(helpOpenRedEnvelopeInteractResult && helpOpenRedEnvelopeInteractResult.data){
  //     helpOpenRedEnvelopeInteractResultData = helpOpenRedEnvelopeInteractResult.data
  //   }
  //  //helpOpenRedEnvelopeInteractResult.data.amountEnough
  //   await fanfanle(helpOpenRedEnvelopeInteractResultData.amountEnough, helpOpenRedEnvelopeInteractResultData.state, 
  //     helpOpenRedEnvelopeInteractResultData.gambleActLeftTime)
    console.log("===================签到提现===================");

    await sign();
    $.speedUp = true;
    while ($.speedUp) {
      await speedUp();
      await $.wait(2000);
    }
    await signList();

    await showMsg();
  } catch (e) {
    $.logErr(e);
  }
}

async function redPacket() {
  return new Promise((resolve) => {
    var inviter = "";
    if (newShareCodes && newShareCodes.length > 0) {
      inviter = newShareCodes[Math.floor(Math.random() * newShareCodes.length)];
    }
    $.get(
      taskGetUrl("spring_reward_receive", { inviter, linkId }),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data.code === 0) {
                if (data.data.received.prizeType !== 1) {
                  message += `获得${data.data.received.prizeDesc}\n`;
                  console.log(`获得${data.data.received.prizeDesc}`);
                } else {
                  console.log("获得优惠券");
                }
              } else {
                console.log(`${data.code},${data.errMsg}`);
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      }
    );
  });
}

async function springRewardQuery() {
  return new Promise((resolve) => {
    $.get(
      taskGetUrl("spring_reward_query", { linkId, inviter: "" }),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data.code === 0) {
                console.log("总金额：" + data.data.totalAmount);
                console.log(
                  `\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data.data.markedPin}\n`
                );
                shareCodeApi.addShareCode(
                  $.UserName,
                  data.data.markedPin,
                  shareCodeType,
                  cookie
                );
              } else {
                console.log(data.errMsg);
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      }
    );
  });
}

function redPacketList() {
  return new Promise((resolve) => {
    $.get(
      taskGetUrl("spring_reward_list", {
        pageNum: 1,
        pageSize: 20,
        linkId,
        inviter: "",
      }),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data.code === 0) {
                for (let item of data.data.items.filter(
                  (vo) => vo.prizeType === 4
                )) {
                  if (item.state === 0) {
                    console.log(`去提现${item.amount}微信现金`);
                    message += `提现${item.amount}微信现金，`;
                    let body = {
                      businessSource: "SPRING_FESTIVAL_RED_ENVELOPE",
                      base: {
                        id: item.id,
                        business: null,
                        poolBaseId: item.poolBaseId,
                        prizeGroupId: item.prizeGroupId,
                        prizeBaseId: item.prizeBaseId,
                        prizeType: 4,
                      },
                      linkId,
                      inviter: "",
                    };
                    await cashOut(body);
                  }
                }
              } else {
                console.log(data.errMsg);
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      }
    );
  });
}

// 签到
async function sign() {
  return new Promise((resolve) => {
    $.post(signPostUrl("apSignIn_day"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = $.toObj(data);
            if (data.code === 0) {
              if (data.data.retCode === 0) {
                message += `极速版签到提现：签到成功\n`;
                console.log(`极速版签到提现：签到成功\n`);
              } else {
                console.log(
                  `极速版签到提现：签到失败:${data.data.retMessage}\n`
                );
              }
            } else {
              console.log(`极速版签到提现：签到异常:${JSON.stringify(data)}\n`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}
// 签到加速
async function speedUp() {
  return new Promise((resolve) => {
    $.post(signPostUrl("apSpeedUp_day"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = $.toObj(data);
            if (data.code === 0) {
              if (data.data.retCode === 0) {
                message += `签到加速成功\n`;
                console.log(`签到加速成功，额外获取一份红包或微信现金\n`);
              } else if (data.data.retCode === 10013) {
                console.error(`加速失败浪费一次机会...\n`);
              } else if (data.data.retCode === 300) {
                console.error(`加速机会已用完...\n`);
                $.speedUp = false;
              } else if (data.data.retCode === 10019) {
                console.error(`进度已达上限...\n`);
                $.speedUp = false;
              } else {
                $.speedUp = false;
                console.log(`签到加速失败:${data.data.retMessage}\n`);
              }
            } else {
              $.speedUp = false;
              console.log(`签到加速异常:${JSON.stringify(data)}\n`);
            }
          }
        }
      } catch (e) {
        $.speedUp = false;
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

async function signList() {
  return new Promise((resolve) => {
    $.post(
      signPostUrl("signPrizeDetailList", { page: 1, pageSize: 20 }),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data.code === 0) {
                for (let item of data.data.prizeDrawBaseVoPageBean.items.filter(
                  (vo) => vo.prizeType === 4
                )) {
                  if (item.prizeStatus === 0) {
                    console.log(`去提现${item.prizeValue}微信现金`);
                    message += `提现${item.prizeValue}微信现金，`;
                    let body = {
                      businessSource: "DAY_DAY_RED_PACKET_SIGN",
                      base: {
                        id: item.id,
                        business: item.business,
                        poolBaseId: item.poolBaseId,
                        prizeGroupId: item.prizeGroupId,
                        prizeBaseId: item.prizeBaseId,
                        prizeType: 4,
                      },
                      linkId: signLinkId,
                      inviter: "",
                    };
                    await cashOut(body);
                  }
                }
              } else {
                console.log(data.errMsg);
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      }
    );
  });
}

// 微信提现
function cashOut(body) {
  return new Promise(async (resolve) => {
    $.post(taskPostUrl("apCashWithDraw", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            console.log(`提现零钱结果：${data}`);
            data = JSON.parse(data);
            if (data.code === 0) {
              if (data["data"]["status"] === "310") {
                console.log(`提现成功！`);
                message += `提现成功！`;
              } else {
                console.log(`提现失败：${data["data"]["message"]}`);
                message += `提现失败：${data["data"]["message"]}`;
              }
            } else {
              console.log(`提现异常：${data["errMsg"]}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

// 翻翻乐
async function fanfanle(amountEnough, state, gambleActLeftTime){
  if(gambleActLeftTime == 0){
    var gambleHomePageResult = await gambleHomePage()
    async function change(){
      for (let i = 0; i < 5; ++i) {
        var result = await gambleChangeReward();
        if(!(result && result.data && result.data.rewardState === 1)){
          break;
        }
        if(result && result.data && parseFloat(result.data.rewardValue) >= 0.3 && result.data.changeTimes >= 2){
          var gambleObtainRewardResult = await gambleObtainReward()
          if(gambleObtainRewardResult && gambleObtainRewardResult.data && gambleObtainRewardResult.code == 0){
            var data = gambleObtainRewardResult.data
            var apCashWithDrawResult = await apCashWithDraw(data.id, data.poolBaseId, data.prizeGroupId, data.prizeBaseId)
            
          }
          break;
        }
        await $.wait(2000)
      }
    }
    if(gambleHomePageResult && gambleHomePageResult.data && gambleHomePageResult.data.rewardState == 0 && gambleHomePageResult.data.leftTime == 0){
      var gambleOpenRewardResult = await gambleOpenReward()
      // if(gambleOpenRewardResult.success)
      await change()
    } else if(gambleHomePageResult && gambleHomePageResult.data && gambleHomePageResult.data.rewardState == 1 && parseFloat(gambleHomePageResult.data.rewardValue) < 0.3){
      await change()
    } else if(gambleHomePageResult && gambleHomePageResult.data && gambleHomePageResult.data.rewardState == 1 &&  parseFloat(gambleHomePageResult.data.rewardValue) >= 0.3 && gambleHomePageResult.data.changeTimes >= 2){
      var gambleObtainRewardResult = await gambleObtainReward()
      if(gambleObtainRewardResult && gambleObtainRewardResult.data && gambleObtainRewardResult.code == 0){
        var data = gambleObtainRewardResult.data
        var apCashWithDrawResult = await apCashWithDraw(data.id, data.poolBaseId, data.prizeGroupId, data.prizeBaseId)
        
      }
    }
    
  } else {
    console.log('暂时还翻不了')
  }

  if(amountEnough){
    // 
    console.log('已够20，试试提现', state)
    if(state == 6){
      var tmpcookie = cookie
      for (let j = 0; j < cookiesArr.length; j++) {
        if (cookiesArr[j]) {
          cookie = cookiesArr[j];
          $.UserName = decodeURIComponent(
            cookie.match(/pt_pin=([^; ]+)(?=;?)/) &&
              cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
          );
          var redEnvelopeId = "";
          if (newShareCodes && newShareCodes.length > 0) {
            // inviter = newShareCodes[Math.floor((Math.random()*newShareCodes.length))]
            for (var i = 0; i < newShareCodes.length; i++) {
              redEnvelopeId = await shareCodeApi.getShareCodeInfo1(newShareCodes[i]);
              if (redEnvelopeId) {
                console.log("助力提现getShareCodeInfo1 redEnvelopeId=", redEnvelopeId, cookie);
                await helpOpenRedEnvelopeInteract(newShareCodes[i], redEnvelopeId, '2');
              }
            }
          }
        }
      }
      cookie = tmpcookie
    }
    await rewardIndex();
  }
}

// 助力省钱大赢家助力, helpType 1助力加钱，2助力提现
function helpOpenRedEnvelopeInteract(shareCode, redEnvelopeId, helpType = "1") {
  return new Promise((resolve) => {
    var result = {}
    $.get(
      taskGetUrl("openRedEnvelopeInteract", {
        linkId: "DA4SkG7NXupA9sksI00L0g",
        redEnvelopeId: redEnvelopeId,
        inviter: shareCode,
        helpType: helpType,
      }),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              // console.log('openRedEnvelopeInteract', data.data)
              result = data
              if (data.code === 0) {
                if (
                  data.data &&
                  data.data.helpResult &&
                  data.data.helpResult.data
                ) {
                  console.log(
                    `助力省钱大赢家成功;增加了：${data.data.helpResult.data.amount}`
                  );
                } else if (data.data && data.data.helpResult) {
                  console.log(helpType == "1" ?  `助力省钱大赢家失败;` : "助力省钱大赢家提现失败", data.data.helpResult.code, data.data.helpResult.errMsg);
                  if(data.data.helpResult.code==16005){
                    shareCodeApi.finishShareCode(shareCode)
                  }
                } else {
                  console.log(helpType == "1" ?  `助力省钱大赢家失败;` : "助力省钱大赢家提现失败", data);
                }
                if (data.data && data.data.redEnvelopeId) {
                  // console.log('更新redEnvelopeId',$.UserName, data.data.redEnvelopeId)
                  
                  shareCodeApi.setShareCodeInfo1(
                    $.UserName,
                    shareCodeType,
                    data.data.redEnvelopeId,
                    cookie
                  );
                }
              } else {
                console.log(data.errMsg);
                console.log(`助力省钱大赢家失败，${data.code}，${data.errMsg}`);
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}

function redEnvelopeInteractHome(shareCode, redEnvelopeId, helpType="1") {
  return new Promise((resolve) => {
    var result = {}
    $.get(
      taskGetUrl("redEnvelopeInteractHome", {
        linkId: "DA4SkG7NXupA9sksI00L0g",
        redEnvelopeId: redEnvelopeId,
        inviter: shareCode,
        helpType: helpType,
      }),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              // console.log('redEnvelopeInteractHome', data)
              result = data
              if (data.code === 0) {
                if (data.data && data.data.redEnvelopeId) {
                  // console.log('更新redEnvelopeId',$.UserName, data.data.redEnvelopeId)
                  shareCodeApi.setShareCodeInfo1(
                    $.UserName,
                    shareCodeType,
                    data.data.redEnvelopeId
                  );
                }
                if(!data.data.rewardType){
                  console.log(
                    `当前金额：`, data.data.amount
                  );
                } else {
                  console.log(
                    `当前金额：${data.data.amount},已提现`
                  );
                }
              } else {
                console.log(data.errMsg);
                console.log(
                  `助力省钱大赢家redEnvelopeInteractHome失败，${data.code}，${data.errMsg}`
                );
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}

/*
{
    "success": true,
    "code": 0,
    "errMsg": "success",
    "data": {
        "id": null,
        "rewardValue": null,
        "rewardState": 0,
        "rewardType": 0,
        "leftTime": 0,
        "changeTimes": null,
        "successChangeTimes": null,
        "scene": null
    }
}
rewardState == 0 && leftTime == 0 时可翻
*/
function gambleHomePage() {
  return new Promise((resolve) => {
    var result = {}
    $.get(
      taskGetUrl("gambleHomePage", {"linkId":"YhCkrVusBVa_O2K-7xE6hA"}),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              result = data
              // console.log('翻翻乐首页数据', data)
              if (data.code === 0) {
               
              } else {
                console.log(data.errMsg);
                
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}
function gambleOpenReward() {
  return new Promise(async (resolve) => {
    var result = {}
    $.post(
      taskPostUrl("gambleOpenReward", { linkId: "YhCkrVusBVa_O2K-7xE6hA" }),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              
              data = JSON.parse(data);
              // console.log('gambleOpenReward', data)
              if(data.data){
                if(data.data.rewardState == 1){
                  console.log(`✔翻了${data.data.changeTimes}次,得到${data.data.rewardValue}`);
                } else if(data.data.rewardState == 3){
                  console.log(`💔失败清零`);
                }
              }
              if(!data.success){
                console.log(`💔${data.errMsg}`);
              }
             
              result = data
              if (data.code === 0) {
                // console.log(`打开翻翻乐成功！`);
              } else {
                console.log(`打开翻翻乐异常：${data.code},${data.errMsg}`);
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}
function gambleChangeReward() {
  return new Promise(async (resolve) => {
    var result = {}
    $.post(
      taskPostUrl("gambleChangeReward", { linkId: "YhCkrVusBVa_O2K-7xE6hA" }),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              // console.log(`翻翻乐结果：${data}`);
              data = JSON.parse(data);
              result = data
              if(data.data){
                if(data.data.rewardState == 1){
                  console.log(`✔翻了${data.data.changeTimes}次,得到${data.data.rewardValue}`);
                } else if(data.data.rewardState == 3){
                  console.log(`💔失败清零`);
                }
              }
              if(!data.success){
                console.log(`💔${data.errMsg}`);
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}

function gambleObtainReward() {
  return new Promise(async (resolve) => {
    var result = {}
    $.post(
      taskPostUrl("gambleObtainReward", {"linkId":"YhCkrVusBVa_O2K-7xE6hA","rewardType":2}),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              console.log(`翻翻乐准备提现结果：${data}`);
              data = JSON.parse(data);
              result = data
              if (data.code === 0) {
                console.log(`翻翻乐准备提现成功！`);
              } else {
                console.log(`翻翻乐准备提现异常：${data.code},${data.errMsg}`);
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}

function apCashWithDraw(id, poolBaseId, prizeGroupId, prizeBaseId) {
  return new Promise(async (resolve) => {
    var result = {}
    $.post(
      taskPostUrl("apCashWithDraw", {"businessSource":"GAMBLE","base":{"id":id,"business":"redEnvelopeDouble","poolBaseId":poolBaseId,"prizeGroupId":prizeGroupId,"prizeBaseId":prizeBaseId,"prizeType":4},"linkId":"YhCkrVusBVa_O2K-7xE6hA"}),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              console.log(`翻翻乐提现结果：${data}`);
              data = JSON.parse(data);
              result = data
              if (data.code === 0) {
                console.log(`翻翻乐提现成功！`);
              } else {
                console.log(`翻翻乐提现异常：${data.code},${data.errMsg}`);
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}

function rewardIndex() {
  return new Promise((resolve) => {
    var result = {}
    $.get(
      taskGetUrl("rewardIndex", {"linkId":"YhCkrVusBVa_O2K-7xE6hA"}),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              result = data
              console.log('省钱大赢家提现首页数据', data)
              if (data.code === 0) {
               if(data.data.helpNum && data.data.haveHelpNum){
                await exchange()
               }
              } else if(data.code == 1012){
                await exchange()
              } else {
                console.log(data.errMsg);

              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}
function exchange() {
  return new Promise((resolve) => {
    var result = {}
    $.get(
      taskGetUrl("exchange", {"linkId":"DA4SkG7NXupA9sksI00L0g","rewardType":2}),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              result = data
              console.log('省钱大赢家提现', data)
              if (data.code === 0) {
                console.log(
                  `省钱大赢家提现成功;${data.data.amount}`
                );
                shareCodeApi.finishShareCode(null, $.UserName, shareCodeType)
              } else {
                console.log(data.errMsg);
                console.log(
                  `省钱大赢家提现失败，${data.code}，${data.errMsg}`,data
                );
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}

async function doTasks() {
  var result = await getTaskList()
  console.log('getTaskList', result)
  if(result && result.data && result.data.taskItemList){
    for (let index = 0; index < result.data.taskItemList.length; index++) {
      const element = result.data.taskItemList[index];
      await doTask(element.itemId)
      await $.wait(5000)
    }
  }
}

function doTask(itemId) {
  return new Promise((resolve) => {
    var result = {}
    $.get(
      taskGetUrl("apDoTask", {"linkId":"DA4SkG7NXupA9sksI00L0g","taskType":"BROWSE_CHANNEL","taskId":139,"channel":4,"itemId":itemId,"checkVersion":true}),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              result = data
              console.log('doTask', data)
              if (data.code === 0) {
                console.log(
                  `doTask成功`
                );
              } else {
                console.log(data.errMsg);
                console.log(
                  `doTask${data.code}，${data.errMsg}`
                );
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}

function getTaskList() {
  return new Promise((resolve) => {
    var result = {}
    $.get(
      taskGetUrl("apTaskDetail", {"linkId":"DA4SkG7NXupA9sksI00L0g","taskType":"BROWSE_CHANNEL","taskId":139,"channel":4}),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              result = data
              console.log('省钱大赢家提现', data)
              if (data.code === 0) {
                console.log(
                  `省钱大赢家提现成功;${data.data.amount}`
                );
              } else {
                console.log(data.errMsg);
                console.log(
                  `省钱大赢家提现失败，${data.code}，${data.errMsg}`
                );
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(result);
        }
      }
    );
  });
}


function showMsg() {
  return new Promise((resolve) => {
    $.msg($.name, "", `京东账号${$.index}${$.nickName}\n${message}`);
    resolve();
  });
}

function taskPostUrl(
  function_id,
  body,
  referer = "https://an.jd.com/babelDiy/Zeus/q1eB6WUB8oC4eH1BsCLWvQakVsX/index.html"
) {
  return {
    url: `https://api.m.jd.com/`,
    body: `appid=activities_platform&functionId=${function_id}&body=${escape(
      JSON.stringify(body)
    )}&t=${+new Date()}`,
    headers: {
      Cookie: cookie,
      Host: "api.m.jd.com",
      Accept: "*/*",
      Connection: "keep-alive",
      "user-agent": $.isNode()
        ? process.env.JS_USER_AGENT
          ? process.env.JS_USER_AGENT
          : require("./JS_USER_AGENTS").USER_AGENT
        : $.getdata("JSUA")
        ? $.getdata("JSUA")
        : "'jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded",
      referer: referer,
    },
  };
}

function taskGetUrl(function_id, body) {
  return {
    url: `https://api.m.jd.com/?appid=activities_platform&functionId=${function_id}&body=${escape(
      JSON.stringify(body)
    )}&t=${+new Date()}`,
    headers: {
      Cookie: cookie,
      Host: "api.m.jd.com",
      Accept: "*/*",
      Connection: "keep-alive",
      "user-agent": $.isNode()
        ? process.env.JS_USER_AGENT
          ? process.env.JS_USER_AGENT
          : require("./JS_USER_AGENTS").USER_AGENT
        : $.getdata("JSUA")
        ? $.getdata("JSUA")
        : "'jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded",
      referer:
        "https://an.jd.com/babelDiy/Zeus/q1eB6WUB8oC4eH1BsCLWvQakVsX/index.html",
    },
  };
}

function signPostUrl(function_id, ext = {}) {
  let body = {
    linkId: signLinkId,
    serviceName: "dayDaySignGetRedEnvelopeSignService",
    business: 1,
  };
  body = Object.assign(body, ext);
  return {
    url: `https://api.m.jd.com`,
    body: `functionId=${function_id}&body=${escape(
      JSON.stringify(body)
    )}&_t=${+new Date()}&appid=activities_platform`,
    headers: {
      Cookie: cookie,
      Host: "api.m.jd.com",
      Origin: "https://daily-redpacket.jd.com",
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
      Connection: "keep-alive",
      "user-agent": $.isNode()
        ? process.env.JS_USER_AGENT
          ? process.env.JS_USER_AGENT
          : require("./JS_USER_AGENTS").USER_AGENT
        : $.getdata("JSUA")
        ? $.getdata("JSUA")
        : "'jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Accept-Language": "zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8",
      Referer:
        "https://daily-redpacket.jd.com/?activityId=9WA12jYGulArzWS7vcrwhw",
      "Accept-Encoding": "gzip, deflate, br",
    },
  };
}

function TotalBean() {
  return new Promise(async (resolve) => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": $.isNode()
          ? process.env.JD_USER_AGENT
            ? process.env.JD_USER_AGENT
            : require("./USER_AGENTS").USER_AGENT
          : $.getdata("JDUA")
          ? $.getdata("JDUA")
          : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
        "Accept-Language": "zh-cn",
        Referer: "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br",
      },
    };
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err);
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data["retcode"] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (
              data["retcode"] === "0" &&
              data.data &&
              data.data.hasOwnProperty("userInfo")
            ) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            $.log("京东服务器返回空数据");
          }
        }
      } catch (e) {
        $.logErr(e);
      } finally {
        resolve();
      }
    });
  });
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg(
        $.name,
        "",
        "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie"
      );
      return [];
    }
  }
}

// function finishShareCode($code) {
//   //console.log(`addShareCode`,$pt_pin, $code)
//   return new Promise(async resolve => {
//     $.get({url: `https://admin.0xaa.cn/api/share_code/finish?code=${$code}`, 'timeout': 20000}, (err, resp, data) => {
//         //console.log('addShareCode result:', err, data);
//       try {
//         if (err) {
//           console.log(`${JSON.stringify(err)}`)
//           console.log(`${$.name} API请求失败，请检查网路重试`)
//         } else {
//           if (data) {
//             data = JSON.parse(data);
//           }
//         }
//       } catch (e) {
//         $.logErr(e, resp)
//       } finally {
//         resolve(data);
//       }
//     })
//     await $.wait(20000);
//     resolve()
//   })
// }
// function addShareCode($pt_pin, $code) {
//   //console.log(`addShareCode`,$pt_pin, $code)
//   return new Promise(async resolve => {
//     $.get({url: `https://admin.0xaa.cn/api/share_code/add?type=speedredpocke&code=${$code}&pt_pin=${$pt_pin}`, 'timeout': 20000}, (err, resp, data) => {
//         //console.log('addShareCode result:', err, data);
//       try {
//         if (err) {
//           console.log(`${JSON.stringify(err)}`)
//           console.log(`${$.name} API请求失败，请检查网路重试`)
//         } else {
//           if (data) {
//             data = JSON.parse(data);
//           }
//         }
//       } catch (e) {
//         $.logErr(e, resp)
//       } finally {
//         resolve(data);
//       }
//     })
//     await $.wait(20000);
//     resolve()
//   })
// }

// function readShareCode() {
//   return new Promise(async resolve => {
//     $.get({url: `https://admin.0xaa.cn/api/share_code/query/type/speedredpocke/limit/0`, timeout: 10000,}, (err, resp, data) => {
//       try {
//         if (err) {
//           console.log(`${JSON.stringify(err)}`)
//           console.log(`${$.name} API请求失败，请检查网路重试`)
//         } else {
//           if (data) {
//             data = JSON.parse(data);
//           }
//         }
//       } catch (e) {
//         $.logErr(e, resp)
//       } finally {
//         resolve(data);
//       }
//     })
//     await $.wait(10000);
//     resolve()
//   })
// }
function shareCodesFormat() {
  return new Promise(async (resolve) => {
    const readShareCodeRes = await shareCodeApi.readShareCode(shareCodeType);

    if (readShareCodeRes && readShareCodeRes.code === 1) {
      // newShareCodes = newShareCodes.concat(readShareCodeRes.data || []);
      newShareCodes = [
        ...new Set([...newShareCodes, ...(readShareCodeRes.data || [])]),
      ];
    }
    console.log(
      `第${$.index}个京东账号将要助力的好友${JSON.stringify(newShareCodes)}`
    );
    resolve();
  });
}
function getJDServerTime() {
  return new Promise((resolve) => {
    // console.log(Date.now())
    $.get(
      {
        url: `https://jdjoy.jd.com/system/current/timestamp`,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88",
        },
      },
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`);
            console.log(`${$.name} 获取京东服务器时间失败，请检查网路重试`);
          } else {
            data = JSON.parse(data);
            // console.log('京东时间', data)
            $.jdTime = data["currentTime"];
            // console.log(data['serverTime']);
            // console.log(data['serverTime'] - Date.now())
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve($.jdTime);
        }
      }
    );
  });
}
function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (("" + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  var offset = new Date("2018-08-08T00:00:00").getHours();
  if (offset !== 0) {
    date.setTime(date.getTime() - offset * 60 * 60 * 1000);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a")
      return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
