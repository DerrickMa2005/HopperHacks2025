import time
import pyautogui  # For automated mouse clicking
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialize WebDriver
driver = webdriver.Chrome()

# Open Events page
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
        time.sleep(0.5)  # Allow time for content to load

        # Click "Load More" button using PyAutoGUI
        pyautogui.moveTo(button_x, button_y, duration=0.2)
        pyautogui.click()
        print("Clicked Load More.")

        time.sleep(0.5)  # Adjust timing as needed

    except Exception as e:
        print("No more 'Load More' button found or error:", e)
        break

print("All events loaded.")
input("Press Enter to exit...")
driver.quit()
