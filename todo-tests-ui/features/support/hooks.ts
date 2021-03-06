'use strict';

import {defineSupportCode} from "cucumber";
import {By, Locator, until, WebElement} from "selenium-webdriver";
const fs = require('fs');
const path = require('path');
const sanitize = require("sanitize-filename");
let todoUiPages = require('../page_objects/simple_ui_pages');
let todoUiPageObject = new todoUiPages();

defineSupportCode( function ({After,Before}) {

    After(function (scenarioResult) {
        if (scenarioResult.isFailed()) {
            this.driver.takeScreenshot().then(function (data) {
                const base64Data = data.replace(/^data:image\/png;base64,/, "");
                fs.writeFile(path.join('screenshots', sanitize(scenarioResult.scenario.name + ".png").replace(/ /g, "_")), base64Data, 'base64', function (err) {
                    if (err) console.log(err);
                });
            });
        }
        return this.driver.quit();
    });
    Before(async function () {
        await this.driver.get('http://todos.connect.cd/');
        let self = this;
        await this.driver.sleep(1000);
        let elements = await todoUiPageObject.mainList(self);
        for (let element of elements) {
            await todoUiPageObject.deleteATask(self);
           await this.driver.sleep(1000);
                console.log("***** Before Scenario : Tasks are deleted successfully ***** ");

        }

        });

    After(async function () {
        await this.driver.get('http://todos.connect.cd/');
        let self = this;
        await this.driver.sleep(1000);
        let elements = await todoUiPageObject.mainList(self);
        for (let element of elements) {
            await todoUiPageObject.deleteATask(self);
            await this.driver.sleep(1000);
                console.log("***** After Scenario :  Tasks are deleted successfully ***** ");

        }
    });
});