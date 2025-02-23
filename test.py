import csv
import time
from bs4 import BeautifulSoup
from events_page import scrape_page  # Function to scrape event description

# Load the HTML file
html_file = "events_page.html"  # Update with the actual file path
with open(html_file, "r", encoding="utf-8") as file:
    soup = BeautifulSoup(file, "html.parser")

# Find all event cards
events = []
base_url = "https://stonybrook.campuslabs.com"

for event in soup.find_all("a", href=True):
    event_url = base_url + event["href"] if not event["href"].startswith("http") else event["href"]
    
    event_name = event.find("h3").text.strip() if event.find("h3") else "Unknown Event"
    date_time = event.find_all("svg")[0].find_next_sibling(text=True).strip() if event.find_all("svg") else "Unknown Date & Time"
    location = event.find_all("svg")[1].find_next_sibling(text=True).strip() if len(event.find_all("svg")) > 1 else "Unknown Location"
    club_name = event.find("img", alt=True)["alt"] if event.find("img", alt=True) else "Unknown Club"

    # Extract Image URL safely
    image_tag = event.find("div", role="img")
    image_url = image_tag["style"].split("background-image: url(")[-1].split(");")[0].strip('"') if image_tag and "background-image" in image_tag["style"] else "N/A"

    # Extract Description using scrape_page function
    event_description = scrape_page(event_url) if event_url != "N/A" else "No Description Available"
    time.sleep(0.1)  # Add delay to avoid getting blocked

    events.append([event_name, date_time, location, club_name, image_url, event_url, event_description])

# Write to CSV
csv_file = "events_data.csv"
with open(csv_file, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Event Name", "Date & Time", "Location", "Club", "Image URL", "Event URL", "Description"])
    writer.writerows(events)

print(f"CSV file '{csv_file}' created successfully!")
