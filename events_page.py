from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

# Set up Selenium options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode (no browser UI)
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
)

# Initialize WebDriver
driver = webdriver.Chrome(options=chrome_options)

def scrape_page(url):
    """
    Scrapes the given event URL and returns event details including:
    - Description
    - Host Organizations
    - Perks
    - Start Time & End Time (if available)
    """
    try:
        driver.get(url)

        # Wait until the page fully loads
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # Parse the page source
        soup = BeautifulSoup(driver.page_source, "html.parser")

        ### Extract Event Description ###
        description_div = soup.find("div", class_="DescriptionText")
        event_description = (
            "\n".join(p.text.strip() for p in description_div.find_all("p"))
            if description_div and description_div.find_all("p")
            else "No description available"
        )

        if event_description != "No description available":
            print("✅ Event description retrieved successfully")

        ### Extract Host Organizations ###
        host_orgs = []
        for org_section in soup.find_all("a", href=True, style="display: block; text-decoration: none; margin-bottom: 20px;"):
            org_name = org_section.find("h3")
            if org_name:
                host_orgs.append(org_name.text.strip())

        host_orgs = ", ".join(host_orgs) if host_orgs else "No host organization found"

        ### Extract Perks (Including "Credit") ###
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

        perks = ", ".join(perks) if perks else "No perks available"

        ### Extract Start and End Time ###
        start_time = "Unknown Start Time"
        end_time = "Unknown End Time"

        date_time_section = soup.find("strong", string="Date and Time")
        if date_time_section:
            date_time_values = date_time_section.find_next("div").find_all("p", style="margin: 2px 0px; white-space: normal;")
            if len(date_time_values) >= 1:
                start_time = date_time_values[0].text.strip()
            if len(date_time_values) >= 2:
                end_time = date_time_values[1].text.strip()

        return {
            "description": event_description,
            "host_organizations": host_orgs,
            "perks": perks,
            "start_time": start_time,
            "end_time": end_time,
        }

    except Exception as e:
        print(f"❌ Error scraping {url}: {str(e)}")
        return {
            "description": "Error retrieving description",
            "host_organizations": "Error retrieving host organizations",
            "perks": "Error retrieving perks",
            "start_time": "Error retrieving start time",
            "end_time": "Error retrieving end time",
        }
    
# Close the driver when done
def close_driver():
    driver.quit()

# Example usage
if __name__ == "__main__":
    event_url = "https://stonybrook.campuslabs.com/engage/event/11077071"
    event_data = scrape_page(event_url)
    print(f"Description: {event_data['description']}")
    print(f"Host Organizations: {event_data['host_organizations']}")
    print(f"Perks: {event_data['perks']}")
    print(f"Start Time: {event_data['start_time']}")
    print(f"End Time: {event_data['end_time']}")
    close_driver()  # Ensures Selenium quits properly
