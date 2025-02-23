from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
import time

# Path to your webdriver, adjust accordingly

# Initialize the webdriver
driver = webdriver.Chrome()

# Open the URL
driver.get('https://stonybrook.campuslabs.com/engage/organizations')

# Wait for the page to load
time.sleep(2)

# Try to find the button and click it in a loop
while True:
    try:
        # Locate the "Load More" button by its XPath or other identifier
        load_more_button = driver.find_element(By.XPATH, "//button[contains(., 'Load More')]")
        
        # Use ActionChains to click on the button
        actions = ActionChains(driver)
        actions.move_to_element(load_more_button).click().perform()
        
        # Wait for the next batch of items to load
        time.sleep(0.1)
    except:
        # If the button is not found, break the loop
        print("No more 'Load More' button found.")
        break

# Keep the page open
# Note: you can interact with the page here if needed
input("Press Enter to close the browser...")
driver.quit()
