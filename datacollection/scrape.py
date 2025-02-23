import pandas as pd
import requests
import time
from bs4 import BeautifulSoup
from page import scrape_page

# Load the HTML content from file
with open("temp.html", "r", encoding="utf-8") as file:
    html_content = file.read()

soup = BeautifulSoup(html_content, "html.parser")

events = []
base_url = "https://stonybrook.campuslabs.com"  # Removed "/engage"

# Headers to mimic a real browser
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Find all event containers
event_containers = soup.find_all("div", class_="MuiPaper-root MuiCard-root MuiPaper-elevation3 MuiPaper-rounded")

for i, event in enumerate(event_containers):
    if i % 5 == 0:
        print(i)
    title_tag = event.find("h3")
    title = title_tag.text.strip() if title_tag else "N/A"
    
    date_time_tag = event.find("svg").find_next_sibling(string=True)
    date_time = date_time_tag.strip() if date_time_tag else "N/A"
    
    location_tag = event.find_all("svg")[1].find_next_sibling(string=True) if len(event.find_all("svg")) > 1 else None
    location = location_tag.strip() if location_tag else "N/A"
    
    organizer_tag = event.find("img", alt=True)
    organizer = organizer_tag.get("alt", "N/A") if organizer_tag else "N/A"
    
    link_tag = event.find_parent("a", href=True)
    link = base_url + link_tag["href"] if link_tag and not link_tag["href"].startswith("http") else (link_tag["href"] if link_tag else "N/A")
    
    # Fetch the event page to extract the <h1> element
    h1_text = "N/A"
    description = scrape_page(link)
    time.sleep(0.1)  # Add delay to avoid getting blocked
    events.append([title, date_time, location, organizer, link, description])

# Convert to pandas DataFrame
df = pd.DataFrame(events, columns=["title", "date", "location", "organizer", "link", "description"])

# Save to CSV
df.to_csv("events.csv", index=False)

# Print extracted data
print(df)
