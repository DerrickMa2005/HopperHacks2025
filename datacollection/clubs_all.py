import pandas as pd
from bs4 import BeautifulSoup

# Load the HTML content from the file
with open('clubs.html', 'r', encoding='utf-8') as file:
    html_content = file.read()

# Parse the HTML using BeautifulSoup
soup = BeautifulSoup(html_content, 'html.parser')

# Find all the divs containing the organization data
org_divs = soup.find_all('div', class_='MuiPaper-root MuiCard-root')

# Initialize lists to store data
org_names = []
org_links = []
org_descriptions = []
img_sources = []

# Extract the relevant information from each div
for org_div in org_divs:
    # Extract the link to the organization's page
    link_tag = org_div.find('a', href=True)
    if link_tag:
        org_link = link_tag['href']
    else:
        org_link = None
    
    # Extract the organization name
    name_tag = org_div.find('div', style=True)
    if name_tag:
        org_name = name_tag.get_text(strip=True)
    else:
        org_name = None
    
    # Extract the description
    description_tag = org_div.find('p', class_='DescriptionExcerpt')
    if description_tag:
        org_description = description_tag.get_text(strip=True)
    else:
        org_description = None
    
    # Extract the image source (logo)
    img_tag = org_div.find('img', alt=True)
    if img_tag:
        img_src = img_tag['src']
    else:
        img_src = None
    
    # Append the data to the lists
    org_names.append(org_name)
    org_links.append(org_link)
    org_descriptions.append(org_description)
    img_sources.append(img_src)

# Create a DataFrame from the lists
df = pd.DataFrame({
    'Organization Name': org_names,
    'Link': org_links,
    'Description': org_descriptions,
    'Image Source': img_sources
})

# Save the DataFrame to a CSV file
df.to_csv('organizations.csv', index=False)

print("Data saved to organizations.csv")
