const webdriver = require("selenium-webdriver");
const { until } = require("selenium-webdriver");
const { By } = require("selenium-webdriver");

const SECOND = 1000;

const getElementById = async (driver, id, timeout = 2000) => {
  const el = await driver.wait(until.elementLocated(By.id(id)), timeout);
  return await driver.wait(until.elementIsVisible(el), timeout);
};

const getElementByName = async (driver, name, timeout = 2000) => {
  const el = await driver.wait(until.elementLocated(By.name(name)), timeout);
  return await driver.wait(until.elementIsVisible(el), timeout);
};

const getElementByXpath = async (driver, xpath, timeout = 2000) => {
  const el = await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
  return await driver.wait(until.elementIsVisible(el), timeout);
};

describe("webdriver", () => {
  let driver;

  beforeAll(async () => {
    driver = new webdriver.Builder().forBrowser("chrome").build();
    await driver.get(`https://stagingvendors.tix.do`);
  }, 10000);

  afterAll(async () => {
    await driver.quit();
  }, 15000);

  test("it should sign in with valid credentials", async () => {
    const emailInput = await getElementById(driver, "imputEmail");
    await emailInput.sendKeys("franstagin@tix.com");

    const pwdInput = await getElementById(driver, "inputPassword1");
    await pwdInput.sendKeys("droide03");

    const btn = await getElementByXpath(
      driver,
      "/html/body/app-root/app-login/main/div/div/div/div/div/div/div[2]/form/button"
    );
    await btn.click();

    const revealed = await getElementByXpath(
      driver,
      "/html/body/app-root/app-layout/main/div[2]/app-dashboard/div/div/div/div[1]/div/app-header/header/h2"
    );

    await driver.wait(until.elementIsVisible(revealed), SECOND * 5);
  }, 10000);

  test("it should be able of add staff", async () => {}, 10000);
  test("it should be able of scan tickets", async () => {}, 10000);
});
