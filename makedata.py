import csv
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# **Step 1: Extract Metadata from Local HTML File**
html_file = "events_page.html"  # Ensure this file exists
with open(html_file, "r", encoding="utf-8") as file:
    soup = BeautifulSoup(file, "html.parser")

base_url = "https://stonybrook.campuslabs.com"
events = []
event_links = []

for event in soup.find_all("a", href=True):
    event_url = base_url + event["href"] if not event["href"].startswith("http") else event["href"]
    event_links.append(event_url)  # Store event links for later scraping

    event_name = event.find("h3").text.strip() if event.find("h3") else "Unknown Event"

    # **Safe extraction of location**
    location_tag = event.find_all("svg")[1] if len(event.find_all("svg")) > 1 else None
    location = location_tag.find_next_sibling(string=True).strip() if location_tag and location_tag.find_next_sibling(string=True) else "Unknown Location"

    # **Safe extraction of club name**
    club_tag = event.find("img", alt=True)
    club_name = club_tag["alt"] if club_tag and "alt" in club_tag.attrs else "Unknown Club"

    # **Safe extraction of image URL**
    image_tag = event.find("div", role="img")
    image_url = "N/A"
    if image_tag and "background-image" in image_tag.get("style", ""):
        image_url = image_tag["style"].split("background-image: url(")[-1].split(");")[0].strip('"')

    # **Store metadata (description and other fields will be fetched later)**
    events.append([event_name, location, club_name, image_url, event_url, "No Description Available", "No Host Organization", "No Perks", "No Start Time", "No End Time"])

print(f"✅ Extracted {len(event_links)} event links from {html_file}")

# **Step 2: Set Up Selenium for Login**
chrome_options = Options()
# chrome_options.add_argument("--headless")  # Uncomment to run in headless mode
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")

driver = webdriver.Chrome(options=chrome_options)

# **Step 3: Login and Handle 2FA**
driver.get("https://stonybrook.campuslabs.com/engage/account/login")
WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.ID, "username")))

# **Secure Input**
username = input("🔹 Enter your username: ")  
password = input("🔹 Enter your password: ")  

# Fill in login credentials
driver.find_element(By.ID, "username").send_keys(username)
driver.find_element(By.ID, "password").send_keys(password)
driver.find_element(By.ID, "password").send_keys(Keys.RETURN)

print("✅ Login submitted. Waiting for 2FA...")

# **Wait for manual 2FA input**
input("🔹 Enter your 2FA code manually, then press Enter to continue.")

# **Step 4: Extract Event Details Using Event Links**
for i, event in enumerate(events):
    # Remove this if you want more iterations
    if i == 10:
        break
    event_url = event[4]  # Get event link from stored data
    driver.get(event_url)

    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        soup = BeautifulSoup(driver.page_source, "html.parser")

        # **Extract Description**
        description_div = soup.find("div", class_="DescriptionText")
        event_description = "\n".join(p.text.strip() for p in description_div.find_all("p")) if description_div else "No Description Available"

        if event_description != "No Description Available":
            print(f"✅ Event description retrieved successfully for: {event[0]}")

        # **Extract Host Organizations**
        host_orgs = []
        for org_section in soup.find_all("a", href=True, style="display: block; text-decoration: none; margin-bottom: 20px;"):
            org_name = org_section.find("h3")
            if org_name:
                host_orgs.append(org_name.text.strip())

        host_orgs = ", ".join(host_orgs) if host_orgs else "No Host Organization"

        # **Extract Perks (Including "Credit")**
        perks = []
        perks_section = soup.find("h2", string="Perks")
        if perks_section:
            perks_list = perks_section.find_next_sibling("div")
            if perks_list:
                for perk_item in perks_list.find_all("div", style="margin-bottom: 5px;"):
                    perk_text = perk_item.find("span")
                    perk_label = perk_text.text.strip() if perk_text else "Unknown Perk"
                    perks.append(perk_label)

        # Ensure "Credit" is included if available
        if "Credit" not in perks:
            perks.append("Credit")

        perks = ", ".join(perks) if perks else "No Perks Available"

        # **Extract Start and End Time**
        start_time = "Unknown Start Time"
        end_time = "Unknown End Time"

        date_time_section = soup.find("strong", string="Date and Time")
        if date_time_section:
            date_time_values = date_time_section.find_next("div").find_all("p", style="margin: 2px 0px; white-space: normal;")
            if len(date_time_values) >= 1:
                start_time = date_time_values[0].text.strip()
            if len(date_time_values) >= 2:
                end_time = date_time_values[1].text.strip()

        # **Update extracted details**
        events[i][5] = event_description  # Description
        events[i][6] = host_orgs  # Host Organizations
        events[i][7] = perks  # Perks
        events[i][8] = start_time  # Start Time
        events[i][9] = end_time  # End Time

    except Exception as e:
        print(f"❌ Failed to retrieve details for {event[0]}: {e}")

    # **Delay to avoid blocking**
    time.sleep(0.1)

# **Step 5: Save Data to CSV**
csv_file = "events_data.csv"
with open(csv_file, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Event Name", "Location", "Club", "Image URL", "Event URL", "Description", "Host Organizations", "Perks", "Start Time", "End Time"])
    writer.writerows(events)

print(f"✅ CSV file '{csv_file}' created successfully!")

# **Step 6: Close the Browser**
driver.quit()
