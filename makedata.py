import csv
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from events_page import scrape_page  # Import the refined scrape_page function

# Step 1: Extract Metadata from Local HTML File
html_file = "events_page.html"  # Ensure this file exists
with open(html_file, "r", encoding="utf-8") as file:
    soup = BeautifulSoup(file, "html.parser")

base_url = "https://stonybrook.campuslabs.com"
events = []
event_links = []

# Create rows with 13 columns:
# [0] Event Name, [1] Event Time, [2] Location, [3] Club, [4] Image URL, [5] Event URL,
# [6] Description, [7] Host Organizations, [8] First Host Org, [9] Perks, [10] Categories,
# [11] Start Time, [12] End Time
for event in soup.find_all("a", href=True):
    event_url = base_url + event["href"] if not event["href"].startswith("http") else event["href"]
    event_links.append(event_url)  # Store event links for later scraping

    event_name = event.find("h3").text.strip() if event.find("h3") else "Unknown Event"

    # Safe extraction of event time from original HTML
    time_tags = event.find_all("svg")
    event_time = "Unknown Event Time"
    if len(time_tags) > 0:
        next_str = time_tags[0].find_next_sibling(string=True)
        event_time = next_str.strip() if next_str else event_time

    # Safe extraction of location
    location = "Unknown Location"
    if len(time_tags) > 1:
        next_str = time_tags[1].find_next_sibling(string=True)
        location = next_str.strip() if next_str else location

    # Safe extraction of club name
    club_tag = event.find("img", alt=True)
    club_name = club_tag["alt"] if club_tag and "alt" in club_tag.attrs else "Unknown Club"

    # Safe extraction of image URL
    image_tag = event.find("div", role="img")
    image_url = "N/A"
    if image_tag and "background-image" in image_tag.get("style", ""):
        image_url = image_tag["style"].split("background-image: url(")[-1].split(");")[0].strip('"')

    events.append([
        event_name,            # 0: Event Name
        event_time,            # 1: Event Time
        location,              # 2: Location
        club_name,             # 3: Club
        image_url,             # 4: Image URL
        event_url,             # 5: Event URL
        "No Description Available",  # 6: Description
        "No Host Organization",      # 7: Host Organizations
        "No First Host Org",         # 8: First Host Org
        "No Perks",                  # 9: Perks
        "No Categories",             # 10: Categories
        "No Start Time",             # 11: Start Time
        "No End Time"                # 12: End Time
    ])

print(f"✅ Extracted {len(event_links)} event links from {html_file}")

# Step 2: Set Up Selenium for Login
chrome_options = Options()
# chrome_options.add_argument("--headless")  # Uncomment to run in headless mode
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")

driver = webdriver.Chrome(options=chrome_options)

# Step 3: Login and Handle 2FA
driver.get("https://stonybrook.campuslabs.com/engage/account/login")
WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.ID, "username")))

username = input("🔹 Enter your username: ")
password = input("🔹 Enter your password: ")

driver.find_element(By.ID, "username").send_keys(username)
driver.find_element(By.ID, "password").send_keys(password)
driver.find_element(By.ID, "password").send_keys(Keys.RETURN)

print("✅ Login submitted. Waiting for 2FA...")
input("🔹 Enter your 2FA code manually, then press Enter to continue.")

# Step 4: Extract Event Details Using scrape_page()
for i, row in enumerate(events):

    event_url = row[5]  # Event URL is at index 5
    event_data = scrape_page(event_url)  # Call the refined scrape_page function

    # Update the row with new data from scrape_page:
    events[i][6] = event_data["description"]          # Description
    events[i][7] = event_data["host_organizations"]     # Host Organizations
    events[i][8] = event_data["first_host_org"]           # First Host Org
    events[i][9] = event_data["perks"]                  # Perks
    events[i][10] = event_data["categories"]            # Categories
    events[i][11] = event_data["start_time"]            # Start Time
    events[i][12] = event_data["end_time"]              # End Time

    print(f"✅ Scraped event: {row[0]}")
    time.sleep(0.1)  # Delay to avoid overloading the server

# Step 5: Save Data to CSV
csv_file = "events_data.csv"
with open(csv_file, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow([
        "Event Name", "Event Time", "Location", "Club", "Image URL", "Event URL",
        "Description", "Host Organizations", "First Host Org", "Perks", "Categories",
        "Start Time", "End Time"
    ])
    writer.writerows(events)

print(f"✅ CSV file '{csv_file}' created successfully!")

# Step 6: Close the Browser
driver.quit()
