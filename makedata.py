import csv
from bs4 import BeautifulSoup

# Read the HTML file
html_file = "events_page.html"  # Update with your actual file path
with open(html_file, "r", encoding="utf-8") as file:
    soup = BeautifulSoup(file, "html.parser")

# Find all event cards
events = []
event_cards = soup.find_all("a", href=True)

for event in event_cards:
    event_url = event["href"]  # Extract event URL
    
    # Extract Event Name
    event_name_tag = event.find("h3")
    event_name = event_name_tag.text.strip() if event_name_tag else "Unknown Event"

    # Extract Date & Time
    date_time_tag = event.find_all("svg")[0].find_next_sibling(text=True)
    date_time = date_time_tag.strip() if date_time_tag else "Unknown Date & Time"

    # Extract Location
    location_tag = event.find_all("svg")[1].find_next_sibling(text=True)
    location = location_tag.strip() if location_tag else "Unknown Location"

    # Extract Club Name
    club_tag = event.find("img", alt=True)
    club_name = club_tag["alt"] if club_tag else "Unknown Club"

    # Extract Event Image URL
    image_tag = event.find("div", role="img")
    image_url = image_tag["style"].split("background-image: url(")[-1].split(");")[0].strip('"') if image_tag else "No Image"

    # Save extracted details
    events.append([event_name, date_time, location, club_name, image_url, event_url])

# Write data to CSV file
csv_file = "events_data.csv"
with open(csv_file, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Event Name", "Date & Time", "Location", "Club", "Image URL", "Event URL"])
    writer.writerows(events)

print(f"CSV file '{csv_file}' created successfully with detailed event data!")
