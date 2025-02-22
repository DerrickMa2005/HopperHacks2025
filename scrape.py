from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import pyautogui  # For automated mouse clicking

# Initialize WebDriver
PATH = "chromedriver.exe"
driver = webdriver.Chrome()

# Open the webpage
driver.get("https://stonybrook.campuslabs.com/engage/")

# Wait for page to load
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

# Get shadow root and find the Sign In button
shadow_host = driver.find_element(By.ID, "parent-root")
shadow_root = driver.execute_script("return arguments[0].shadowRoot", shadow_host)

# Find and click the Sign In button
sign_in_button = shadow_root.find_element(By.CSS_SELECTOR, "a[href*='/engage/account/login']")
sign_in_button.click()
print("Sign In button clicked.")

# Wait for login fields to load
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "username")))

# Find username and password fields
username_field = driver.find_element(By.ID, "username")
password_field = driver.find_element(By.ID, "password")

# Enter credentials
username = "Rbandaru"
password = "YOWASSUPMANN#123k"

username_field.send_keys(username)
password_field.send_keys(password)

# Submit login
password_field.send_keys(Keys.RETURN)
print("Login submitted. Waiting for 2FA...")

# Wait for 2FA input (manual entry required)
time.sleep(30)
print("2FA should be entered manually.")

# Navigate to Events page
driver.get("https://stonybrook.campuslabs.com/engage/events")
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "event-discovery-list")))

print("Events page loaded.")

# Coordinates for "Load More" button (Update with actual values)
button_x = 541  # Replace with correct X coordinate
button_y = 1366  # Replace with correct Y coordinate

while True:
    try:
        # Scroll to bottom using Selenium
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)  # Allow time for content to load

        # Click "Load More" button using PyAutoGUI
        pyautogui.moveTo(button_x, button_y, duration=0.2)
        pyautogui.click()
        print("Clicked Load More.")

        time.sleep(0.5)  # Adjust timing as needed

        # Find the event list container
        event_list = driver.find_element(By.ID, "event-discovery-list")

        # Get inner HTML of the event list
        html_content = event_list.get_attribute("outerHTML")

        # Save to file
        with open("events_page.html", "w", encoding="utf-8") as file:
            file.write(html_content)

        print("HTML page saved as 'events_page.html'.")


    except Exception as e:
        print("No more 'Load More' button found or error:", e)
        break

print("All events loaded.")

# Keep browser open
input("Press Enter to exit...")
driver.quit()
