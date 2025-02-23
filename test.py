from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import re

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
    - All Host Organizations (plus a 'first_host_org' field for the first)
    - Perks (ensuring "Credit" is included)
    - Categories (if present)
    - Start Time & End Time (if available)
    """
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        soup = BeautifulSoup(driver.page_source, "html.parser")

        # --- Extract Event Description ---
        description_div = soup.find("div", class_="DescriptionText")
        if description_div:
            # Collect all <p> text
            paragraphs = [p.get_text(strip=True) for p in description_div.find_all("p")]
            event_description = "\n".join(paragraphs) if paragraphs else description_div.get_text(strip=True)
        else:
            event_description = "No description available"

        # --- Extract All Host Organizations ---
        #   Some pages have <h2> that says "Host Organization", "Host Organizations",
        #   or even "Hosted by X organizations". We'll search for any <h2> whose text
        #   contains "host organization" or "hosted by".
        host_org_heading = soup.find(
            "h2",
            string=lambda t: t
            and (
                "host organization" in t.lower()
                or "hosted by" in t.lower()
            )
        )

        host_organizations = []
        if host_org_heading:
            # The next container is often a <div> or the heading's sibling
            # We specifically look for <a> with '/engage/organization/' to avoid RSVP links
            container = host_org_heading.find_next_sibling()
            if container:
                org_links = container.find_all("a", href=re.compile(r"/engage/organization/"))
                for link in org_links:
                    # Sometimes the org name might be in <h3>, or link text, etc.
                    # We'll try <h3> first, else fallback to link text.
                    h3 = link.find("h3")
                    if h3 and h3.get_text(strip=True):
                        host_organizations.append(h3.get_text(strip=True))
                    else:
                        # fallback to the link's own text
                        text = link.get_text(strip=True)
                        if text:
                            host_organizations.append(text)

        # If no orgs found that way, look for a <div> after the heading
        # in case the structure is slightly different.
        if not host_organizations and host_org_heading:
            # Sometimes the container is not the next sibling but the next HTML element
            container = host_org_heading.find_next("div")
            if container:
                org_links = container.find_all("a", href=re.compile(r"/engage/organization/"))
                for link in org_links:
                    h3 = link.find("h3")
                    if h3 and h3.get_text(strip=True):
                        host_organizations.append(h3.get_text(strip=True))
                    else:
                        text = link.get_text(strip=True)
                        if text:
                            host_organizations.append(text)

        if not host_organizations:
            # As a fallback, see if there's a direct "Hosted by" text block
            # that lists multiple orgs in a single line.
            # This is just an optional fallback, can be removed if unneeded.
            hosted_by_block = soup.find(lambda tag: tag.name in ["div", "span"] and "Hosted by" in tag.get_text())
            if hosted_by_block:
                # Attempt to parse <a> from that block
                org_links = hosted_by_block.find_all("a", href=re.compile(r"/engage/organization/"))
                for link in org_links:
                    text = link.get_text(strip=True)
                    if text:
                        host_organizations.append(text)

        if not host_organizations:
            host_organizations_str = "No organizations found"
            first_host_org = "No organizations found"
        else:
            host_organizations_str = ", ".join(host_organizations)
            first_host_org = host_organizations[0]

        # --- Extract Perks (Including "Credit") ---
        perks = []
        perks_section = soup.find("h2", string=lambda t: t and "perks" in t.lower())
        if perks_section:
            container = perks_section.find_next_sibling("div")
            if container:
                for perk_item in container.find_all("div", style="margin-bottom: 5px;"):
                    perk_text = perk_item.find("span")
                    perk_label = perk_text.get_text(strip=True) if perk_text else "Unknown Perk"
                    perks.append(perk_label)
        # Always ensure "Credit" is included
        if "Credit" not in perks:
            perks.append("Credit")
        perks_str = ", ".join(perks) if perks else "No perks available"

        # --- Extract Categories ---
        categories = []
        categories_heading = soup.find("h2", string=lambda t: t and "categor" in t.lower())
        if categories_heading:
            # The categories might be in the next sibling or in some child container
            cat_container = categories_heading.find_next_sibling()
            if cat_container:
                # In some cases, categories might be in <span> or <a> tags, or <li> items.
                # Adjust as needed based on your actual HTML structure.
                possible_items = cat_container.find_all(["span", "a", "li"], string=True)
                for item in possible_items:
                    cat_text = item.get_text(strip=True)
                    if cat_text:
                        categories.append(cat_text)
        categories_str = ", ".join(categories) if categories else "No categories found"

        # --- Extract Start/End Time ---
        start_time, end_time = "Unknown Start Time", "Unknown End Time"
        date_time_section = soup.find("strong", string=lambda t: t and "date and time" in t.lower())
        if date_time_section:
            dt_div = date_time_section.find_next("div")
            if dt_div:
                date_lines = [
                    p.get_text(strip=True)
                    for p in dt_div.find_all("p", style="margin: 2px 0px; white-space: normal;")
                    if p.get_text(strip=True)
                ]
                if len(date_lines) == 2:
                    start_time, end_time = date_lines
                elif len(date_lines) == 1 and " to " in date_lines[0]:
                    splitted = date_lines[0].split(" to ", 1)
                    start_time, end_time = splitted if len(splitted) > 1 else (splitted[0], "Unknown End Time")
                elif len(date_lines) == 1:
                    start_time = date_lines[0]

        return {
            "description": event_description,
            "host_organizations": host_organizations_str,
            "first_host_org": first_host_org,
            "perks": perks_str,
            "categories": categories_str,
            "start_time": start_time,
            "end_time": end_time,
        }

    except Exception as e:
        print(f"❌ Error scraping {url}: {str(e)}")
        return {
            "description": "Error retrieving description",
            "host_organizations": "Error retrieving host organization",
            "first_host_org": "Error retrieving first host organization",
            "perks": "Error retrieving perks",
            "categories": "Error retrieving categories",
            "start_time": "Error retrieving start time",
            "end_time": "Error retrieving end time",
        }

def close_driver():
    driver.quit()

# Example usage:
if __name__ == "__main__":
    event_url = "https://stonybrook.campuslabs.com/engage/event/10719734"
    data = scrape_page(event_url)
    print("Description:", data["description"])
    print("Host Organizations:", data["host_organizations"])
    print("First Host Org:", data["first_host_org"])
    print("Perks:", data["perks"])
    print("Categories:", data["categories"])
    print("Start Time:", data["start_time"])
    print("End Time:", data["end_time"])

    close_driver()
