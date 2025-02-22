import pyautogui

print("Move your mouse over the 'Load More' button and wait 5 seconds...")
pyautogui.sleep(5)

x, y = pyautogui.position()
print(f"Button is located at: X = {x}, Y = {y}")

