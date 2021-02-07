import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {Contact, log, Message, ScanStatus, Wechaty} from "wechaty";

const puppet = new PuppetPadlocal({
    token: "puppet_padlocal_85815f23ea2e42cdbadcb6c6120f6744"
})

const roomlist:string[] = new Array("qun1","企业微信机器人讨论","qun3");
const welcome:string="欢迎家长加入**班级群，上门课是小班授课，后续上课相关通知，我们都会在群里发布。也请大家及时留意。\n上课过程中有任何问题，也欢迎跟我们交流。本班级上课信息都在群公告里，便于大家随时查阅。\n**课需要家长提前给孩子准备【羽毛球拍（建议儿童专用球拍）和适量用球】【足球课是4号足球】【篮球课是儿童篮球】【轮滑课是全套必须带护具】...上课时自行携带。\n另外着装上建议穿运动装运动鞋，带水杯装好白开水，冬天冷注意保暖等...\n课前教练还会再发通知，请留意班级消息\n另外，咱们社区课是固定成员班级，所有学员平摊成本。\n为保证所有学员的权益，未经允许不能带非本班成员体验和试听。如大家都同意增加新成员，请提前找客服登记，谢谢！";
const bot = new Wechaty({
    name: "TestBot",
    puppet,
})

.on("scan", (qrcode: string, status: ScanStatus) => {
    if (status === ScanStatus.Waiting && qrcode) {
        const qrcodeImageUrl = ["https://api.qrserver.com/v1/create-qr-code/?data=", encodeURIComponent(qrcode)].join("");
        log.info("TestBot", `onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);
    } else {
        log.info("TestBot", `onScan: ${ScanStatus[status]}(${status})`);
    }
})

.on("login", (user: Contact) => {
    log.info("TestBot", `${user} login`);
})

.on("logout", (user: Contact, reason: string) => {
    log.info("TestBot", `${user} logout, reason: ${reason}`);
})

.on("message", async (message: Message) => {
    if(message.self()) {return}
//    const contact = message.from()
//    const text = message.text()
//    const room = message.room()
    if (message.room()) {
        if (await message.mentionSelf()) {
            await onWebRoomMessage(message);
        //    console.log('this message were mentioned me! [You were mentioned] tip ([有人@我]的提示)')
        //    room.say(text,contact);
        }
    } else {
        return
    //    console.log(`Contact: ${contact.name()} Text: ${text}`)
    }
 //   log.info("TestBot", `on message: ${message.toString()}`);
 //   message.from().say(message.text());
 //   message.room().say(message.text());
})

.on("error", (error) => {
    log.error("TestBot", 'on error: ', error.stack);
})
​
.on('room-join', async (room, inviteeList, inviter) => {
    const roomname:string = await room.topic()
    const contactListName:string[] = inviteeList.map(c => c.name())
    //console.log(contactListName)
    //const contactFindByName = await bot.Contact.find({ name:})
    if(roomlist.indexOf(roomname)>-1){
        for(var c =0;c< contactListName.length;c++){
            //console.log(c)
            const cfrom = await bot.Contact.find({ name:contactListName[c]})
            room.say(welcome,cfrom)
        }
 //       room.say(welcome)
    }
 //   console.log(inviteeList.map())
 //   const nameList = inviteeList.map(c => c.name()).join(',')
 //   console.log(`Room ${roomname} got new member ${nameList}, invited by ${inviter}`)
})


/**
 * 处理群消息
 */
async function onWebRoomMessage(msg) {
  const isText = msg.type() === bot.Message.Type.Text;

  if (isText) {
    const content = msg.text().replace("@追风", "").trim(); // 消息内容
    const room = msg.room();
    const contact = msg.from();
    if(content === "优趣"){
        room.say("欢迎咨询优趣客服！",contact);
    }
    /*if (content === "毒鸡汤") {
      let poison = await superagent.getSoup();
      await delay(200);
      await msg.say(poison);
    } else if (content === "英语一句话") {
      const res = await superagent.getEnglishOne();
      await delay(200);
      await msg.say(`en：${res.en}<br><br>zh：${res.zh}`);
    } else if (content.includes("踢@")) {
      // 踢人功能  群里发送  踢@某某某  即可
      const room = msg.room();
      //获取发消息人
      const contact = msg.from();
      const alias = await contact.alias();
      //如果是机器人好友且备注是自己的大号备注  才执行踢人操作
      if (contact.friend() && alias === config.MYSELF) {
        const delName = content.replace("踢@", "").trim();
        const delContact = await room.member({ name: delName });
        await room.del(delContact);
        await msg.say(delName + "已被移除群聊。且聊且珍惜啊！");
      }
      // @用户
      // const room = msg.room();
      // const members = await room.memberAll(); //获取所有群成员
      // const someMembers = members.slice(0, 3);
      // await room.say("Hello world!", ...someMembers); //@这仨人  并说 hello world
    } else {
        return
     // await onUtilsMessage(msg);
    }*/
  }
}




bot.start().then(() => {
    log.info("TestBot", "started.");
});

