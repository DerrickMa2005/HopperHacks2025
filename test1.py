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

def scrape_host_organizations(url):
    """
    Extracts all organizations listed under 'Host Organizations' from the given event page URL.
    """
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        soup = BeautifulSoup(driver.page_source, "html.parser")

        ### Step 1: Locate 'Host Organizations' Section ###
        host_org_heading = soup.find("h2", string="Host Organizations")
        if not host_org_heading:
            return ["No host organizations section found"]

        ### Step 2: Find All Organizations Listed ###
        host_org_container = host_org_heading.find_next("div")
        if not host_org_container:
            return ["No organizations found under 'Host Organizations'"]

        org_names = [h3.text.strip() for h3 in host_org_container.find_all("h3")]
        
        return org_names if org_names else ["No organization names found"]

    except Exception as e:
        return [f"Error retrieving host organizations: {str(e)}"]

    finally:
        driver.quit()

# Example Usage
if __name__ == "__main__":
    event_url = "https://stonybrook.campuslabs.com/engage/event/10969292"
    all_host_orgs = scrape_host_organizations(event_url)
    print("Host Organizations:")
    for org in all_host_orgs:
        print("-", org)
