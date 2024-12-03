const webdriver = require("selenium-webdriver");
const { until } = require("selenium-webdriver");
const { By } = require("selenium-webdriver");
const { waitTill } = require("./common");

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
    await driver.get(`https://tix.do/events/todos`);
  }, 10000);

  afterAll(async () => {
    await driver.quit();
  }, 15000);

  test(
    "it should see all active events",
    async () => {
      const el = await getElementByXpath(
        driver,
        "/html/body/app-root/app-primary/div/app-list/section[3]/div/div/div[1]",
        SECOND * 5
      );

      await driver.wait(until.elementIsVisible(el), SECOND * 10);
    },
    SECOND * 60
  );

  test(
    "it should filter by category",
    async () => {
      const comedyBtn = await getElementByXpath(
        driver,
        "/html/body/app-root/app-primary/div/app-list/section[3]/div/event-filter/div/div[1]/nav/ul/li[2]/div",
        SECOND * 10
      );

      await waitTill(SECOND * 4);
      await comedyBtn.click();

      await waitTill(SECOND * 4);

      await getElementByXpath(
        driver,
        "/html/body/app-root/app-primary/div/app-list/section[3]/div/div/div[1]",
        SECOND * 5
      );

      const events = await driver.findElements(By.tagName("event-card"));
      expect(events.length).toBeGreaterThan(0);
    },
    SECOND * 10
  );

  test(
    "it should filter by name",
    async () => {
      const q = await getElementByXpath(
        driver,
        "/html/body/app-root/app-primary/div/app-list/section[3]/div/event-filter/div/div[2]/div/input"
      );
      await q.sendKeys("como en");

      await getElementByXpath(
        driver,
        "/html/body/app-root/app-primary/div/app-list/section[3]/div/div",
        SECOND * 5
      );

      const events = await driver.findElements(By.tagName("event-card"));
      expect(events.length).toBeGreaterThan(0);
    },
    SECOND * 20
  );

  test(
    "it should let user by a ticket",
    async () => {
      const event = await getElementByXpath(
        driver,
        "/html/body/app-root/app-primary/div/app-list/section[3]/div/div/div[1]/event-card/a"
      );

      await event.click();

      const buyBtn = await getElementByXpath(
        driver,
        "/html/body/app-root/app-primary/div/app-detail/div/section/div/div/div[2]/article/div/button/label",
        SECOND * 5
      );
      const text = await buyBtn.getText();

      expect(text).toBe("Comprar ahora");
    },
    SECOND * 20
  );
  test(
    "it should let user send a message to vendor",
    async () => {
      const btn = await getElementByXpath(
        driver,
        "/html/body/app-root/app-primary/div/app-detail/div/event-vendor/section/div/div[2]/div/div[3]/div/aside/button",
        SECOND * 10
      );
      await waitTill(SECOND * 10);
      await btn.click();

      const modalHeader = await getElementById(
        driver,
        "vender_formLabel",
        SECOND * 2
      );
      const text = await modalHeader.getText();

      const nameInput = await getElementById(driver, "fullNameInput");
      await nameInput.sendKeys("Francisco Jose");

      const emailInput = await getElementById(driver, "emailInput");
      await emailInput.sendKeys("jose@jose.com");

      const phoneInput = await getElementById(driver, "phoneInput");
      await phoneInput.sendKeys("8292894123");

      const commentInput = await getElementById(driver, "commentInput");
      await commentInput.sendKeys("something went wrong");

      await waitTill(SECOND * 5);

      expect(text).toBe("Enviar mensaje");
    },
    SECOND * 60
  );
});
