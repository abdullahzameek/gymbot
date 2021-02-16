const puppeteer = require('puppeteer');
const cron = require('node-cron');
const dotenv = require('dotenv');
dotenv.config()


//get url from the cmdline
const url = "https://nyuad.dserec.com/online/capacity"


async function openPage() {
  const browser = await puppeteer.launch({
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
    headless: false,
  });
  let page = await browser.newPage();


  await page.setViewport({ width: 1366, height: 768 });

  await page.goto(url, {waitUntil: 'networkidle0'});
  const iframe = page.frames()[1]

 

  await iframe.waitForFunction(() => document.querySelector("#page > div > ul > li > a > span"))
  // console.log("got here");
  await iframe.evaluate(() => document.querySelector("#page > div > ul > li > a > span").click())

  await iframe.waitForFunction(() => document.querySelector("body > div.content > div:nth-child(1) > a"))
  // console.log("got here");
  await iframe.evaluate(() => document.querySelector("body > div.content > div:nth-child(1) > a").click())


  // await mainPage.waitForNavigation();
  
  await page.waitForFunction(() => document.querySelector("#username"))
  // console.log('found username')



  await page.evaluate((netid) => {
    const username = document.querySelector("#username")
    username.value = netid;
  },process.env.NETID);
  
  await page.evaluate((password) => {
    const pw = document.querySelector("#password")
    pw.value = password;
  }, process.env.PASSWORD);

  await page.evaluate(() => {
    const submit = document.querySelector("#loginForm > div.innercontent > div:nth-child(1) > div:nth-child(4) > div > button")
    submit.click();
  });
  await page.waitForNavigation();

  await page.waitForTimeout(5000);
  const elementHandle = await page.$('iframe')
  const duo_frame = await elementHandle.contentFrame();

  // await page.waitForFunction(() => document.querySelector("#auth_methods > fieldset:nth-child(1) > div.row-label.phone-label > button"))


  await duo_frame.evaluate(()=>{
    const phoneBtn = document.querySelectorAll("BUTTON")[1]
    phoneBtn.click()
  });

  await page.waitForNavigation({waitUntil: 'networkidle0'});

  // console.log('back to main')
  await page.waitForTimeout(6000);
  const elementHandle2 = await page.$('iframe')
  const main_frame = await elementHandle2.contentFrame();


  await main_frame.waitForFunction(() => document.querySelector("#page > div > ul > li > a > span.username"))
  // console.log('welcome back')

  await main_frame.evaluate(() => document.querySelector("#page > div > section > div > div > div > div.portlet-body.no-space.make-reservation-wizard-page > div > div > div > div.row > div.col-xs-12.col-sm-3.make-reservation-wizard-nav.js-online-reserve-nav > ul > li:nth-child(10) > a").click())
  await page.waitForTimeout(2000);

  await main_frame.evaluate(() => document.querySelector("#page > div > section > div > div > div > div.portlet-body.no-space.make-reservation-wizard-page > div > div > div > div.row > div.col-xs-12.col-sm-9.col-md-8.col-md-offset-1.make-reservation-content.js-online-reserve-content > div.online-reserve-dates.relative > a:nth-child(3)").click())
  await page.waitForTimeout(2000);
  await main_frame.evaluate(() => document.querySelector("#page > div > section > div > div > div > div.portlet-body.no-space.make-reservation-wizard-page > div > div > div > div.row > div.col-xs-12.col-sm-9.col-md-8.col-md-offset-1.make-reservation-content.js-online-reserve-content > div.online-reserve-dates.relative > a:nth-child(3)").click())
  await page.waitForTimeout(2000);


  await main_frame.evaluate(() => document.querySelector("#page > div > section > div > div > div > div.portlet-body.no-space.make-reservation-wizard-page > div > div > div > div.row > div.col-xs-12.col-sm-9.col-md-8.col-md-offset-1.make-reservation-content.js-online-reserve-content > div.tab-content.form-container > div > div > div > div > div:nth-child(5)").click())
  await page.waitForTimeout(2500);
  await main_frame.evaluate(() => document.querySelector("#page > div > section > div > div > div > div.portlet-body.no-space.make-reservation-wizard-page > div > div > div > div:nth-child(2) > div > div > div.dse-modal-footer > div.dse-modal-footer-right > button.btn.btn-primary").click())
  await page.waitForTimeout(2000);
}


// cron.schedule('20 59 06 * * * * * ', () => {
//   openPage();
// }, {
//   scheduled: true,
//   timezone: "Asia/Muscat"
// });
openPage();