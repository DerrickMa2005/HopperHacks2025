from selenium import webdriver
from selenium.webdriver.chrome.service import Service
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
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
driver = webdriver.Chrome(options=chrome_options)

def scrape_page(url):
    """
    Scrapes the given URL and returns the h1 text and description text.
    """
    driver.get(url)
    
    # Wait for the page to load
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
    except:
        print(f"Timed out waiting for {url} to load.")
    
    # Parse the page source
    soup = BeautifulSoup(driver.page_source, "html.parser")
    
    # Extract the description text
    description_div = soup.find("div", class_="DescriptionText")
    description_text = "\n".join(p.text.strip() for p in description_div.find_all("p")) if description_div else "Description element not found"
    
    return description_text

print(scrape_page("https://stonybrook.campuslabs.com/engage/event/10853813"))