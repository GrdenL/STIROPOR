package com.stiropor.backend.selenium;

import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

class LoginFlowTest {
    @Test
    void loginRedirectsToHome() {
        String chromeDriver = System.getProperty("webdriver.chrome.driver");
        Assumptions.assumeTrue(chromeDriver != null && !chromeDriver.isBlank(),
                "Set -Dwebdriver.chrome.driver to run Selenium tests.");

        String baseUrl = System.getProperty("app.baseUrl", "http://localhost:5173");
        String email = System.getProperty("test.user.email", "user@fer.ugnz.hr");
        String password = System.getProperty("test.user.password", "password123");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--window-size=1280,800");

        WebDriver driver = new ChromeDriver(options);
        try {
            driver.get(baseUrl + "/login");

            driver.findElement(By.id("email")).sendKeys(email);
            driver.findElement(By.id("password")).sendKeys(password);
            driver.findElement(By.cssSelector("button[type='submit']")).click();

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.urlMatches(".*/$"));
        } finally {
            driver.quit();
        }
    }
}
